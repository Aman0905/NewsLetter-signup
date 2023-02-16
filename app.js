const express = require("express");
const body = require("body-parser");
const request = require("request");

const https = require("https");
const { url } = require("inspector");

const app = express();

app.use(express.static("public"));
app.use(body.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;

  var data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/a60893ffe6/members";
  const options = {
    method: "POST",
    auth: "aman1:a9430ae056724249569e349a67d3bbee-us21",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/suc.html");
    } else {
      res.sendFile(__dirname + "/fail.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("Running");
});
