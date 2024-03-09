const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const NewUser = require('./newuser'); 
const bcrypt= require('bcrypt');
const saltRounds=10;

const app = express();
app.use(express.json());
app.use(cors());

const port = 3001;

mongoose.connect("mongodb://127.0.0.1:27017/mini-project")
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    });

    app.post('/registration', async (req, res) => {
        const { username, email, password, phone, category } = req.body; // Changed to category
        try {
            const existingUser = await NewUser.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

    
            const newUser = new NewUser({ username, email, password:hashedPassword, phone, userType: category }); // Changed to userType
            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
    
    
    // Other routes remain unchanged
    

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await NewUser.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        // Check if the password matches
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



app.post('/api/check-email', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await NewUser.findOne({ email });
  
      if (user) {
        // Email exists in the database
        return res.json({ exists: true });
      } else {
        // Email does not exist in the database
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking email:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.post('/api/update-password', async (req, res) => {
      const { email, newPassword } = req.body;
    
      try {
        // Find the user by email and update the password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const updatedUser = await NewUser.findOneAndUpdate(
          { email },
          { $set: { password: hashedPassword} },
          { new: true }
        );
    
        if (updatedUser) {
          return res.json({ message: 'Password updated successfully.' });
        } else {
          return res.status(404).json({ error: 'User not found.' });
        }
      } catch (error) {
        console.error('Error updating password:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });  


app.listen(port, () => {
    console.log(`Example is running on port ${port}`);
});
