// Required imports
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Event Schema without required field validations
const eventSchema = new mongoose.Schema({
  eventName: { type: String },
  eventType: { type: String },
  description: { type: String },
  bannerPath: { type: String },
  startDate: { type: Date },
  time: { type: String },
  venue: {
    name: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    zipCode: { type: String },
    mapLink: { type: String }
  },
  tickets: [{
    type: { type: String },
    price: { type: Number },
    availableSeats: { type: Number },
    soldSeats: { type: Number, default: 0 }
  }],
  organizer: {
    name: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Create Event model
const Event = mongoose.model('Event', eventSchema);

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../frontend/public/uploads/events');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'event-' + uniqueSuffix + ext);
  }
});

// Initialize multer upload without file filters
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Express app setup
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Route to create a new event
app.post('/api/events', upload.single('banner'), async (req, res) => {
  try {
    // Parse the JSON data from the form
    const eventData = JSON.parse(req.body.eventData);
    
    // Create a new event object
    const newEvent = new Event({
      eventName: eventData.eventName,
      eventType: eventData.eventType,
      description: eventData.description || '',
      startDate: eventData.startDate ? new Date(eventData.startDate) : null,
      time: eventData.time,
      venue: eventData.venue,
      tickets: eventData.tickets,
      organizer: eventData.organizer
    });
    
    // Add banner path if a file was uploaded
    if (req.file) {
      newEvent.bannerPath = `/uploads/events/${req.file.filename}`;
    }
    
    // Save the event to the database
    const savedEvent = await newEvent.save();
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: savedEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
});

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
});

// Update event by ID
app.put('/api/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, event: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating event', error: error.message });
  }
});

// Delete event by ID
app.delete('/api/events/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting event', error: error.message });
  }
});

// Get event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
});





//Booking History
//Booking Schema
const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    unique: true
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  eventName: String,
  name: {
    type: String,
    required: true
  },
  numberOfTickets: {
    type: Number,
    required: true,
    min: 1
  },
  ticketType: {
    type: String,
    required: true
  },
  ticketPrice: {
    type: Number,
    required: true
  },
  foods: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  foodType: String,
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: String,
    required: true
  },
  bookingTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a unique booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.booking_id) {
    // Create a booking ID format: BK-YYYYMMDD-XXXX (XXXX is a random 4-digit number)
    const date = new Date();
    const dateStr = date.getFullYear() +
                   String(date.getMonth() + 1).padStart(2, '0') +
                   String(date.getDate()).padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    this.booking_id = `BK-${dateStr}-${randomNum}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);


// Updated API endpoint for creating bookings
app.post('/api/bookings', async (req, res) => {
  try {
    const { 
      event_id, 
      name, 
      numberOfTickets, 
      ticketType, 
      ticketPrice, 
      foods, 
      foodType, 
      phone, 
      email, 
      totalCost, 
      bookingDate, 
      bookingTime,
      status = 'pending'
    } = req.body;

    // Find event to get the event name
    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Create new booking
    const newBooking = new Booking({
      event_id,
      eventName: event.eventName,
      name,
      numberOfTickets,
      ticketType,
      ticketPrice,
      foods,
      foodType,
      phone,
      email,
      totalCost,
      bookingDate,
      bookingTime,
      status
    });

    // Save the booking
    const savedBooking = await newBooking.save();

    // Update ticket availability in the event
    const ticketIndex = event.tickets.findIndex(ticket => ticket.type === ticketType);
    if (ticketIndex !== -1) {
      event.tickets[ticketIndex].soldSeats += numberOfTickets;
      await event.save();
    }

    // Return success response
    res.status(201).json({ 
      success: true, 
      message: 'Booking successfully created!',
      booking_id: savedBooking.booking_id,
      booking: savedBooking
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating the booking.', 
      error: error.message 
    });
  }
});

// Additional endpoint to get a specific booking
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ success: false, message: 'Error fetching booking details' });
  }
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // If cancelling a confirmed booking, update ticket availability
    if (booking.status === 'confirmed' && status === 'cancelled') {
      const event = await Event.findById(booking.event_id);
      if (event) {
        const ticketIndex = event.tickets.findIndex(ticket => ticket.type === booking.ticketType);
        if (ticketIndex !== -1) {
          event.tickets[ticketIndex].soldSeats -= booking.numberOfTickets;
          await event.save();
        }
      }
    }

    // ✅ Update only the status field without triggering full validation
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: false } // ✅ Prevents Mongoose from requiring missing fields
    );

    res.status(200).json({ success: true, message: `Booking status updated to ${status}`, booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ success: false, message: 'Error updating booking status' });
  }
});

// Get all bookings (with optional filters)
app.get('/api/bookings', async (req, res) => {
  try {
    const { status, event_id, email } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (event_id) filter.event_id = event_id;
    if (email) filter.email = email;
    
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
});
// Database connection (modify the connection string as needed)
mongoose.connect('mongodb://localhost:27017/event_booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

module.exports = app;