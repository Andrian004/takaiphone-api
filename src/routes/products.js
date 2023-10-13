const express = require("express");
const router = express.Router();

const productsCtrl = require("../controllers/productsCtrl");

// get all
router.get("/", productsCtrl.get);

// search
router.get("/search", productsCtrl.search);

// select by categories
router.get("/select", productsCtrl.select);

// get by id
router.get("/:id", productsCtrl.getById);

// post
router.post("/", productsCtrl.post);

module.exports = router;
