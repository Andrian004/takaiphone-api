const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const port = 5000;

// run db
require("./utils/db");

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");

// setup midleware
app.use(cors());
app.use(bodyParser.json());

// images
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// group
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);

// global err
app.use((error, req, res) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

// route utama
app.get("/*", (req, res) => {
  res.send("Ini adalah server untuk website toko handphone");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
