const express = require("express");
const router = express.Router();
const {
  getAllCryptos,
  getTopGainers,
  getNewListings,
  addCrypto,
} = require("../controllers/cryptoController");


router.get("/", getAllCryptos);

router.get("/gainers", getTopGainers);

router.get("/new", getNewListings);

router.post("/", addCrypto);

module.exports = router;
