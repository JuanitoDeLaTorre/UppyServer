const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const multer = require("multer");

const port = 3030;

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder where the uploaded files will be saved
    cb(null, path.join(__dirname, "uploads")); // Change 'uploads' to your desired folder name
  },
  filename: (req, file, cb) => {
    // Set the filename for the uploaded file
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).single("photo");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/bundle.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bundle.js"));
});

app.post("/image", upload, (req, res) => {
  console.log(req.file);
  return res.json({ msg: "AYO WHAT??" });
});

app.listen(port, (req, res) => {
  console.log("Listening on port " + port);
});
