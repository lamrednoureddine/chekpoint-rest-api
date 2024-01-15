// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // Middleware to parse JSON request bodies

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/rest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

    // Routes

    // GET: Return all users
    app.get('/users', async (req, res) => {
      try {
        const users = await User.find();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // POST: Add a new user to the database
    app.post('/users', async (req, res) => {
      try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
      } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
      }
    });

    // PUT: Edit a user by ID
    app.put('/users/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (updatedUser) {
          res.json(updatedUser);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
      }
    });

    // DELETE: Remove a user by ID
    app.delete('/users/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const deletedUser = await User.findByIdAndRemove(id);
        if (deletedUser) {
          res.json(deletedUser);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
      }
    });

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });


