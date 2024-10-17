"use client";
import { useState, useEffect } from 'react';

const initialRoutes = [
  { id: '1', name: 'New York to Boston', seats: Array(40).fill(true) },
  { id: '2', name: 'Los Angeles to San Francisco', seats: Array(50).fill(true) },
  // Add more routes here
];

export default function Home() {
  const [userInfo, setUserInfo] = useState({ name: '', email: '', dob: '' });
  const [step, setStep] = useState(1);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [routes, setRoutes] = useState(initialRoutes);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const storedRoutes = sessionStorage.getItem('routes');
    if (storedRoutes) {
      setRoutes(JSON.parse(storedRoutes));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('routes', JSON.stringify(routes));
  }, [routes]);

  const handleUserInfoChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserInfoSubmit = (event) => {
    event.preventDefault();
    setStep(2);
  };

  const handleRouteChange = (event) => {
    const routeId = event.target.value;
    const route = routes.find((r) => r.id === routeId);
    setSelectedRoute(route);
    setSelectedSeats([]);
    setConfirmation(null);
  };

  const handleSeatChange = (seatIndex) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatIndex)) {
        return prevSelectedSeats.filter((seat) => seat !== seatIndex);
      } else {
        return [...prevSelectedSeats, seatIndex];
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const seatNumbers = selectedSeats.map(seatIndex => seatIndex + 1).join(', ');
    const confirmationMessage = `Booking confirmed for ${userInfo.name} (${userInfo.email}, DOB: ${userInfo.dob}). Route: ${selectedRoute.name}. Seats: ${seatNumbers}`;

    const updatedRoutes = routes.map((route) => {
      if (route.id === selectedRoute.id) {
        const updatedSeats = [...route.seats];
        selectedSeats.forEach((seatIndex) => {
          updatedSeats[seatIndex] = false; 
        });
        return { ...route, seats: updatedSeats };
      }
      return route;
    });

    setRoutes(updatedRoutes);
    setConfirmation(confirmationMessage);
    setSelectedRoute(null);
    setSelectedSeats([]);
    setStep(1);
    setUserInfo({ name: '', email: '', dob: '' });
  };

  return (
    <div className="container">
      <h1>Bus Ticket App</h1>
      {step === 1 && (
        <form className="user-info-form" onSubmit={handleUserInfoSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userInfo.name}
              onChange={handleUserInfoChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              required
            />
          </div>
          <div>
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={userInfo.dob}
              onChange={handleUserInfoChange}
              required
            />
          </div>
          <button className="next-button" type="submit">Next</button>
        </form>
      )}

      {step === 2 && (
        <form className="seat-selection-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="route">Select Route:</label>
            <select id="route" value={selectedRoute?.id || ''} onChange={handleRouteChange}>
              <option value="">Choose a route</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRoute && (
            <div>
              <h2>Select Seats:</h2>
              <div className="bus-layout">
                {selectedRoute.seats.map((isAvailable, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSeatChange(index)}
                    disabled={!isAvailable}
                    className={`seat-button ${selectedSeats.includes(index) ? 'selected' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="book-button" type="submit" disabled={!selectedRoute || selectedSeats.length === 0}>
            Book Now
          </button>
        </form>
      )}

      {confirmation && (
        <div className="confirmation">
          <h2>Ticket Confirmation</h2>
          <p>{confirmation}</p>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 800px; /* Increased width */
          margin: 0 auto;
          padding: 40px; /* Increased padding */
          font-family: Arial, sans-serif;
          background-color: #f5f5f5; /* Light background color */
          border-radius: 8px; /* Rounded corners */
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Shadow for depth */
        }
        h1 {
          text-align: center;
          color: #007bff; /* Changed header color */
          margin-bottom: 20px; /* Margin below the header */
        }
        .user-info-form, .seat-selection-form {
          border: 1px solid #007bff;
          border-radius: 8px;
          padding: 30px; /* Increased padding for forms */
          background-color: #fff; /* White background for forms */
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px; /* Increased margin below forms */
        }
        label {
          display: block;
          margin-bottom: 8px; /* Increased margin for labels */
          font-weight: bold;
          font-size: 1.1em; /* Slightly larger font size */
        }
        input, select {
          width: calc(100% - 20px);
          padding: 12px; /* Increased padding for inputs */
          margin-bottom: 15px; /* Increased margin for inputs */
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1em; /* Standard font size */
        }
        .next-button, .book-button {
          background-color: #007bff;
          color: white;
          padding: 12px 16px; /* Increased padding for buttons */
          border: none;
          border-radius: 5px;
          cursor: pointer;
          width: 100%;
          font-size: 1em; /* Standard font size for buttons */
          transition: background-color 0.3s;
        }
        .next-button:hover, .book-button:hover {
          background-color: #0056b3;
        }
        .bus-layout {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 10px; /* Increased gap between seats */
          margin-top: 20px; /* Increased margin above seat selection */
        }
        .seat-button {
          padding: 12px; /* Increased padding for seat buttons */
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #e7f1ff;
          transition: background-color 0.3s;
          font-size: 1em; /* Standard font size for seat buttons */
        }
        .seat-button.selected {
          background-color: #007bff;
          color: white;
        }
        .seat-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .confirmation {
          margin-top: 20px;
          padding: 20px; /* Increased padding for confirmation */
          border: 1px solid #007bff;
          background-color: #e7f1ff;
          color: #333;
          border-radius: 8px;
          text-align: center; /* Centered text for confirmation */
        }
      `}</style>
    </div>
  );
}
