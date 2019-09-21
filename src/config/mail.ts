import { HandlebarsAdapter } from '@nest-modules/mailer';
import * as path from 'path';

export default {
  transport: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  },
  defaults: {
    from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
  },
  template: {
    dir: path.join(__dirname, '..', '..', 'views', 'emails'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
