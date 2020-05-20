const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
const auth = require("./middleware");

const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const app = express();

app.use(cors());
app.use(express.json({ extended: false }));
app.use(awsServerlessExpressMiddleware.eventContext());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== "cadmin" || password !== "123123123") {
    return res.status(400).json({ message: "Invalid credential!!!" });
  }

  const payload = {
    username: username
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 24 * 60 * 60 * 30 },
    (err, token) => {
      if (err) {
        throw err;
      }

      return res.status(200).json({ token });
    }
  );
});

app.get("/data", auth, (req, res) => {
  axios
    .get("https://api.kanye.rest/")
    .then(resp => {
      return res.send(resp.data);
    })
    .catch(err => {
      return res.status(500).json({ err });
    });
});

module.exports = app;
