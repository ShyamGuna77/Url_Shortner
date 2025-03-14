const { nanoid } = require("nanoid");
const Url = require("../models/Url");

const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      res.status(401).json({ error: "please provide an Url" });
    }

    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ error: "Invalid URL format" });
    }
    //check for existing Url and Return its Details
    let existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      return res.json({
        existingUrl,
      });
    }

    //Shorten the Url using nanoid and compare

    const shortUrl = nanoid(8);

    const newUrl = new Url({ originalUrl, shortUrl });
    await newUrl.save();
    res.json({ newUrl });
  } catch (error) {
    console.error("Error redirecting URL:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//Get all Urls

const getallUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json({ urls });
  } catch (error) {
    console.error("Error redirecting URL:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//Redirect Url and checking clicks

const redirectUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });
    if (!url) {
      res.status(401).json({ error: "Url doesnt Found" });
    }
    url.clicks++;
    await url.save();
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error redirecting URL:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//Detele The Url by ID

const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findByIdAndDelete(req.params.id);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error redirecting URL:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { shortenUrl, getallUrls, redirectUrl, deleteUrl };
