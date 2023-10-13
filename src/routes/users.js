const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");

const usersCtrl = require("../controllers/userCtrl");

// update data user
router.patch("/", verifyToken, usersCtrl.updateUser);

// get user by id
router.get("/:id", verifyToken, usersCtrl.getUser);

// get user cart
router.get("/cart/:id", verifyToken, usersCtrl.getCart);

// get product in cart by id
router.get("/cart/:uid/:pid", verifyToken, usersCtrl.getCartById);

// add product to cart
router.post("/addToCart", verifyToken, usersCtrl.addToCart);

// delete product in cart
router.delete("/deleteProduct", verifyToken, usersCtrl.deleteProduct);

// buy all products in cart
router.post("/buy", verifyToken, usersCtrl.buy);

// get all data transaction
router.get("/transact/:uid", verifyToken, usersCtrl.getTransact);

// get detail transactions
router.get("/transact/:uid/:id", verifyToken, usersCtrl.detailTransact);

module.exports = router;
