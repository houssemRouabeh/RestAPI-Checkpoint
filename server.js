const express = require("express");
const app = express();
const User = require("./models/User");
const dbConnect = require("./config/dbConnect");
require("dotenv").config({ path: "./config/.env" });
const bcrypt = require("bcryptjs");
const port = process.env.PORT || 5000;

dbConnect(); //Connection to database
app.use(express.json()); //json Parser

//GET ROUTE:  RETURN ALL USERS
app.get("/", async (req, res) => {
  try {
    const getAllUsers = await User.find();
    res.status(200).json({
      status: "success",
      data: getAllUsers,
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: error.message,
    });
  }
});
//GET ROUTE:  RETURN ONE USER BY ID
app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const getUser = await User.findById(id);
    res.status(200).json({
      status: "success",
      data: getUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: "User does not exists",
    });
  }
});

//POST ROUTE:  ADD A NEW USER TO THE DATABASE
app.post("/add", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new User(data);
    const savedUser = await newUser.save();
    res.status(201).json({
      status: "success",
      data: savedUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: error.message,
    });
  }
});

// PUT ROUTE: EDIT A USER BY ID
app.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    if (!data || !data.userName) {
      return res.status(400).json({
        status: "failure",
        message: "Invalid request parameters.",
      });
    }

    // Ensure the password is hashed before updating
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 8);
    }
    console.log(data);
    const user = await User.findByIdAndUpdate(id, data);

    if (!user) {
      return res.status(400).json({
        status: "failure",
        message: "No user with the given ID was found.",
      });
    }

    res.status(201).json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: error.message,
    });
  }
});

//DELETE ROUTE: REMOVE A USER BY ID
app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findOneAndDelete(id);
    if (!user) {
      return res.status(400).json({
        status: "failure",
        message: "No user with the given ID was found.",
      });
    }
    res.status(201).json({
      status: "success",
      message: "user deleted successfuly",
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: error.message,
    });
  }
});

//NOT FOUD ROUTE
app.get("*", (req, res) => {
  res.status(404).json({
    status: "failure",
    message: "URL not found!",
  });
});

//Server listner
app.listen(port, () => {
  console.log(`Server started on port : ${port}`);
});
