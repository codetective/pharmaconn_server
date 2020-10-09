const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const myOAuth2Client = new OAuth2(
  process.env.GOOGLE_AUTH_CLIENT_ID,
  process.env.GOOGLE_AUTH_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
myOAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
});
const myAccessToken = myOAuth2Client
  .getAccessToken()
  .then((res) => console.log('connected to gmail'))
  .catch((err) => console.log(err));
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_BOX, //your gmail account you used to set the project up in google cloud console"
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
    accessToken: myAccessToken, //access token variable we defined earlier
  },
});
transport.on("token", (token) => {
  console.log("A new access token was generated");
  console.log("User: %s", token.user);
  console.log("Access Token: %s", token.accessToken);
  console.log("Expires: %s", new Date(token.expires));
});

module.exports = transport;