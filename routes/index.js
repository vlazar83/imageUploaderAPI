var express = require("express");
var router = express.Router();
let constants = require("../utils/const.js").constants;
let errorCodes = require("../utils/errorCodes.js").errorCodes;

var multer = require("multer");
let fileFilter = function (req, file, cb) {
  var allowedMimes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      {
        success: false,
        message: "Invalid file type. Only jpg, png image files are allowed.",
      },
      false
    );
  }
};

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
    if (file.mimetype === "image/jpg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
  fileFilter: fileFilter,
});

var upload = multer({
  storage: storage,
  limits: { fileSize: constants.MAXFILESIZE },
}).array("files", constants.NUMBER_OF_ACCEPTED_FILES);

router.post("/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(400);
      if (err.code == errorCodes.LIMIT_UNEXPECTED_FILE) {
        res.send({
          errorCode: errorCodes.LIMIT_UNEXPECTED_FILE_ERROR_CODE,
          error: errorCodes.LIMIT_UNEXPECTED_FILE_ERROR_MESSAGE,
        });
      } else if (err.code == errorCodes.LIMIT_FILE_SIZE) {
        res.send({
          errorCode: errorCodes.LIMIT_FILE_SIZE_ERROR_CODE,
          error: errorCodes.LIMIT_FILE_SIZE_ERROR_MESSAGE,
        });
      } else {
        res.send(err);
      }
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(500);
      res.send(err);
    } else {
      // check if we received constants.NUMBER_OF_ACCEPTED_FILES files
      if (req.files.length != constants.NUMBER_OF_ACCEPTED_FILES) {
        res.status(400);
        res.json({
          errorCode: errorCodes.INCORRECT_AMOUNT_OF_FILES_ERROR_CODE,
          error: errorCodes.INCORRECT_AMOUNT_OF_FILES_ERROR_MESSAGE,
        });
      } else {
        // Everything went fine.
        console.log(req.files);
        var responseFileNamesArray = [];
        req.files.forEach(function (item, index) {
          responseFileNamesArray.push(
            "http://localhost:3000/images/" + item.filename
          );
        });
        res.json({ fileUrls: responseFileNamesArray });
      }
    }
  });
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
