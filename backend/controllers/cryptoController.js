const Crypto = require("../models/crypto");


exports.getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find({});
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getTopGainers = async (req, res) => {
  try {
    const gainers = await Crypto.find({}).sort({ change24h: -1 });
    res.json(gainers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getNewListings = async (req, res) => {
  try {
    const newListings = await Crypto.find({}).sort({ createdAt: -1 });
    res.json(newListings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.addCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h } = req.body;

    if (!name || !symbol || !price || !image || change24h === undefined) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const cryptoExists = await Crypto.findOne({ symbol: symbol.toUpperCase() });
    if (cryptoExists) {
      return res.status(400).json({ message: "Cryptocurrency with this symbol already exists" });
    }

    const crypto = await Crypto.create({
      name,
      symbol,
      price,
      image,
      change24h,
    });

    res.status(201).json({
      message: "Cryptocurrency added successfully",
      data: crypto
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
