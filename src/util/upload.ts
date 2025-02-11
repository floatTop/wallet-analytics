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
      credentials: {
        type: "service_account",
        project_id: "psyched-summer-450303-h3",
        private_key_id: "3eb65aeaf78192955e04f763e36e6d65b4329802",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwg66cT13Ksbya\n+35pEGDOGJ1DtH5Kk5UuVvf2Lus8BXnQoXOnod5mjR++peFgfpFInHLKV/05HtQm\nqx9F15Gcbdz5HkWA3KiflVXB5/gBGE/IZjuIOtxneor5dP/HQOt8sgaI5x4iSF9h\nBVdLvBTsZz4ONpvkGqSPDvwRg8aUZyRymEla4EARWSWcffBBZrIBkYE9La1/nVhF\nBA4mD5RlR7tYz54QC9x128QlS9uLDyLINeq0BZlVCEolWFgRq5wJnqP2r85WMRLg\n8xWvQcoavmoaWMYi+5zl4MQ4J32kOCDF0RTfpL9UzTa2qOvRPD8N/OtpSJ0xSd89\n2x7V0eTxAgMBAAECggEAAtSIsKJL5OGszlAbILaB09okjuLqbboQL7kWopqR3GFy\n2KHXFbRwaUTo4fTdUE+VNySliUmoAnIEaS6QGr3ELJ29F9w4tXJMTJs/j9NvKD7W\nXCZp/NMjSLA4AVwTNBPeFr6wwMISa06tY1QLaFgmnnwBDGerIBkeg3n0OBhsnyFh\nrFf2GDSZExj00gT2qoIRSCpEN6cA+y3aSmcPFCsIfwUSn8s984+eZ5PuetMGmplR\noK5O6Cz4+EW5Nfv3X3EbvLGF0iGkiahw/DR5X6I83F/Vv+akT0oBENNY0wYmSjSN\ncCeowEOMHxIxaIYpMt3KFcTNEpwa4EaaopXIJ42EwQKBgQDZdU+3+YJXIGT+eb+K\n2tsZ6Ri90xFU52ndO8s13wmwWuX3opB/Kj9pwABhVLC7Ppnp6Kz2jE4bc3bZGc+C\nPh5t+Fed2XGPtsDq1x68z8bPCCT2c3AqswX/C4mCuIvlpDXDqtzAZPs8eONo75Wz\n+aolNCcFobg5vnqEOrQKMiAtsQKBgQDPzKIRaIG66P+AUnhPVE7kbej21prvgO4a\nByRqaPNOG/9GrOo8MgUJle/WC9HaD0whzi1oLv5tFnaCpEmTBT1R7ZWmKoeEouJl\nHwTqSdbrJinIQLiINUbiZcY0NPWkTsxSLuR05kUbOviAkrHl7t6vmk8EDlK1ynzp\nWPU7cia7QQKBgDbief1oNzKAVZ0441RLirNOdtUqWZyBT+Hrvo1ZPtvJBXPsDuZZ\npmmtcSsfsf+AfF5iQI11uh0JlnyTHCG2Rf3hiVOo1xW7vZNIOlTTaE1Gs/WUC0Jr\nrt7BbbKVm5GZUYySKmdQ1Wxc4qDQn4suP3hmYlb0i0ffwJJxMpHENwTxAoGAebEx\nSFiXgMpqts+VPX/2I7hqMgRD//bVedCs9tQ3iIrE2LLzCgWRBagVKJkLcFR9FV8V\nIGpE/cWl6aQkokDzREOK3CET9A0f4HBmBH7xqgxTc77TUpFAzd0kUfah1HOBHK/x\ngrRHzEaguUsve6SELPqFQ67PqT7IIC/Ejeev3wECgYEAsKbtETwlezVY5d4mRkmX\ndQb9AQ8CfdoHcKb1ymcGilHuHG+yKR4bn793h9FzAaWauMSVfwA5uIRBKFZPQY1i\n2V652RT4jNui5GWvhIw6OJjQmZxOMXKdb1UZi01WRaVULQliuYu+F/oEbgd/fCIH\nOGTfuGVgkH0HBFeBzzYIfFU=\n-----END PRIVATE KEY-----\n",
        client_email:
          "googledrive@psyched-summer-450303-h3.iam.gserviceaccount.com",
        client_id: "113858154901678489924",
        // auth_uri: "https://accounts.google.com/o/oauth2/auth",
        // token_uri: "https://oauth2.googleapis.com/token",
        // auth_provider_x509_cert_url:
          // "https://www.googleapis.com/oauth2/v1/certs",
        // client_x509_cert_url:
          // "https://www.googleapis.com/robot/v1/metadata/x509/googledrive%40psyched-summer-450303-h3.iam.gserviceaccount.com",
        universe_domain: "googleapis.com",
      },
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });
    console.log('auth');
    // 创建drive客户端
    const driveService = google.drive({
      version: "v3",
      auth,
    });

    console.log('driveService');
    // 文件元数据
    const fileMetadata = {
      name: fileName,
      parents: ["1hHhmJZdRIf9-q2foCC0lC3vDetp2WIva"], // 可选
    };

    // 媒体配置
    const media = {
      mimeType: "application/json",
      body: JSON.stringify(data),
    };
    console.log('fileMetadata');
    // 执行上传
    const file = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });
    console.log('file');

    console.log("文件链接: https://drive.google.com/file/d/" + file.data.id);
    return file.data.id;
  } catch (err) {
    console.error("上传出错:", err);
    throw err;
  }
}
