const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer')

const User = require('../models/user');
const uploadImageToCloudStorage = require('../cloud storage/uploadImage');

const upload = multer({ dest: 'uploads/' })

// Signup route
router.post('/signup', upload.single('image'), async (req, res) => {
  console.log(typeof req.file,req.file,'lll',req.body)
  const { name, email, password } = req.body;
  const image = req.file;
  let imgUrl;
  try {
    imgUrl = await uploadImageToCloudStorage(image, 'image-bucket')
  }
  catch (err) {
    console.log(err)
  }
  const user = new User({
    name,
    email,
    password,
    image: imgUrl
  });

  try {
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'SECRET_KEY');
    res.send({ token, name: user.name, email: user.email, id: user._id, image });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({ error: 'Email already in use' });
    }
    return res.status(500).send({ error: err.message });
  }
});

// Login route (continued)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // console.log({email,password})

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Email not found' });
    }
    if (user.password !== password) {
      return res.status(400).send({ error: 'Incorrect password' });
    }
    const token = jwt.sign({ userId: user._id }, 'SECRET_KEY');
    res.send({ token, name: user.name, email: user.email, id: user._id });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.post('/find', async (req, res) => {
  let search = req.query.search
  try {
    const user = await User.find({ name: { $regex: search } })
    res.send(user)
  } catch (err) {
    return res.status(500).send(err.message);
  }
})

module.exports = router;
