// model
const User = require("../models/userMdl");
const Product = require("../models/productsMdl");

// update user
exports.updateUser = async (req, res, next) => {
  const { username, address, id } = req.body;

  try {
    const result = await User.updateOne(
      { _id: id },
      { $set: { username: username, address: address } }
    );
    res.status(200).json({
      message: "Data berhasil diupdate!",
      body: result,
    });
  } catch (err) {
    next();
  }
};

// get user by id
exports.getUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const result = await User.findById({ _id: userId });
    const data = {
      username: result.username,
      email: result.email,
      address: result.address,
    };
    res.status(200).json({ message: "Request berhasil!", body: data });
  } catch (err) {
    next(err);
  }
};

// get all product in cart
exports.getCart = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await User.findById({ _id: id }, { keranjang: 1, _id: 0 });
    res.status(200).json({ message: "Request berhasil!", body: result });
  } catch (err) {
    next(err);
  }
};

// get product in cart by id
exports.getCartById = async (req, res, next) => {
  const uid = req.params.uid;
  const pid = req.params.pid;

  try {
    const result = await User.findById(
      { _id: uid },
      { keranjang: { $elemMatch: { _id: pid } }, _id: 0 }
    );

    // if (result.keranjang.length === 0) {
    //   return res.status(404).json({ message: "Not Found!" });
    // }

    res.status(200).json({
      message: "Request berhasil!",
      body: result.keranjang,
    });
  } catch (err) {
    next(err);
  }
};

// add product to cart
exports.addToCart = async (req, res, next) => {
  const { email, productName, img, color, totalPrice, qty, id } = req.body;

  // email doesn't exist
  const emailExist = await User.findOne({ email: email });
  if (!emailExist) {
    return res.status(400).json({ message: "Silahkan login terlebih dahulu!" });
  }

  const data = {
    _id: id,
    productName: productName,
    img: img,
    color: color,
    totalPrice: totalPrice,
    qty: qty,
  };

  try {
    await User.updateOne(
      { email: email },
      { $pull: { keranjang: { _id: id } } }
    );

    await User.findOneAndUpdate(
      { email: email },
      { $push: { keranjang: data } }
    );
    res.status(201).json({
      message: "Data berhasil ditambahkan!",
    });
  } catch (err) {
    next(err);
  }
};

// delete product in cart
exports.deleteProduct = async (req, res, next) => {
  const userId = req.query.uId;
  const productId = req.query.pId;

  try {
    await User.updateOne(
      { _id: userId },
      { $pull: { keranjang: { _id: productId } } }
    );
    res.status(200).json({ message: "Data berhasil di hapus." });
  } catch (err) {
    next(err);
  }
};

// buy product in cart
exports.buy = async (req, res, next) => {
  const { email, address, products, payment } = req.body;

  // generate date
  const months = [
    "Januari",
    "Febuari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const dates = new Date();
  const date = dates.getDate().toString();
  const month = months[dates.getMonth()];
  const year = dates.getFullYear().toString();
  const fullDate = `${date} ${month} ${year}`;

  // sum total price & qty in cart
  let totalPrice = 0;
  let totalQty = 0;
  products.forEach((e) => {
    totalPrice += e.totalPrice;
    totalQty += e.qty;
  });

  const dataTransaksi = {
    address: address,
    payment: payment,
    products: products,
    totalQty: totalQty,
    totalPrice: totalPrice,
    date: fullDate,
    status: false,
  };

  try {
    await User.findOneAndUpdate(
      { email: email },
      { $push: { transaksi: dataTransaksi } }
    );

    // reset cart
    await User.updateOne({ email: email }, { $set: { keranjang: [] } });

    // decrement stock in data product
    products.forEach(async (e) => {
      await Product.updateOne(
        { _id: e._id },
        { $inc: { stock: -e.qty, sold: e.qty } }
      );
    });

    res.status(200).json({ message: "Menunggu pembayaran!" });
  } catch (err) {
    next(err);
  }
};

// get all data transaction
exports.getTransact = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    const result = await User.findOne(
      { _id: userId },
      { transaksi: 1, _id: 0 }
    );

    if (result.length === 0) {
      res.status(404).json({ message: "Not Found!" });
    }

    res.status(200).json({ message: "Request berhasil!", body: result });
  } catch (err) {
    next(err);
  }
};

// detail transaksi
exports.detailTransact = async (req, res, next) => {
  const userId = req.params.uid;
  const id = req.params.id;

  try {
    const result = await User.findById(
      { _id: userId },
      { transaksi: { $elemMatch: { _id: id } } }
    );
    res
      .status(200)
      .json({ message: "Request berhasil!", body: result.transaksi });
  } catch (err) {
    next(err);
  }
};
