const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const NewUser = require('./newuser'); // Ensure this path matches your user model file
const newuser = require('./newuser');

const app = express();
const saltRounds = 10;
const port = 3001;

app.use(express.json());
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
// Initialize express-session
app.use(
  session({
    secret: "your-secret-key", // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, // Session duration (1 hour in milliseconds)
  })
);




// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/mini-project", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.log('Error connecting to MongoDB:', err));





    app.post('/Registration', async (req, res) => {
        const { username, email, password, phone, category,experience,subject} = req.body; // Changed to category
        try {
            const existingUser = await NewUser.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

    
            const newUser = new NewUser({ username, email, password:hashedPassword, phone, category,experience,subject }); // Changed to userType
            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
    

    const isAuthenticated = (req, res, next) => {
      // Check if the user is authenticated
      if (req.session.user) {
        // User is authenticated, proceed to the next middleware
        next();
      } else {
        // User is not authenticated, redirect to login page or send an error response
        res.status(401).json({ message: 'Unauthorized' });
      }
    };
    
// Assuming you have a route for logout, it might look like this
app.post('/logout', (req, res) => {
  // Clear the session or authentication state
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Failed to logout' });
    }
    // If there are no errors, send a success response
    res.status(200).json({ message: 'Logout successful' });
  });
});

    
// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password,category } = req.body;
  try {
    const user = await NewUser.findOne({ email,category });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    req.session.user = { email,category };
    console.log(user.category)

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get('/Profile', async (req, res) => {
  const { email } = req.query; // Assuming you're sending email as a query parameter

  try {
    const collections = await NewUser.find({ email });
    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});








app.post('/update-profile', async (req, res) => {
  const { email, username, phone } = req.body;
  try {
      const updatedUser = await NewUser.findOneAndUpdate(
          { email },
          { $set: { username, phone } },
          { new: true } // Return the updated document
      );
      if (updatedUser) {
          return res.json({ message: 'Profile updated successfully.', user: updatedUser });
      } else {
          return res.status(404).json({ error: 'User not found.' });
      }
  } catch (error) {
      console.error('Error updating profile:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
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


// GET all users
// GET student users
app.get('/api/users', async (req, res) => {
  try {
    // Fetch student users from the database
    const students = await NewUser.find({ category: 'Student' });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// POST to add a new user
app.post('/api/addUser', async (req, res) => {
  try {
    const { username, phone, email, category } = req.body;

    // Create a new user instance using the NewUser model
    const newUser = new NewUser({
      username,
      phone,
      email,
      category: category || 'Student', // Default Category to 'Student' if not provided
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Send the saved user data as a response
    res.json(savedUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





// API endpoint to add a new user
app.post('/api/addFaculties', async (req, res) => {
  try {
    const { username, phone, email, category,subject,experience} = req.body;

    // Create a new user instance using the NewUser model
    const newUser = new NewUser({
      username,
      phone,
      email,
      category: category || 'Faculty', // Default Category to 'student' if not provided
      subject,
      experience
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Send the saved user data as a response
    res.json(savedUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/Faculties', async (req, res) => {
  try {
    // Assuming you have a model named NewUser
    const users = await NewUser.find({category:"Faculty"});
   
    // Send the filtered users as a JSON response
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Update faculty information
app.put('/api/updateFaculty/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFaculty = await NewUser.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json(updatedFaculty);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});












      
 

    app.delete('/api/removeUser/:id', async (req, res) => {
      const userId = req.params.id;
    
      try {
        const result = await NewUser.deleteOne({ _id: userId });
    
        if (result.deletedCount === 1) {
          console.log(`User ${userId} removed successfully`);
          res.status(200).json({ message: 'User removed successfully' });
        } else {
          console.error(`User with ID ${userId} not found`);
          res.status(404).json({ error: 'User not found' });
        }
      } catch (err) {
        console.error('Error removing user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });


// Course schema
const courseSchema = new mongoose.Schema({
  name: String,
  price: Number,
  duration: String
});

const Course = mongoose.model('Course', courseSchema);

// Get all courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new course
app.post('/courses', async (req, res) => {
  try {
    const { name, price, duration } = req.body;
    const course = new Course({ name, price, duration });
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a course
app.put('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a course
app.delete('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
    


app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await NewUser.find({category:"Faculty"});
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/faculties', async (req, res) => {
  try {
    const subjects = await NewUser.find({category:"Faculty"});
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
    

const batchSchema = new mongoose.Schema({
  faculty: String,
  link: String,
  date: Date,
  selectedBatchId: String,
  time: String, // Add the time field
});

// Create a Batch model
const Batch = mongoose.model('Batch', batchSchema);

app.post('/api/batches', async (req, res) => {
  try {
    const { selectedBatchId, faculty, link, date, time } = req.body; // Add time
  //  console.log("Received data:", req.body); // Debugging: Log received data
    //console.log("Time value:", time); // Debugging: Log time value
    const newBatch = new Batch({ selectedBatchId, faculty, link, date, time }); // Include time
   // console.log("New Batch object:", newBatch); // Debugging: Log new Batch object
    await newBatch.save();
   // console.log("Batch saved successfully:", newBatch); // Debugging: Log saved Batch object
    res.status(201).json({ message: 'Batch added successfully', batch: newBatch });
  } catch (error) {
    console.error('Error adding batch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to fetch all batches
app.get('/api/batches', async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/selectBatch', async (req, res) => {
  try {
    const batches = await dik.find({},'batchID');
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to delete a batch
app.delete('/api/deletebatchess', async (req, res) => {
  try {
    const {  } = req.params;
    await Batch.deleteOne({  });
    res.json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






// Create a schema for batches
const batchschema = new mongoose.Schema({
  batchID: String,
  subject: String,
  enrolledStudents: [String]
});

// Create a model for batches
const dik = mongoose.model('dik', batchschema);

app.get('/fetchBatches', async (req, res) => {
  try {
    const batches = await dik.find();
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to add a new batch
app.post('/addBatch', async (req, res) => {
  try {
    const { batchID, subject, enrolledStudents } = req.body;
    const newBatch = new dik({ batchID, subject, enrolledStudents });
    await newBatch.save();
    res.status(201).json({ message: 'Batch added successfully' });
  } catch (error) {
    console.error('Error adding batch:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to delete a batch
app.delete('/deleteBatch/:batchID', async (req, res) => {
  try {
    const {  } = req.params;
    await dik.deleteOne({  });
    res.json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Endpoint to fetch subjects
app.get('/fetchSubjects', async (req, res) => {
  try {
    // Assuming you have a Course model in your database with a field called 'name'
    const subjects = await Course.find({}, 'name');
    
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/fetchStudents', async (req, res) => {
  try {
    // Assuming you have a Course model in your database with a field called 'name'
    const subjects = await newuser.find({}, 'username');
    
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



   








// Endpoint to get user category based on email
app.get('/api/user/category', (req, res) => {
  const { email } = req.query;

  // Find the user in the database based on email
  const user = newuser.find(user => user.email === email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Return the user's category
  res.json({ category: user.category });
});






// Define Exam schema
const examSchema = new mongoose.Schema({
  batchId: String,
  date: String,
  time: String,
  questionsFile: {
    type: String, // Store file path in the database
    required: true
  },
});

// Create Exam model
const Exam = mongoose.model('Exam', examSchema);

// Ensure the destination directory exists
const uploadDir = './uploads';
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { time } = require('console');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit file size to 10MB
  },
  fileFilter: function (req, file, cb) {
    // Validate file types
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Only PDF files are allowed!'));
    }
    cb(null, true);
  }
});

// Endpoint to handle exam form submission
app.post('/api/add-exam', upload.single('questionsFile'), async (req, res) => {
  const { batchId, date, time } = req.body;

  // Check if req.file exists and has a path property
  if (!req.file || !req.file.path) {
    return res.status(400).send('No file uploaded or invalid file');
  }

  const questionsFile = req.file.path; // Store relative file path in the database

  try {
    // Create a new exam document
    const newExam = new Exam({
      batchId,
      date,
      time,
      questionsFile,
    });

    // Save the exam to the database
    await newExam.save();

    res.status(201).send('Exam added successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding exam: ' + error.message);
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint to get all exams
app.get('/api/exams', async (req, res) => {
  try {
    // Retrieve all exams from the database
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving exams');
  }
});

// Endpoint to get all batch IDs
app.get('/api/batchIds', async (req, res) => {
  try {
    const batchIds = await Exam.distinct('batchId');
    res.json(batchIds);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving batch IDs');
  }
});












// Define schema for uploads
const uploadSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  fileSize: Number,
  filePath: String,
  course: String,
  uploadedAt: { type: Date, default: Date.now }
  
});

// Define separate schema for question uploads
const questionUploadSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  fileSize: Number,
  filePath: String,
  uploadedAt: { type: Date, default: Date.now },
  batch: String,
  subject: String
});

const Upload = mongoose.model('Upload', uploadSchema);
const QuestionUpload = mongoose.model('QuestionUpload', questionUploadSchema);

// Multer storage configuration
const storageConfig = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});



// Handle file upload endpoint for general uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const newUpload = new Upload({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      course: req.body.course // Assuming course is sent in the request body
    });
    await newUpload.save();
    res.status(201).send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});


// Handle POST request for uploading question paper
app.post('/uploadQuestion', upload.single('file'), async (req, res) => {
  try {
    const { batch, subject } = req.body; // Extract batch and subject from request body

    const newQuestionUpload = new QuestionUpload({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: req.file.path,
      batch: batch,
      subject: subject
    });

    await newQuestionUpload.save();
    res.status(201).send('Question paper uploaded successfully');
  } catch (error) {
    console.error('Error uploading question paper:', error);
    res.status(500).send('Error uploading question paper');
  }
});


// Endpoint to fetch question papers
app.get('/questionPapers', async (req, res) => {
  try {
    const questionPapers = await QuestionUpload.find();
    res.json(questionPapers);
  } catch (error) {
    console.error('Error fetching question papers:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to fetch notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Upload.find();
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Delete a question paper by ID
app.delete('/questionPapers/:id', async (req, res) => {
  try {
    const deletedQuestionPaper = await QuestionUpload.findByIdAndDelete(req.params.id);
    if (!deletedQuestionPaper) {
      return res.status(404).json({ error: 'Question paper not found' });
    }
    res.json({ message: 'Question paper deleted successfully' });
  } catch (error) {
    console.error('Error deleting question paper:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a note by ID
app.delete('/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Upload.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch all batches
app.get('/batchesiDS', async (req, res) => {
  try {
    const batches = await dik.find();
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to fetch all batches
app.get('/subjects', async (req, res) => {
  try {
    const batches = await dik.find();
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route to fetch all courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/schedule', async (req, res) => {
  try {
    const scheduleData = await Batch.find();
    res.json(scheduleData);
  } catch (error) {
    console.error('Error fetching schedule data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
    console.log(`Example is running on port ${port}`);
});