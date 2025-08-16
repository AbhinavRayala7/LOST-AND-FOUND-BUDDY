// This is an updated Express.js backend for the Lost & Found Buddy app.
// It now includes file upload handling using 'multer' and enhanced search functionality.

// Import the Express framework and necessary middleware
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Middleware for handling multipart/form-data (file uploads)
const path = require('path'); // Node.js module to handle and transform file paths

const app = express();
const port = 3001;

// --- Middleware Setup ---
app.use(cors()); // Enable All CORS Requests
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Handle URL-encoded data

// Serve static files from the 'uploads' directory
// This allows the frontend to access the uploaded images using their URL.
app.use('/uploads', express.static('uploads'));

// --- Multer Configuration for File Uploads ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define the destination folder for uploaded files
        // The 'uploads' folder must be created in the same directory as this server file.
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Define the filename for the uploaded file.
        // We use a timestamp to ensure unique filenames.
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Mock 'database' to store items
// In a real application, you would connect to a MongoDB using a library like Mongoose.
let mockItems = [
    { id: 1, type: 'lost', title: 'Black Leather Wallet', description: 'Lost near the campus library entrance. It has a driver\'s license and a few credit cards inside.', location: 'Campus Library', date: '2025-08-15', contact: 'john.doe@email.com', image: null },
    { id: 2, type: 'found', title: 'Silver Keychain', description: 'Found on the bench in the park. It has two keys and a small elephant charm.', location: 'City Park', date: '2025-08-14', contact: 'jane.smith@email.com', image: null },
    { id: 3, type: 'lost', title: 'Blue Backpack', description: 'Left my blue backpack on the bus. It contains a laptop and some textbooks.', location: 'Bus Route #42', date: '2025-08-13', contact: 'alex.jones@email.com', image: null },
    { id: 4, type: 'found', title: 'Single Earring', description: 'Found a gold hoop earring outside of the grocery store. It has a small red stone.', location: 'Grocery Store', date: '2025-08-12', contact: 'samantha.brown@email.com', image: null },
];

// --- API Routes ---

// GET route to fetch all items with enhanced search capabilities
app.get('/api/items', (req, res) => {
    console.log('Fetching items with search query:', req.query);
    const { q, type } = req.query; // Destructure search query parameters

    let filteredItems = mockItems;

    // Filter by search term if 'q' is provided
    if (q) {
        const searchTerm = q.toLowerCase();
        filteredItems = filteredItems.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.location.toLowerCase().includes(searchTerm)
        );
    }

    // Filter by item type if 'type' is provided
    if (type) {
        const itemType = type.toLowerCase();
        filteredItems = filteredItems.filter(item => item.type === itemType);
    }

    res.status(200).json(filteredItems);
});

// GET route to fetch a single item by its ID
app.get('/api/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const item = mockItems.find(i => i.id === itemId);

    if (item) {
        console.log(`Fetching item with ID: ${itemId}`);
        res.status(200).json(item);
    } else {
        console.log(`Item with ID: ${itemId} not found.`);
        res.status(404).json({ message: 'Item not found' });
    }
});

// POST route to create a new item with file upload
// The 'upload.single('itemImage')' middleware processes a single file from the 'itemImage' field in the form.
app.post('/api/items', upload.single('itemImage'), (req, res) => {
    const newItem = req.body;
    
    // Check if a file was uploaded
    if (req.file) {
        // Construct the URL for the uploaded image and store it
        const imageUrl = `/uploads/${req.file.filename}`;
        newItem.image = imageUrl;
        console.log('Image uploaded:', imageUrl);
    }

    console.log('Received new item:', newItem.title);

    // Assign a new ID and add it to our mock database
    newItem.id = mockItems.length > 0 ? Math.max(...mockItems.map(i => i.id)) + 1 : 1;
    newItem.date = new Date().toISOString().slice(0, 10);
    mockItems.push(newItem);

    // Send the created item back to the client
    res.status(201).json(newItem);
});

// Start the server
app.listen(port, () => {
    console.log(`Lost & Found Buddy backend listening at http://localhost:${port}`);
});