const bcrypt = require("bcrypt");
const saltRounds = 10;
const validator = require("validator");
const jwt = require("jsonwebtoken");

// model
const User = require("../models/userMdl");

// register
exports.register = async (req, res) => {
  const { username, email, address } = req.body;

  // validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Email tidak valid!" });
  }

  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return res.status(400).json({ message: "Email sudah digunakan!" });
  }

  // validate password
  if (!validator.isLength(req.body.password, { min: 6 })) {
    return res.status(400).json({
      message: "Password minimal berisi 6 karakter!",
    });
  }

  // hash password
  const salt = await bcrypt.genSalt(saltRounds);
  const hashPass = await bcrypt.hash(req.body.password, salt);

  // declare new user
  const RegModel = new User({
    username: username,
    email: email,
    password: hashPass,
    address: address,
    transaksi: [],
    keranjang: [],
  });

  // save new user to db
  try {
    await RegModel.save();
    res.status(201).json({ message: "Register berhasil!" });
  } catch (err) {
    res.status(400).json({ message: "Register gagal!", error: err });
  }
};

// login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // find user by email
  const user = await User.findOne({ email: email });

  // compare email
  if (!user) {
    return res.status(400).json({ message: "Email anda salah!" });
  }

  // compare password
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(400).json({ message: "Pasword anda salah!" });
  }

  // jwt token
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    address: user.address,
  };
  // const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "6h" });
  const token = jwt.sign(payload, process.env.SECRET_KEY);
  res
    .header("auth-token", token)
    .json({ message: "Login berhasil!", token: token });
};

// logout
exports.logout = async (req, res) => {
  res.status(200).json({ message: "Logout berhasil!" });
};
