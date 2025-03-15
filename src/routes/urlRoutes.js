const express = require("express");

const {
  shortenUrl,
  getallUrls,
  redirectUrl,
  deleteUrl,
} = require("../controller/urlController");

const router = express.Router()

router.post("/shorten", shortenUrl);
router.get("/urls", getallUrls);
router.get("/r/:shortUrl", redirectUrl);
router.delete("/urls/:id", deleteUrl);

module.exports = router
