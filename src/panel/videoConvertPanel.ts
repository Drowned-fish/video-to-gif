import * as vscode from "vscode";
import { getWebviewContent } from "../utils/getWebviewContent";
import { convertVideoToGif } from "../utils/converter";
import * as path from "node:path";
import * as fs from "node:fs";

export class VideoConvertPanel {
  public static currentPanel: VideoConvertPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private static readonly stateKey = "videoToGif.panelState";
  private static context: vscode.ExtensionContext;
  private selectedFilePath: string = "";

  public static init(context: vscode.ExtensionContext) {
    VideoConvertPanel.context = context;
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;

    // 从状态中恢复数据
    const state = VideoConvertPanel.context.globalState.get<{
      selectedFile: string;
    }>(VideoConvertPanel.stateKey) || { selectedFile: "" };

    this.selectedFilePath = state.selectedFile;

    this._panel.webview.html = getWebviewContent(
      this._panel.webview,
      extensionUri,
      state
    );

    this._setWebviewMessageListener(this._panel.webview);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public dispose() {
    VideoConvertPanel.currentPanel = undefined;

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  public static createOrShow(extensionUri: vscode.Uri) {
    if (VideoConvertPanel.currentPanel) {
      VideoConvertPanel.currentPanel._panel.reveal(); // 不销毁，只显示
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "videoToGif",
      "Video to GIF Converter",
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        localResourceRoots: [extensionUri],
        retainContextWhenHidden: true, // 隐藏时保留内容
      }
    );

    VideoConvertPanel.currentPanel = new VideoConvertPanel(panel, extensionUri);
  }

  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      async (message: any) => {
        switch (message.command) {
          case "selectFile":
            const fileUri = await vscode.window.showOpenDialog({
              canSelectFiles: true,
              canSelectFolders: false,
              canSelectMany: false,
              filters: {
                Videos: ["mp4", "mov", "avi", "mkv"],
              },
              title: "选择要转换的视频文件",
            });

            if (fileUri && fileUri[0]) {
              this.selectedFilePath = fileUri[0].fsPath;
              // 通知 webview 文件已选择
              webview.postMessage({
                type: "fileSelected",
                fileName: fileUri[0].path.split("/").pop(),
              });
            }
            return;

          case "convert":
            if (!this.selectedFilePath) {
              vscode.window.showErrorMessage("请先选择视频文件");
              return;
            }

            try {
              // 检查输出文件是否已存在
              const dir = path.dirname(this.selectedFilePath);
              const outputPath = message.outputName
                ? path.join(dir, `${message.outputName}.gif`)
                : this.selectedFilePath.replace(/\.[^/.]+$/, "") + ".gif";

              if (fs.existsSync(outputPath)) {
                const answer = await vscode.window.showWarningMessage(
                  `文件 "${outputPath}" 已存在，是否覆盖？`,
                  { modal: true },
                  "覆盖",
                  "取消"
                );

                if (answer !== "覆盖") {
                  return;
                }
              }

              await vscode.window.withProgress(
                {
                  location: vscode.ProgressLocation.Notification,
                  title: "正在转换视频...",
                  cancellable: false,
                },
                async () => {
                  const outputPath = await convertVideoToGif(
                    this.selectedFilePath,
                    {
                      ...message.options,
                      outputName: message.outputName,
                    }
                  );
                  vscode.window.showInformationMessage("转换成功！");
                  webview.postMessage({
                    type: "convertSuccess",
                    outputPath: outputPath,
                  });
                }
              );
            } catch (error) {
              vscode.window.showErrorMessage(`转换失败: ${error}`);
            }
            return;
          case "openFile":
            const uri = vscode.Uri.file(message.outputPath);
            vscode.commands.executeCommand("vscode.open", uri);
            return;
          case "saveState":
            await VideoConvertPanel.context.globalState.update(
              VideoConvertPanel.stateKey,
              message.state
            );
            return;
        }
      },
      undefined,
      this._disposables
    );
  }
}
