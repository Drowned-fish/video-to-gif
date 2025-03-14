import * as vscode from "vscode";
import { VideoConvertPanel } from "./panel/videoConvertPanel";

export function activate(context: vscode.ExtensionContext) {
  const command = "videoToGif.convert";
  VideoConvertPanel.init(context);
  let disposable = vscode.commands.registerCommand(command, () => {
    VideoConvertPanel.createOrShow(context.extensionUri);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
