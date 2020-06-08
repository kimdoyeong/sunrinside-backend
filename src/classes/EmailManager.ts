import AWS from "aws-sdk";
import env from "../constants/env";

class EmailManager {
  private static SES = new AWS.SES({
    region: "us-east-1",
  });

  private static async sendEmail({ to, html, subject }: SendEmailOptions) {
    const requestEmail = await this.SES.sendEmail({
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Data: html,
            Charset: "utf-8",
          },
        },
        Subject: {
          Data: subject,
          Charset: "utf-8",
        },
      },
      Source: "no-reply@sunrinexit.wtf",
    }).promise();

    return requestEmail.MessageId;
  }

  public static async sendVerifyEmail(to: string, id: string, code: string) {
    const url = env.SITE_URL + "/verify/" + id + "/" + code;
    const html = `
        <h1>Sunrinside 이메일 인증 ✉️</h1>
        <h3>아래 링크를 클릭해 회원가입을 완료하세요.</h3>
        <a href="${url}">${url}</a>
      `;

    await this.sendEmail({
      to,
      html,
      subject: "[Sunrinside] 이메일 인증 ✉️",
    });
  }
}

interface SendEmailOptions {
  to: string;
  html: string;
  subject: string;
}

export default EmailManager;
