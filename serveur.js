const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/my_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Define a route handler for the root URL
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
// GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// POST a new user
app.post("/users", async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// PUT edit a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// DELETE remove a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Define the port number to listen on
const port = process.env.PORT || 4000;

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
