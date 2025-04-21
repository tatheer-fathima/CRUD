
require('dotenv').config({ path: './.env' }); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users'); 
const userModel = require('./models/Users');

const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(cors());
app.use(express.json());


if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in .env file!");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    });

// Get all users
app.get('/', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user by ID
app.get('/getUser/:id', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.put('/updateUser/:id', async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, email: req.body.email, age: req.body.age },
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.json({ message: '✅ User updated successfully', updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/deleteUser/:id', async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.json({ message: '✅ User deleted successfully', deletedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Create a new user
app.post('/createUser', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const newUser = new UserModel({ name, email, age });
        await newUser.save();
        res.status(201).json({ message: '✅ User created successfully', newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
