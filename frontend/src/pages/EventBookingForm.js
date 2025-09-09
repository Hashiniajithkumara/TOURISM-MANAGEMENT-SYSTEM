import React, { useEffect, useState } from "react"; 
import './EventBookingForm.css';
import axios from 'axios';

const EventBookingForm = () => {
  const [formData, setFormData] = useState({
    event_id: "",
    name: "",
    numberOfTickets: 1,
    ticketType: "",
    ticketPrice: 0,
    foods: "",
    foodType: "",
    phone: "",
    email: "",
    totalCost: 0,
    bookingDate: "",
    bookingTime: "",
    status: "pending"
  });

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/events");
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // When event selection changes, update the selected event
  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setFormData({ 
      ...formData, 
      event_id: eventId,
      ticketType: "",
      ticketPrice: 0,
      numberOfTickets: 1,
      totalCost: 0
    });
    
    if (eventId) {
      const event = events.find(event => event._id === eventId);
      setSelectedEvent(event);
    } else {
      setSelectedEvent(null);
    }
  };

  // Handle all form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data based on input field
    if (name === "ticketType" && selectedEvent) {
      const selectedTicket = selectedEvent.tickets.find(ticket => ticket.type === value);
      if (selectedTicket) {
        const price = selectedTicket.price;
        const numTickets = formData.numberOfTickets;
        setFormData({ 
          ...formData, 
          [name]: value,
          ticketPrice: price,
          totalCost: price * numTickets
        });
      }
    } else if (name === "numberOfTickets" && formData.ticketType) {
      const numTickets = parseInt(value) || 0;
      setFormData({ 
        ...formData, 
        [name]: numTickets,
        totalCost: formData.ticketPrice * numTickets
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.event_id) newErrors.event_id = "Please select an event";
    if (!formData.ticketType) newErrors.ticketType = "Please select a ticket type";
    if (!formData.numberOfTickets || formData.numberOfTickets < 1) 
      newErrors.numberOfTickets = "At least 1 ticket is required";
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.name.length < 3) newErrors.name = "Name must be at least 3 characters";
    
    if (!formData.foods) newErrors.foods = "Food preference is required";
    if (formData.foods === "yes" && !formData.foodType) 
      newErrors.foodType = "Please select Veg or Non-Veg";
    
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10 digits";
    
    if (!formData.email) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";

    // Check ticket availability
    if (formData.ticketType && selectedEvent) {
      const selectedTicket = selectedEvent.tickets.find(ticket => ticket.type === formData.ticketType);
      const availableSeats = selectedTicket.availableSeats - selectedTicket.soldSeats;
      if (formData.numberOfTickets > availableSeats) {
        newErrors.numberOfTickets = `Only ${availableSeats} tickets are available`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      
      // Set current date and time for booking
      const now = new Date();
      const bookingDate = now.toISOString().split('T')[0];
      const bookingTime = now.toTimeString().split(' ')[0];
      
      const bookingData = {
        ...formData,
        bookingDate,
        bookingTime
      };
      
      try {
        const response = await axios.post('http://localhost:5000/api/bookings', bookingData);
        
        if (response.status === 201) {
          console.log("Booking Confirmed:", response.data);
          setSuccess(true);
          alert(`Event Booked Successfully! Booking ID: ${response.data.booking_id}`);
          
          // Reset form after success
          setTimeout(() => {
            setFormData({
              event_id: "",
              name: "",
              numberOfTickets: 1,
              ticketType: "",
              ticketPrice: 0,
              foods: "",
              foodType: "",
              phone: "",
              email: "",
              totalCost: 0,
              bookingDate: "",
              bookingTime: "",
              status: "pending"
            });
            setSelectedEvent(null);
            setErrors({});
            setSuccess(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Error submitting booking:", error);
        alert("There was an error while booking the event. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white text-black p-6 max-w-lg mx-auto">
      <h2 className="text-center text-2xl font-bold text-purple-700 mb-6">Book Your Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Selection */}
        <div>
          <label className="block text-gray-700 mb-2">Select Event</label>
          <select
            name="event_id"
            value={formData.event_id}
            onChange={handleEventChange}
            className="w-full p-3 border rounded-md"
          >
            <option value="">-- Select an Event --</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.eventName} - {new Date(event.startDate).toLocaleDateString()}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-sm">{errors.event_id}</p>
        </div>

        {/* Display selected event details */}
        {selectedEvent && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-xl font-semibold">{selectedEvent.eventName}</h3>
            <p>{selectedEvent.eventType}</p>
            <p>{selectedEvent.description}</p>
            <p>Date: {new Date(selectedEvent.startDate).toLocaleDateString()}</p>
            <p>Time: {selectedEvent.time}</p>
            <p>Venue: {selectedEvent.venue.name}, {selectedEvent.venue.city}</p>
            <p>Organizer: {selectedEvent.organizer.name}</p>
            
            {/* Ticket Selection Section */}
            <div className="mt-4">
              <h3 className="font-semibold text-lg">Tickets</h3>
              <ul className="list-disc pl-5 my-3">
                {selectedEvent.tickets.map((ticket, index) => (
                  <li key={index}>
                    <strong>{ticket.type}</strong>: ${ticket.price} (Available: {ticket.availableSeats - ticket.soldSeats})
                  </li>
                ))}
              </ul>
              
              {/* Ticket Type Selection */}
              <div className="mt-3">
                <label className="block text-gray-700 mb-2">Select Ticket Type</label>
                <select
                  name="ticketType"
                  value={formData.ticketType}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">-- Select Ticket Type --</option>
                  {selectedEvent.tickets.map((ticket, index) => (
                    <option 
                      key={index} 
                      value={ticket.type}
                      disabled={ticket.availableSeats - ticket.soldSeats < 1}
                    >
                      {ticket.type} - ${ticket.price}
                    </option>
                  ))}
                </select>
                <p className="text-red-500 text-sm">{errors.ticketType}</p>
              </div>
              
              {/* Number of Tickets */}
              {formData.ticketType && (
                <div className="mt-3">
                  <label className="block text-gray-700 mb-2">Number of Tickets</label>
                  <input
                    type="number"
                    name="numberOfTickets"
                    value={formData.numberOfTickets}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-3 border rounded-md"
                  />
                  <p className="text-red-500 text-sm">{errors.numberOfTickets}</p>
                </div>
              )}
              
              {/* Show Total Cost */}
              {formData.ticketType && formData.numberOfTickets > 0 && (
                <div className="mt-3 bg-purple-100 p-3 rounded-md">
                  <p className="font-semibold">Ticket Price: ${formData.ticketPrice}</p>
                  <p className="font-bold text-lg">Total Cost: ${formData.totalCost}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Name input */}
        <div>
          <label className="block text-gray-700 mb-2">Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full p-3 border rounded-md"
          />
          <p className="text-red-500 text-sm">{errors.name}</p>
        </div>

        {/* Food preference */}
        <div>
          <label className="block text-gray-700 mb-2">Food Preference</label>
          <select
            name="foods"
            value={formData.foods}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          >
            <option value="">Do you need food?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <p className="text-red-500 text-sm">{errors.foods}</p>
        </div>

        {formData.foods === "yes" && (
          <div>
            <label className="block text-gray-700 mb-2">Food Type</label>
            <select
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
            >
              <option value="">Select Food Type</option>
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
            </select>
            <p className="text-red-500 text-sm">{errors.foodType}</p>
          </div>
        )}

        {/* Phone number input */}
        <div>
          <label className="block text-gray-700 mb-2">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full p-3 border rounded-md"
          />
          <p className="text-red-500 text-sm">{errors.phone}</p>
        </div>

        {/* Email input */}
        <div>
          <label className="block text-gray-700 mb-2">Email Address</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="w-full p-3 border rounded-md"
          />
          <p className="text-red-500 text-sm">{errors.email}</p>
        </div>

        {/* Submit button */}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-purple-600 text-white text-lg px-6 py-3 rounded-md hover:bg-purple-700 transition-colors"
            disabled={loading || !selectedEvent || !formData.ticketType}
          >
            {loading ? "Processing..." : "Book Event"}
          </button>
        </div>

        {/* Success message */}
        {success && (
          <div className="text-green-500 text-center mt-4 p-3 bg-green-50 rounded-md">
            <p className="font-bold">Your event has been booked successfully! 🎉</p>
            <p>Check your email for confirmation details.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default EventBookingForm;