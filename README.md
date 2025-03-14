# Video to GIF Converter

一个简单的 VS Code 扩展，用于将视频文件转换为 GIF 动图。

![](https://raw.githubusercontent.com/username/video-to-gif/main/images/preview.gif)

## 功能特点

- 支持多种视频格式（mp4、mov、avi、mkv）
- 可自定义 GIF 输出参数
  - 帧率（FPS）
  - 输出宽度
  - 图片质量
  - 自定义输出文件名
- 在 VS Code 中直接操作，无需离开编辑器
- 转换完成后可直接预览
- 自动记住上次的转换设置

## 使用方法

1. 点击 VS Code 编辑器右上角的工具图标按钮
2. 点击"选择视频文件"按钮选择要转换的视频
3. 设置转换参数：
   - 输出文件名（可选，默认使用原文件名）
   - 帧率（默认 10fps）
   - 输出宽度（默认 800px）
   - 质量（1-100，默认 80）
4. 点击"转换"按钮开始转换
5. 转换完成后可点击输出路径直接打开生成的 GIF

## 特色功能

- 智能状态保存：自动记住上次的转换设置和文件选择
- 文件覆盖保护：当输出文件已存在时会提示确认
- 提示：转换过程中显示进度通知
- 预览：转换完成后可直接打开查看结果

## 注意事项

- 转换大文件可能需要较长时间，请耐心等待
- 输出文件将保存在原视频文件所在目录
- 如果未指定输出文件名，将使用原文件名（自动添加扩展名为 .gif）
- 建议根据需求适当调整质量参数，以平衡文件大小和图片质量

## 系统要求

- VS Code 版本: 1.60.0 或更高
- 操作系统: Windows/MacOS/Linux

## 问题反馈

如有问题或建议，欢迎在 GitHub 提交 Issue。

## 许可证

MIT