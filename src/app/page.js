"use client"
import { useState, useEffect } from 'react';

const initialRoutes = [
  { id: '1', name: 'New York to Boston', seats: Array(40).fill(true) },
  { id: '2', name: 'Los Angeles to San Francisco', seats: Array(50).fill(true) },
  // Add more routes here
];

export default function Home() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [routes, setRoutes] = useState(initialRoutes);
  const [confirmation, setConfirmation] = useState(null); // State for ticket confirmation

  // Load seat data from session storage
  useEffect(() => {
    const storedRoutes = sessionStorage.getItem('routes');
    if (storedRoutes) {
      setRoutes(JSON.parse(storedRoutes));
    }
  }, []);

  // Save seat data to session storage whenever routes change
  useEffect(() => {
    sessionStorage.setItem('routes', JSON.stringify(routes));
  }, [routes]);

  const handleRouteChange = (event) => {
    const routeId = event.target.value;
    const route = routes.find((r) => r.id === routeId);
    setSelectedRoute(route);
    setSelectedSeats([]); // Clear selected seats when changing routes
    setConfirmation(null); // Clear confirmation on route change
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
    
    // Create a confirmation message
    const seatNumbers = selectedSeats.map(seatIndex => seatIndex + 1).join(', ');
    const confirmationMessage = `Booking confirmed for ${selectedRoute.name}. Seats: ${seatNumbers}`;

    // Update seat availability
    const updatedRoutes = routes.map((route) => {
      if (route.id === selectedRoute.id) {
        const updatedSeats = [...route.seats];
        selectedSeats.forEach((seatIndex) => {
          updatedSeats[seatIndex] = false; // Mark seats as booked
        });
        return { ...route, seats: updatedSeats };
      }
      return route;
    });

    setRoutes(updatedRoutes); // Update state with new routes
    setConfirmation(confirmationMessage); // Set the confirmation message

    // Reset form
    setSelectedRoute(null);
    setSelectedSeats([]);
  };

  return (
    <div>
      <h1>Bus Ticket App</h1>
      <form onSubmit={handleSubmit}>
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
                  className={selectedSeats.includes(index) ? 'selected' : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={!selectedRoute || selectedSeats.length === 0}>
          Book Now
        </button>
      </form>

      {/* Display ticket confirmation if available */}
      {confirmation && (
        <div className="confirmation">
          <h2>Ticket Confirmation</h2>
          <p>{confirmation}</p>
        </div>
      )}

      <style jsx>{`
        .bus-layout {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 5px;
        }
        .bus-layout button {
          padding: 10px;
          border: 1px solid #ccc;
        }
        .bus-layout button.selected {
          background-color: #007bff;
          color: white;
        }
        .bus-layout button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .confirmation {
          margin-top: 20px;
          padding: 10px;
          border: 1px solid #007bff;
          background-color: #e7f1ff; /* Light blue background */
          color: #333; /* Darker text color for visibility */
        }
      `}</style>
    </div>
  );
}
