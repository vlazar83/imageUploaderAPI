var express = require("express");
var router = express.Router();

var multer = require("multer");
const maxSize = 1 * 1024 * 1024; // for 1MB
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
  limits: { fileSize: maxSize },
});
var upload = multer({ storage: storage }).array("files", 2);

router.post("/upload3", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(400);
      res.send(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(500);
      res.send(err);
    }

    // Everything went fine.
    console.log(req.files);
    var responseFileNamesArray = [];
    req.files.forEach(function (item, index) {
      responseFileNamesArray.push(
        "http://localhost:3000/images/" + item.filename
      );
    });
    res.json({ fileUrls: responseFileNamesArray });
  });
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
