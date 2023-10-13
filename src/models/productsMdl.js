const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, require: true },
    category: { type: String, require: true },
    imgUrl: { type: String, require: true },
    stock: { type: Number, require: true },
    price: { type: Number, require: true },
    sold: { type: Number, require: true },
    colors: [{ clr: String }],
    detail: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
