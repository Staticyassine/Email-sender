const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const sql = require('mssql');
const details = require("./details.json");
const app = express();
app.use(cors({origin: "*"}));
app.use(bodyParser.json());

//SQL SERVERs configuration
const config = {
  server: 'YOUR SERVER HERE',
  database: 'YOUR DATABASE HERE',
  user: 'USER NAME',
  password: 'PASSWORD',
  port: 1433
};

app.listen(3000, () => {
  console.log("The server started on port 3000 !!!!!!");
});

// test your server if it works correctly on the web
app.get("/", (req, res) => {
  res.send(
    "<h1 style='text-align: center'>HELLO WORLD<br><br></h1>"
  );
});

// route to send email
app.post("/sendmail", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMail(user, info => {
    res.send(info);
  });
});

async function sendMail(user, callback) {
  //Email sender
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {      
      user: details.email,
      pass: details.password
    }
  });

  let mailOptions = {
    from: '', // sender address
    to: '', // list of receivers
    subject: "", // Subject line
    html: `<h1>Hello World html content</h2>`
  };

  let info = await transporter.sendMail(mailOptions);
  callback(info);
  console.log('Email sent: ' + info.response);
  //Database storing
  sql.connect(config, function (err) {
    if (err) console.log(err);
   // let sqlRequest = new sql.Request();

    console.log(user.type);
    switch (user.type) {
      case "Farm manager":
        var IdType = 1;
      case "Institutional":
        var IdType = 2;
        break;
      case "Farm operator":
        var IdType = 3;
        break;
      case "Other":
        var IdType = 4;
        break;
    }

    let sqlQuery = "insert into ContactClient values('" + user.email + "'," + IdType + ",'" + user.text + "','" + user.name + "')";
    sql.connect(config, function (err) {
      if (err) console.log(err);
      var request = new sql.Request();
      request.query(sqlQuery);
    });
  });
}

// main().catch(console.error);