const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validateForms/register");
const validateLoginInput = require("../validateForms/login");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const AllPosts = require("../models/AllPosts");
const Verify = require("../models/Verify");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const transport = require("../gmail");

router.post("/register", (req, res) => {
const { errors, isValid } = validateRegisterInput(req.body);

if (!isValid) {
return res.status(400).json(errors);
}

User.findOne({ email: req.body.email }).then((user) => {
if (user) {
return res.status(400).json({ email: "Email already exists" });
} else {
const newUser = new User({
name: req.body.name,
email: req.body.email,
gender: req.body.gender,
password: req.body.password,
});

bcrypt.genSalt(10, (err, salt) => {
bcrypt.hash(newUser.password, salt, (err, hash) => {
if (err) throw err;
newUser.password = hash;
newUser
.save()
.then((user) => {
const allposts = new AllPosts({
user: user._id,
});

allposts
.save()
.then(() => {
var code = "pharmaconn";

for (let i = 0; i < 16; i++) {
var random = Math.floor(Math.random() * 10);
code = code + random;
}

const verify = new Verify({
user: user._id,
verificationCode: code,
});

verify
.save()
.then((newVerify) => {
console.log(newVerify);

const link = `${process.env.CLIENT_URL}/verifyaccount?id=${newVerify.verificationCode}`;

const mailOptions = {
from: `Pharmaconnn ${process.env.MAIL_BOX}`, // sender
to: req.body.email, // receiver
subject:
  "Welcome to Pharmaconn. Please verify your email.", // Subject
html: `<!DOCTYPE html>
<html>
<head>
<title>Pharmaconn verify</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">

<style type="text/css">
@media screen {
@font-face {
font-family: 'Lato';
font-style: normal;
font-weight: 400;
src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
}

@font-face {
font-family: 'Lato';
font-style: normal;
font-weight: 700;
src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
}

@font-face {
font-family: 'Lato';
font-style: italic;
font-weight: 400;
src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
}

@font-face {
font-family: 'Lato';
font-style: italic;
font-weight: 700;
src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
}
}

/* CLIENT-SPECIFIC STYLES */
body,
table,
td,
a {
-webkit-text-size-adjust: 100%;
-ms-text-size-adjust: 100%;
}

table,
td {
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
}

img {
-ms-interpolation-mode: bicubic;
}

/* RESET STYLES */
img {
border: 0;
height: auto;
line-height: 100%;
outline: none;
text-decoration: none;
}

table {
border-collapse: collapse !important;
}

body {
height: 100% !important;
margin: 0 !important;
padding: 0 !important;
width: 100% !important;
}

/* iOS BLUE LINKS */
a[x-apple-data-detectors] {
color: inherit !important;
text-decoration: none !important;
font-size: inherit !important;
font-family: inherit !important;
font-weight: inherit !important;
line-height: inherit !important;
}

/* MOBILE STYLES */
@media screen and (max-width:600px) {
h1 {
font-size: 32px !important;
line-height: 32px !important;
}
}

/* ANDROID CENTER FIX */
div[style*="margin: 16px 0;"] {
margin: 0 !important;
}
</style>
</head>

<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
<!-- HIDDEN PREHEADER TEXT -->
<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<!-- LOGO -->
<tr>
<td bgcolor="#FFA73B" align="center">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
<tr>
<td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
</tr>
</table>
</td>
</tr>
<tr>
<td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
<tr>
<td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
    <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
<tr>
<td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
    <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
</td>
</tr>
<tr>
<td bgcolor="#ffffff" align="left">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href=${link} target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</td>
</tr> <!-- COPY -->
<tr>
<td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
    <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
</td>
</tr> <!-- COPY -->
<tr>
<td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
    <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">${link}</a></p>
</td>
</tr>
<tr>
<td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
    <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>

</html>`,
};
transport.sendMail(mailOptions).then((success) => {
  transport.close();
  res.json({
    success:
      "Registration successfull, email has been sent",
  });
}).catch(err => {
  res.send({
    message: err,
    error: "email message sending failed, login and request a verification mail"

  });
})
})
.catch((err) => res.status(500).json({err}));
})
.catch((err) => res.status(500).json({err}));
})
.catch((err) => res.status(500).json({err}));
});
});
}
});
});

router.post("/verifyaccount/:verificationCode", (req, res) => {
  console.log(req.params.verificationCode);
  Verify.findOne({ verificationCode: req.params.verificationCode })
    
    .then((verify) => {
      if (verify) {
        User.updateOne({ _id: ObjectId(verify.user) }, { isActive: true })
          .then(() => {
            res.json({
              user: verify.user,
              sucess: 'your email has been verified'
            });
          })
          .then(verify.remove())
          .catch((err) =>res.status(500).json({err}));
      } else {
        res.status(404).json({
          error: "Verification token not found in database, account may already be verified or does not exist"
        })
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const { isValid, errors } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      errors.email = "User not found";
      return res.status(400).json(errors);
    }

    if (!user.isActive) {
      errors.verify = "Please verify your account";
      return res.status(400).json(errors);
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          date: user.date,
          isAdmin: user.isAdmin,
        };

        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
          });
        });
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

module.exports = router;
