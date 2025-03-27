const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const oauth_link = "https://developers.google.com/oauthplayground";
const { EMAIL, REFRESH_TOKEN, MAILLING_SECRET, MAILLING_ID, EMAIL_PASSWORD } =
  process.env;

const auth = new OAuth2(
  MAILLING_ID,
  MAILLING_SECRET,
  REFRESH_TOKEN,
  oauth_link
);

const createTransporter = async () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });
};

exports.sendVerificationMail = async (email, name, url) => {
  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Heartify Verification",
      html: `<div style="padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 7px;">
                <h1 style="font-family: 'Lucida Sans', Geneva, Verdana, sans-serif; line-height: 25px;">Hello ${name}...</h1>
                <p style="font-family: 'Lucida Sans', Geneva, Verdana, sans-serif; margin:15px 0;">
                  Hello ${name}. Hope you're doing well. Please verify your account to stay with us.
                </p>
                <a href=${url} style="font-weight: bold; text-decoration: none; border: 1px solid #ddd; padding: 10px 20px; border-radius: 4px; display: inline-block;"
                   onmouseover="this.style.backgroundColor='#ebd2d2'"
                   onmouseleave="this.style.backgroundColor='transparent'">
                  Email Verify
                </a>
              </div>`,
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    return error.message;
  }
};

exports.sendCode = async (email, name, code) => {
  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `<div style="padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 7px;">
                <h1 style="font-family: 'Lucida Sans', Geneva, Verdana, sans-serif; line-height: 25px;">Hello ${name}...</h1>
                <p style="font-family: 'Lucida Sans', Geneva, Verdana, sans-serif; margin:15px 0;">
                  Hello ${name}. Hope you're doing well. Please use the code below to reset your password.
                </p>
                <p style="font-weight: bold; border: 1px solid #ddd; padding: 10px 20px; border-radius: 4px; display: inline-block;"
                   onmouseover="this.style.backgroundColor='#ebd2d2'"
                   onmouseleave="this.style.backgroundColor='transparent'">
                  ${code}
                </p>
              </div>`,
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    return error.message;
  }
};
