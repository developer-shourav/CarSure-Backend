import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS,
  default_admin_name: process.env.DEFAULT_ADMIN_NAME,
  default_admin_email: process.env.DEFAULT_ADMIN_EMAIL,
  default_admin_password: process.env.DEFAULT_ADMIN_PASSWORD,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  SP_ENDPOINT: process.env.SP_ENDPOINT,
  SP_USERNAME: process.env.SP_USERNAME,
  SP_PASSWORD: process.env.SP_PASSWORD,
  SP_PREFIX: process.env.SP_PREFIX,
  SP_RETURN_URL: process.env.SP_RETURN_URL,
  nodemailer_user: process.env.NODE_MAILER_USER,
  nodemailer_pass: process.env.NODE_MAILER_PASS,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
