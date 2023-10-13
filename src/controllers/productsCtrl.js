const Product = require("../models/productsMdl");

// get all products
exports.get = async (req, res) => {
  try {
    const result = await Product.find();
    res.status(200).json({
      message: "Request berhasil",
      body: result,
    });
  } catch (err) {
    console.log(err);
  }
};

// post new product
exports.post = async (req, res) => {
  const { name, category, imgUrl, stock, price, colors, sold, detail } =
    req.body;

  const Post = new Product({
    name: name,
    category: category,
    imgUrl: imgUrl,
    stock: stock,
    price: price,
    colors: colors,
    sold: sold,
    detail: detail,
  });

  try {
    await Post.save();
    res.status(201).json({ message: "Data berhasil ditambahkan." });
  } catch (err) {
    console.log(err);
  }
};

// get product by id
exports.getById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Product.findById({ _id: id });
    res.status(200).json({
      message: "Request berhasil",
      body: result,
    });
  } catch (err) {
    console.log(err);
  }
};

// search product
exports.search = async (req, res, next) => {
  const keyword = req.query.key;
  const regexPatern = new RegExp(keyword, "i");

  try {
    const result = await Product.find({ name: regexPatern });

    if (result.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan!" });
    }

    res.status(200).json({ message: "Request berhasil!", body: result });
  } catch (err) {
    next(err);
  }
};

// select product by categories
exports.select = async (req, res, next) => {
  const value = req.query.key;

  try {
    if (value === "all") {
      const result = await Product.find();
      res.status(200).json({ message: "Request berhasil!", body: result });
    } else {
      const result = await Product.find({ category: value });

      if (result.length === 0) {
        return res.status(404).json({ message: "Not found", body: result });
      }

      res.status(200).json({ message: "Request berhasil!", body: result });
    }
  } catch (err) {
    next(err);
  }
};
