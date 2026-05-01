const Crypto = require('../models/Crypto');

// @desc    Get all cryptocurrencies
// @route   GET /api/crypto
// @access  Public
const getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ addedAt: -1 });

    res.status(200).json({
      success: true,
      count: cryptos.length,
      data: cryptos
    });
  } catch (error) {
    console.error('Get all cryptos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cryptocurrencies.'
    });
  }
};

// @desc    Get top gainers (highest 24h % change)
// @route   GET /api/crypto/gainers
// @access  Public
const getTopGainers = async (req, res) => {
  try {
    const gainers = await Crypto.find({ change24h: { $gt: 0 } })
      .sort({ change24h: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: gainers.length,
      data: gainers
    });
  } catch (error) {
    console.error('Get top gainers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching top gainers.'
    });
  }
};

// @desc    Get new listings (most recently added)
// @route   GET /api/crypto/new
// @access  Public
const getNewListings = async (req, res) => {
  try {
    const newListings = await Crypto.find()
      .sort({ addedAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: newListings.length,
      data: newListings
    });
  } catch (error) {
    console.error('Get new listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching new listings.'
    });
  }
};

// @desc    Add a new cryptocurrency
// @route   POST /api/crypto
// @access  Public (or Private — add protect middleware as needed)
const addCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h } = req.body;

    // Validate required fields
    if (!name || !symbol || price === undefined || !image || change24h === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, symbol, price, image, and 24h change.'
      });
    }

    // Check if symbol already exists
    const existing = await Crypto.findOne({ symbol: symbol.toUpperCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A cryptocurrency with symbol "${symbol.toUpperCase()}" already exists.`
      });
    }

    const crypto = await Crypto.create({
      name,
      symbol,
      price: parseFloat(price),
      image,
      change24h: parseFloat(change24h)
    });

    res.status(201).json({
      success: true,
      message: `${crypto.name} (${crypto.symbol}) has been listed successfully.`,
      data: crypto
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    console.error('Add crypto error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding cryptocurrency.'
    });
  }
};

module.exports = { getAllCryptos, getTopGainers, getNewListings, addCrypto };
