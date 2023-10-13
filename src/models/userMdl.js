const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, require: true, min: 3 },
    email: { type: String, require: true },
    password: { type: String, require: true, min: 6 },
    address: { type: String, require: true },
    transaksi: [
      {
        address: String, // address for delivery
        products: [
          {
            _id: String, // product id from product document
            productName: String, // from cart
            img: String,
            color: String, // from cart
            qty: Number, // from cart
            totalPrice: Number, // price from cart
          },
        ],
        date: String,
        payment: String,
        status: Boolean,
        totalPrice: Number, // calculate all price in cart
      },
    ],
    keranjang: [
      {
        _id: String,
        productName: String,
        img: String,
        color: String,
        totalPrice: Number,
        qty: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
