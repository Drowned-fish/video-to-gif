import * as vscode from "vscode";
import * as path from "node:path";
import * as fs from "node:fs";

export function getWebviewContent(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  state: Record<string, string> = {}
) {
  const templatePath = vscode.Uri.joinPath(
    extensionUri,
    "dist",
    "template.html"
  );
  let template = fs.readFileSync(templatePath.fsPath, "utf8");
  // 注入初始状态到模板
  template = template.replace(
    "</head>",
    `<script>
      window.initialState = ${JSON.stringify(state)};
    </script>
    </head>`
  );

  return template;
}
