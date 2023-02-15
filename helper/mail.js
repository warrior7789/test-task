const nodemailer = require("nodemailer");
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

const sendMail = (toMail, subject, body, fullName, template, ctaLink) => {
  let transporter;
  return new Promise((resolve, reject) => { 
    console.log(toMail, subject, body, fullName, template, ctaLink);

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "admin@vrussoft.com",//process.env.EMAIL,
        pass: "umashakti@1"//process.env.PASS,
      },

      // address: "smtp.gmail.com",
      // port: 587,
      // domain: "gmail.com",
      // user_name: process.env.EMAIL,
      // password: process.env.PASS,
      // authentication: "plain",
    });
    // if (process.env.NODE_ENV === "development") {
    // } else {
    //   transporter = nodemailer.createTransport({
    //     host: process.env.smtp.host,
    //     port: process.env.smtp.port,
    //     // secure: process.env.smtp.secure,
    //     auth: {
    //       user: process.env.SMTP_USER,
    //       pass: process.env.smtp.pass,
    //     },
    //   });
    // }
  
    // const handlebarOptions = {
    //   viewEngine: {
    //     partialsDir: path.resolve('./views/emails'),
    //     defaultLayout: false,
    //   },
    //   viewPath: path.resolve('./views/emails'),
    // };
  
    // transporter.use('compile', hbs(handlebarOptions))
  
  
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email transporter working fine.");
      }
    });
  
    const mailData = {
      from:"admin@vrussoft.com" ,//process.env.EMAIL, // sender address
      to: toMail, // list of receivers
      subject: subject, // Subject line
      // text: body, // plain text body
      html: body, // html body
    };
    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        console.log(error.message);
        return resolve(false);
      } else {
        console.log("email sent" + info.response);
        return resolve(true);
      }
    });
  })
};

module.exports = { sendMail };
