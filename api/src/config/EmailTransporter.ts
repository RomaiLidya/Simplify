import aws from 'aws-sdk';
import Email from 'email-templates';
import path from 'path';
import nodeMailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

const {
  EMAIL_SERVICE,
  EMAIL_ENABLE,
  EMAIL_PREVIEW,
  EMAIL_FROM_ADDRESS,
  EMAIL_AWS_SES_API_VERSION,
  EMAIL_AWS_SES_REGION,
  EMAIL_GMAIL_USER,
  EMAIL_GMAIL_PW,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PW
} = process.env;

let transport: Mail;

if (EMAIL_SERVICE === 'aws') {
  transport = nodeMailer.createTransport({
    SES: new aws.SES({
      apiVersion: EMAIL_AWS_SES_API_VERSION,
      region: EMAIL_AWS_SES_REGION
    })
  });
} else if (EMAIL_SERVICE === 'gmail') {
  transport = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_GMAIL_USER,
      pass: EMAIL_GMAIL_PW
    }
  });
} else {
  transport = nodeMailer.createTransport({
    pool: true,
    host: SMTP_HOST,
    port: +SMTP_PORT,
    secure: true, // use TLS
    auth: {
      user: SMTP_USER,
      pass: SMTP_PW
    }
  });
}

console.log(path.join(__dirname, '..'));
const EmailTransporter = new Email({
  views: {
    root: `${__dirname}/../emails`
  },
  message: {
    from: EMAIL_FROM_ADDRESS,
    replyTo: EMAIL_FROM_ADDRESS
  },
  transport,
  send: EMAIL_ENABLE === 'true',
  preview: EMAIL_PREVIEW === 'true'
});

export default EmailTransporter;
