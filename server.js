require('dns').setDefaultResultOrder('ipv4first');

const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");
const cors = require("cors");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("public"));


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
// HOME ROUTE
// ============================

app.get("/", (req, res) => {

  res.send("Server Running");

});


// ============================
// RESET PRODUCTS
// ============================

app.get("/add-product", async (req, res) => {

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

});


// ============================
// GET PRODUCTS
// ============================

app.get("/products", async (req, res) => {

  const products = await Product.find();

  res.json(products);

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

    // CHECK EXISTING USER

    const existingUser =
      await User.findOne({ email });

    if(existingUser){

      return res.json({
        message:
          "User Already Exists"
      });

    }

    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = new User({

      username,

      email,

      password: hashedPassword

    });

    await user.save();

    res.json({
      message:
        "User Registered Successfully"
    });

  } catch(error){

    res.json({
      message:
        "Registration Failed"
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

    // CHECK USER

    if(!user){

      return res.json({
        message:
          "Invalid Credentials"
      });

    }

    // CHECK PASSWORD

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if(isMatch){

      res.json({

        message:
          "Login Successful",

        username:
          user.username

      });

    } else {

      res.json({
        message:
          "Invalid Credentials"
      });

    }

  } catch(error){

    res.json({
      message:
        "Login Failed"
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
      message:
        "Order Placed Successfully"
    });

  } catch(error){

    res.json({
      message:
        "Order Failed"
    });

  }

});


// ============================
// GET ORDERS
// ============================

app.get("/orders", async (req, res) => {

  const orders =
    await Order.find();

  res.json(orders);

});


// ============================
// ADD PRODUCT ADMIN
// ============================

app.post("/add-product-admin", async (req, res) => {

  const product =
    new Product(req.body);

  await product.save();

  res.json({
    message:
      "Product Added"
  });

});


// ============================
// DELETE PRODUCT
// ============================

app.delete("/delete-product/:id", async (req, res) => {

  await Product.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message:
      "Product Deleted"
  });

});


// ============================
// UPDATE PRODUCT
// ============================

app.put("/update-product/:id", async (req, res) => {

  await Product.findByIdAndUpdate(

    req.params.id,

    req.body

  );

  res.json({
    message:
      "Product Updated"
  });

});


// ============================
// SEARCH PRODUCTS
// ============================

app.get("/search", async (req, res) => {

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

});


// ============================
// FILTER PRODUCTS
// ============================

app.get("/category/:name", async (req, res) => {

  const products =
    await Product.find({

      category:
        req.params.name

    });

  res.json(products);

});


// ============================
// SERVER
// ============================

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});