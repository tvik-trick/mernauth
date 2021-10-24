const express = require("express");
const app = express();

const cors = require("cors");
const User = require("./models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://vinay:vinay123@cluster0.wwx9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority ",

  {
    useNewUrlParser: true,
  }
);
//const SEC_KEY = process.env.sec_key;
app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      "sec123"
    );
    app.get("/api/quote", async (req, res) => {
      const token = req.headers["x-access-token"];

      try {
        const decoded = jwt.verify(token, "sec123");
        const id = decoded.id;
        const user = await User.findOne({ _id: id });

        return res.json({ status: "ok", quote: user.quote });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", error: "invalid token" });
      }
    });

    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});
app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "sec123");
    const id = decoded.id;
    await User.updateOne({ _id: id }, { $set: { quote: req.body.quote } });

    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));

  const path = require("path");

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(process.env.PORT, () => {
  console.log("Server started on 1337");
});
