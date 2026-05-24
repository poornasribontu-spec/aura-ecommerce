require("dns").setDefaultResultOrder("ipv4first");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

require("dotenv").config();

const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");

const app = express();

// ============================
// MIDDLEWARE
// ============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ============================
// STATIC FILES
// ============================

app.use(express.static(path.join(__dirname, "public")));

// ============================
// HTML ROUTES
// ============================

app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );

});

app.get("/admin.html", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "admin.html")
  );

});

app.get("/cart.html", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "cart.html")
  );

});

app.get("/login.html", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "login.html")
  );

});

app.get("/register.html", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "register.html")
  );

});

app.get("/checkout.html", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "checkout.html")
  );

});

app.get("/orders.html", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "orders.html")
  );

});

app.get("/wishlist.html", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "wishlist.html")
  );

});

app.get("/success.html", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "success.html")
  );

});

app.get("/product.html", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "product.html")
  );

});

// ============================
// CONNECT MONGODB
// ============================

mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log("MongoDB Connected");

})

.catch((err) => {

  console.log(err);

});

// ============================
// RESET PRODUCTS
// ============================

app.get("/add-product", async (req, res) => {

  try {

    await Product.deleteMany({});

    const products = [

      {
        name: "Headphones",
        price: 1999,
        image:
          "https://m.media-amazon.com/images/I/61CGHv6kmWL.jpg",
        description: "Wireless headphones",
        category: "electronics"
      },

      {
        name: "Smart Watch",
        price: 2999,
        image:
          "https://m.media-amazon.com/images/I/61ZjlBOp+rL.jpg",
        description: "Modern smartwatch",
        category: "electronics"
      },

      {
        name: "Shoes",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
        description: "Running shoes",
        category: "fashion"
      },

      {
        name: "Laptop",
        price: 55999,
        image:
          "https://m.media-amazon.com/images/I/71TPda7cwUL.jpg",
        description: "Powerful laptop",
        category: "electronics"
      },

      {
        name: "Backpack",
        price: 999,
        image:
          "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=1000&auto=format&fit=crop",
        description: "Stylish backpack",
        category: "fashion"
      }

    ];

    await Product.insertMany(products);

    res.send("Products Reset Successfully");

  } catch (error) {

    res.status(500).send("Failed To Add Products");

  }

});

// ============================
// GET PRODUCTS
// ============================

app.get("/products", async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: "Failed To Fetch Products"
    });

  }

});

// ============================
// REGISTER
// ============================

app.post("/register", async (req, res) => {

  try {

    const {
      username,
      email,
      password
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if(existingUser){

      return res.json({
        message: "User Already Exists"
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = new User({

      username,
      email,
      password: hashedPassword

    });

    await user.save();

    res.json({
      message: "User Registered Successfully"
    });

  } catch(error){

    res.status(500).json({
      message: "Registration Failed"
    });

  }

});

// ============================
// LOGIN
// ============================

app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({ email });

    if(!user){

      return res.json({
        message: "Invalid Credentials"
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if(isMatch){

      res.json({

        message: "Login Successful",

        username: user.username

      });

    } else {

      res.json({
        message: "Invalid Credentials"
      });

    }

  } catch(error){

    res.status(500).json({
      message: "Login Failed"
    });

  }

});

// ============================
// PLACE ORDER
// ============================

app.post("/place-order", async (req, res) => {

  try {

    const {

      products,
      totalAmount,
      user,
      phone,
      address,
      paymentMethod

    } = req.body;

    const order = new Order({

      products,
      totalAmount,
      user,
      phone,
      address,
      paymentMethod

    });

    await order.save();

    res.json({
      message: "Order Placed Successfully"
    });

  } catch(error){

    res.status(500).json({
      message: "Order Failed"
    });

  }

});

// ============================
// GET ORDERS
// ============================

app.get("/orders", async (req, res) => {

  try {

    const orders = await Order.find();

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: "Failed To Fetch Orders"
    });

  }

});

// ============================
// ADD PRODUCT ADMIN
// ============================

app.post("/add-product-admin", async (req, res) => {

  try {

    const product =
      new Product(req.body);

    await product.save();

    res.json({
      message: "Product Added"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed To Add Product"
    });

  }

});

// ============================
// DELETE PRODUCT
// ============================

app.delete("/delete-product/:id", async (req, res) => {

  try {

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Product Deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Delete Failed"
    });

  }

});

// ============================
// UPDATE PRODUCT
// ============================

app.put("/update-product/:id", async (req, res) => {

  try {

    await Product.findByIdAndUpdate(

      req.params.id,
      req.body

    );

    res.json({
      message: "Product Updated"
    });

  } catch (error) {

    res.status(500).json({
      message: "Update Failed"
    });

  }

});

// ============================
// SEARCH PRODUCTS
// ============================

app.get("/search", async (req, res) => {

  try {

    const keyword =
      req.query.keyword;

    const products =
      await Product.find({

        name: {

          $regex: keyword,
          $options: "i"

        }

      });

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: "Search Failed"
    });

  }

});

// ============================
// FILTER PRODUCTS
// ============================

app.get("/category/:name", async (req, res) => {

  try {

    const products =
      await Product.find({

        category:
          req.params.name

      });

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: "Category Fetch Failed"
    });

  }

});

// ============================
// SERVER
// ============================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});