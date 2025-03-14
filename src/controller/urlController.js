const Url = require("../models/Url");
const shortid = require("shortid"); 

// Shorten URL
const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(401).json({ error: "Please provide a URL" });
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // Check for existing URL
    let existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      return res.json(existingUrl);
    }

    // Generate a short URL using shortid
    const shortUrl = shortid.generate();
    const newUrl = new Url({ originalUrl, shortUrl });
    await newUrl.save();

    res.json(newUrl);
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all URLs
const getallUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Redirect URL and track clicks
const redirectUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Increment click count safely
    url.clicks = (url.clicks || 0) + 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error redirecting URL:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete URL by ID
const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findByIdAndDelete(req.params.id);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { shortenUrl, getallUrls, redirectUrl, deleteUrl };
