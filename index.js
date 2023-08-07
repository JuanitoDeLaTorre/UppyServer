const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const multer = require("multer");

//GOOGLE CLOUD SETUP
const { Storage } = require("@google-cloud/storage");
const gc = new Storage({
  keyFilename: path.join(__dirname, "/uppytesting-04f85dc78b7f.json"),
  projectId: "uppytesting",
});

const uppyBucket = gc.bucket("uppytest-2296");

gc.getBuckets().then((x) => console.log(x));

///////////////////

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

app.post("/image", upload, async (req, res) => {
  console.log(req.file);
  // console.log(req.body.imageData);
  // const imageData = req.body.imageData;
  // const imageBuffer = Buffer.from(imageData, "base64");

  // console.log(imageBuffer);

  const uploadedFile = await uploadToGoogleCloudStorage(req.file);
  console.log("File uploaded to Google Cloud Storage:", uploadedFile);
});

async function uploadToGoogleCloudStorage(file) {
  return new Promise((resolve, reject) => {
    // Set the destination file name in Google Cloud Storage
    // const fileName = `${Date.now()}_${path.basename(file.originalname)}`;
    const fileName = "testerfile";

    // Upload the file to the specified bucket
    const bucket = uppyBucket;
    const fileStream = bucket.file(fileName).createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    fileStream.on("error", (err) => {
      reject(err);
    });

    fileStream.on("finish", () => {
      // Set the public URL for the file
      const publicUrl = `https://storage.googleapis.com/uppytest-2296/${fileName}`;
      resolve(publicUrl);
    });

    // Pipe the file data into the write stream
    fileStream.end(file.buffer);
  });
}

app.listen(port, (req, res) => {
  console.log("Listening on port " + port);
});
