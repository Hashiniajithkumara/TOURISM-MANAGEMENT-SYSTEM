// import React, { useState, useEffect } from 'react';
// import { useNavigate} from 'react-router-dom';
// import StoryCard from '../components/StoryCard';
// import axios from 'axios';
// // import pic1 from '../assets/concert.jpg'; // Updated images based on new events
// // import pic2 from '../assets/newyear.jpg';
// // import pic3 from '../assets/family.jpeg';
// // import pic4 from '../assets/christmas party.jpg';
// // import pic5 from '../assets/beach party.jpeg';
// // import pic6 from '../assets/newyear.jpg'; // Updated image for food and wine festival
// // import pic7 from '../assets/Corporate-Event.jpg';
// // import pic8 from '../assets/newyear.jpg'; // Updated image for jazz night

// function Homepage() {
  // const [showModal, setShowModal] = useState(false);
  // const [selectedEvent, setSelectedEvent] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');

  // const navigate = useNavigate();
//   const [events, setEvents] = useState([]);
//   // const stories = [
//   //   { 
//   //     id: 1, 
//   //     image: pic1, 
//   //     title: 'Concert: Rock Night', 
//   //     date: '2025-05-12', 
//   //     time: '6:00 PM', 
//   //     note: 'Entry Fee: $50', 
//   //     slots: 100, 
//   //     comments: [], 
//   //     description: 'Enjoy an electrifying rock concert with live performances by local and international bands.',
//   //     category: 'Concert',
//   //     location: 'City Arena',
//   //     theme: 'Music'
//   //   },
//   //   { 
//   //     id: 2, 
//   //     image: pic2, 
//   //     title: 'New Year’s Eve Festival', 
//   //     date: '2025-12-31', 
//   //     time: '11:59 PM', 
//   //     note: 'Tickets: $30', 
//   //     slots: 200, 
//   //     comments: [], 
//   //     description: 'Ring in the new year with a spectacular festival featuring live music, fireworks, and street performances.',
//   //     category: 'Festival',
//   //     location: 'Downtown Square',
//   //     theme: 'Celebration'
//   //   },
//   //   { 
//   //     id: 3, 
//   //     image: pic3, 
//   //     title: 'Cultural Dance Show', 
//   //     date: '2025-07-15', 
//   //     time: '5:00 PM', 
//   //     note: 'Tickets: $20', 
//   //     slots: 50, 
//   //     comments: [], 
//   //     description: 'Experience the vibrant culture through traditional dance performances showcasing local heritage.',
//   //     category: 'Cultural Show',
//   //     location: 'Cultural Center',
//   //     theme: 'Traditional Dance'
//   //   },
//   //   { 
//   //     id: 4, 
//   //     image: pic4, 
//   //     title: 'Christmas Festival', 
//   //     date: '2025-12-25', 
//   //     time: '7:00 PM', 
//   //     note: 'Entry Fee: $40', 
//   //     slots: 150, 
//   //     comments: [], 
//   //     description: 'Celebrate Christmas with festive food, music, and holiday decorations at this family-friendly festival.',
//   //     category: 'Festival',
//   //     location: 'City Park',
//   //     theme: 'Holiday Celebration'
//   //   },
//   //   { 
//   //     id: 5, 
//   //     image: pic5, 
//   //     title: 'Beach Party', 
//   //     date: '2025-06-20', 
//   //     time: '4:00 PM', 
//   //     note: 'Tickets: $25', 
//   //     slots: 80, 
//   //     comments: [], 
//   //     description: 'Enjoy a fun-filled beach party with music, games, and a bonfire under the stars.',
//   //     category: 'Party',
//   //     location: 'Sunset Beach',
//   //     theme: 'Beach Party'
//   //   },
//   //   { 
//   //     id: 6, 
//   //     image: pic6, 
//   //     title: 'Food & Wine Festival', 
//   //     date: '2025-08-10', 
//   //     time: '3:00 PM', 
//   //     note: 'Tickets: $35', 
//   //     slots: 120, 
//   //     comments: [], 
//   //     description: 'Savor the finest local and international wines and cuisines at the most awaited food festival of the year.',
//   //     category: 'Festival',
//   //     location: 'Grand Exhibition Hall',
//   //     theme: 'Gastronomy'
//   //   },
//   //   { 
//   //     id: 7, 
//   //     image: pic7, 
//   //     title: 'Corporate Networking Event', 
//   //     date: '2025-09-30', 
//   //     time: '2:00 PM', 
//   //     note: 'Entry Fee: $100 per table', 
//   //     slots: 300, 
//   //     comments: [], 
//   //     description: 'A professional event for networking, brand collaboration, and business expansion.',
//   //     category: 'Business Event',
//   //     location: 'Corporate Convention Center',
//   //     theme: 'Networking'
//   //   },
//   //   { 
//   //     id: 8, 
//   //     image: pic8, 
//   //     title: 'Jazz Night Concert', 
//   //     date: '2025-11-18', 
//   //     time: '9:00 PM', 
//   //     note: 'Tickets: $70', 
//   //     slots: 500, 
//   //     comments: [], 
//   //     description: 'Experience an unforgettable night of smooth jazz music performed by renowned artists.',
//   //     category: 'Concert',
//   //     location: 'City Jazz Club',
//   //     theme: 'Music'
//   //   },
//   // ];
//   // Fetch events from backend on component mount
//   useEffect(() => {
//     axios.get('/api/events')  // Adjust the URL as needed to match your backend
//       .then(response => {
//         setEvents(response.data); // Store events in state
//       })
//       .catch(error => {
//         console.error('There was an error fetching the events!', error);
//       });
//   }, []);

// Homepage.js
import React, { useEffect, useState } from 'react';
import StoryCard from '../components/StoryCard';
import {useNavigate} from 'react-router-dom';

function Homepage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setEvents(data.events);
        }
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);
  const openModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="homepage">
      <h1>Upcoming Events</h1>
      <div className="story-grid">
        {events.length > 0 ? (
          events.map(event => <StoryCard key={event._id} event={event} openModal={openModal} />)
        ) : (
          <p>No events available</p>
        )}
      </div>
      {showModal && selectedEvent && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={closeModal}>✖</button>
      <h2>{selectedEvent.eventName}</h2>
      <img src={selectedEvent.bannerPath} alt={selectedEvent.eventName} className="modal-room-image" />
      <p><strong>Type:</strong> {selectedEvent.eventType}</p>
      <p>{selectedEvent.description}</p>
      <p><strong>Date:</strong> {new Date(selectedEvent.startDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {selectedEvent.time}</p>
      <p><strong>Venue:</strong> {selectedEvent.venue.name}, {selectedEvent.venue.address}, {selectedEvent.venue.city}, {selectedEvent.venue.country}</p>
      <p><strong>Organizer:</strong> {selectedEvent.organizer.name}</p>
      <p><strong>Contact:</strong> {selectedEvent.organizer.contactEmail} | {selectedEvent.organizer.contactPhone}</p>
      
      <h3>Tickets</h3>
      <ul>
        {selectedEvent.tickets.map((ticket, index) => (
          <li key={index}>
            <strong>{ticket.type}</strong>: ${ticket.price} (Available: {ticket.availableSeats - ticket.soldSeats})
          </li>
        ))}
      </ul>
        <button 
    className="book-final-btn" 
    onClick={() => navigate("/book", { state: { event: selectedEvent } })}
  >
    Book
  </button>

    </div>
  </div>
)}
    </div>
  );
}

export default Homepage;

