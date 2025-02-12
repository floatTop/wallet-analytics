import { google } from "googleapis";
export async function uploadFile({
  data,
  fileName,
}: {
  data: any;
  fileName: string;
}) {
  try {
    // 认证
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });
    console.log("auth", auth);

    const authClient = await auth.getClient();

    // 创建drive客户端
    const driveService = google.drive({
      version: "v3",
      auth: authClient as any,
    });

    console.log("driveService");
    // 文件元数据
    const fileMetadata = {
      name: fileName,
      parents: ["1hHhmJZdRIf9-q2foCC0lC3vDetp2WIva"], // 可选
    };

    // 媒体配置
    const media = {
      mimeType: "application/json",
      body: JSON.stringify(data, null, 2),
    };
    console.log("fileMetadata");
    // 执行上传
    const file = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });
    console.log("file");

    console.log("文件链接: https://drive.google.com/file/d/" + file.data.id);
    return file.data.id;
  } catch (err) {
    console.error("上传出错:", err);
    throw err;
  }
}
