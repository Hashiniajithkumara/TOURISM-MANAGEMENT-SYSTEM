import React from 'react';

function StoryCard({ event, openModal }) {
  return (
    <div className="story-card">
      <img src={event.bannerPath} alt={event.eventName} className="story-image" />
      <div className="story-content">
        <h3>{event.eventName}</h3>
        <p><strong>Type:</strong> {event.eventType}</p>
        <p><strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Venue:</strong> {event.venue.name}, {event.venue.city}</p>
        <p><strong>Available Seats:</strong> {event.tickets.reduce((total, ticket) => total + ticket.availableSeats, 0)}</p>
        <button className="read-more-btn" onClick={() => openModal(event)}>Read More</button>
      </div>
    </div>
  );
}

export default StoryCard;