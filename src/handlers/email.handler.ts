import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

export const sendEmail = async (email, subject, template, context) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve("./src/templates/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./src/templates/"),
      extName: ".hbs",
    };

    transporter.use("compile", hbs(handlebarOptions));

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      template: template,
      context: context,
    });
    console.log("email send");
  } catch (err) {
    console.log("email", err);
  }
};
