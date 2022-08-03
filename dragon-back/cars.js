const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../dragon-front/public/cars/',
  limits: {
    fileSize: 50000000
  }
});

// Import User model
const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

// Define photo schema
const carSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  path: String,
  name: String,
  plate: String,
  created: {
    type: Date,
    default: Date.now
  },
});

const Car = mongoose.model('Car', carSchema);

// upload photo
router.post("/", validUser, upload.single('photo'), async (req, res) => {
  // check parameters
  if (!req.file)
    return res.status(400).send({
      message: "Must upload a photo of the receipt."
    });

  const car = new Car({
    user: req.user,
    path: "/cars/" + req.file.filename,
    name: req.body.name,
    plate: req.body.plate,
  });
  try {
    await car.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get my cars
router.get("/all", validUser, async (req, res) => {
  // return photos
  try {
    const cars = await Car.find({}).sort({
      created: -1
    });
    return res.send(cars);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get all cars
router.get("/all", async (req, res) => {
  try {
    let cars = await Car.find().sort({
      created: -1
    });
    return res.send(cars);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  model: Car,
  routes: router,
}
