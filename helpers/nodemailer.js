// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");
// const { OAuth2 } = google.auth;
// const oauth_link = "https://developers.google.com/oauthplayground";
// const { EMAIL, REFRESH_TOKEN, MAILLING_SECRET, MAILLING_ID } = process.env;

// const auth = new OAuth2(
//   MAILLING_ID,
//   MAILLING_SECRET,
//   REFRESH_TOKEN,
//   oauth_link
// );
// exports.sendVarifiedMail = (email, name, url) => {
//   auth.setCredentials({
//     refresh_token: REFRESH_TOKEN,
//   });
//   const accessToken = auth.getAccessToken();
//   const stmp = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: EMAIL,
//       clientId: MAILLING_ID,
//       clientSecret: MAILLING_SECRET,
//       refreshToken: REFRESH_TOKEN,
//       accessToken,
//     },
//   });
//   const mailOptions = {
//     from: EMAIL,
//     to: email,
//     subject: "Heartify Varification",
//     html: `<div style=" padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 7px; " > <h1 style=" font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; line-height: 25px; " > Hello ${name}... </h1> <p style=" font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; margin:15px 0 " > Hello ${name}. Hope you're doing well. pLease varify your account to stay with us. </p> <a href=${url} style=" font-weight: bold; text-decoration: none; border: 1px solid #ddd; padding: 10px 20px; border-radius: 4px; display: inline-block; " OnMouseOver="this.style.backgroundColor='#ebd2d2'" OnMouseLeave="this.style.backgroundColor='transparent'" >Email varify</a > </div>`,
//   };
//   stmp.sendMail(mailOptions, (err, res) => {
//     if (err) {
//       return err.message;
//     } else {
//       return res;
//     }
//   });
// };
// // password reset code send
// exports.sendCode = (email, name, code) => {
//   auth.setCredentials({
//     refresh_token: REFRESH_TOKEN,
//   });
//   const accessToken = auth.getAccessToken();
//   const stmp = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: EMAIL,
//       clientId: MAILLING_ID,
//       clientSecret: MAILLING_SECRET,
//       refreshToken: REFRESH_TOKEN,
//       accessToken,
//     },
//   });
//   const mailOptions = {
//     from: EMAIL,
//     to: email,
//     subject: "Password Reset Request",
//     html: `<div style=" padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 7px; " > <h1 style=" font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; line-height: 25px; " > Hello ${name}... </h1> <p style=" font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; margin:15px 0 " > Hello ${name}. Hope you're doing well. pLease varify your account to stay with us. </p> <p style=" font-weight: bold; text-decoration: none; border: 1px solid #ddd; padding: 10px 20px; border-radius: 4px; display: inline-block; " OnMouseOver="this.style.backgroundColor='#ebd2d2'" OnMouseLeave="this.style.backgroundColor='transparent'" >${code}</ p> </div>`,
//   };
//   stmp.sendMail(mailOptions, (err, res) => {
//     if (err) {
//       return err.message;
//     } else {
//       return res;
//     }
//   });
// };

require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// 🔹 OAuth2 Client Setup
const OAuth2Client = new google.auth.OAuth2(
  process.env.MAILLING_ID, // Google Client ID
  process.env.MAILLING_SECRET, // Google Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URI
);

// 🔹 Set Credentials
OAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// 🔹 Create Transporter with Automatic Token Refresh
async function createTransporter() {
  try {
    const accessToken = await OAuth2Client.getAccessToken(); // Google auto-refreshes token

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.MAILLING_ID,
        clientSecret: process.env.MAILLING_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token, // Use auto-refreshed token
      },
    });
  } catch (error) {
    console.error("❌ Error getting access token:", error);
    throw new Error("Failed to retrieve access token");
  }
}

// 📩 Send Verification Email
exports.sendVerificationMail = async (email, name, url) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `Heartify <${process.env.EMAIL}>`,
      to: email,
      subject: "Heartify Account Verification",
      html: `
        <div style="padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 7px;">
          <h1>Hello, ${name} 👋</h1>
          <p>Please verify your email to activate your account.</p>
          <a href="${url}" style="display: inline-block; padding: 10px 20px; border-radius: 4px; background-color: #007bff; color: white; text-decoration: none;">Verify Email</a>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return error;
  }
};

// 🔹 Send Password Reset Email
exports.sendCode = async (email, name, code) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `Heartify <${process.env.EMAIL}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 7px;">
          <h1>Hello, ${name} 👋</h1>
          <p>Use the code below to reset your password:</p>
          <h2 style="background: #f8d7da; display: inline-block; padding: 10px; border-radius: 5px;">${code}</h2>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return error;
  }
};
