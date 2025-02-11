const {google} = require('googleapis');
const path = require('path');


export async function uploadFile({data, fileName}: {data: any, fileName: string}) {
  try {
    // 认证
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, 'credentials.json'),
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });

    // 创建drive客户端
    const driveService = google.drive({
      version: 'v3',
      auth
    });

    // 文件元数据
    const fileMetadata = {
      name: fileName,
      parents: ['1hHhmJZdRIf9-q2foCC0lC3vDetp2WIva'] // 可选
    };

    // 媒体配置
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(data)
    };

    // 执行上传
    const file = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });

    console.log('文件ID:', file.data.id);
    return file.data.id;
    
  } catch (err) {
    console.error('上传出错:', err);
    throw err;
  }
}


