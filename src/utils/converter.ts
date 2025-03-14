const ffmpeg = require("fluent-ffmpeg");
import * as path from "node:path";

interface ConvertOptions {
  fps: number;
  width: number;
  quality: number;
  outputName?: string; // 添加可选的输出文件名
}

export async function convertVideoToGif(
  videoPath: string,
  options: ConvertOptions
): Promise<string> {
  const dir = path.dirname(videoPath);
  const outputPath = options.outputName
    ? path.join(dir, `${options.outputName}.gif`)
    : videoPath.replace(/\.[^/.]+$/, "") + ".gif";

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .fps(options.fps)
      .size(`${options.width}x?`)
      .output(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err: any) => reject(new Error(`转换失败: ${err.message}`)))
      .run();
  });
}
