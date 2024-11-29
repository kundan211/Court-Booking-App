import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const [centers, setCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({}); // Track booked slots
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [date, setDate] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/manager/centers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCenters(data.centers);
        }
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    fetchCenters();
  }, []);

  useEffect(() => {
    const fetchSports = async () => {
      if (selectedCenter) {
        try {
          const response = await fetch(`http://localhost:5000/api/manager/centers/${selectedCenter}/sports`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setSports(data.sports);
            setSelectedSport("");
            setCourts([]);
            setBookedSlots({}); // Reset booked slots when center changes
          }
        } catch (error) {
          console.error("Error fetching sports:", error);
        }
      }
    };

    fetchSports();
  }, [selectedCenter]);

  useEffect(() => {
    const fetchCourts = async () => {
      if (selectedSport && date) {
        try {
          const response = await fetch(`http://localhost:5000/api/manager/sports/${selectedSport}/courts?date=${date}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setCourts(data.courts);
          }
        } catch (error) {
          console.error("Error fetching courts:", error);
        }
      }
    };

    fetchCourts();
  }, [selectedSport, date]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
    // Reset booked slots when date changes
    setBookedSlots({});
  };

  const formatDateToDDMMYYYY = (dateString) => {
    const dateObj = new Date(dateString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleBooking = async (courtId, slot, date) => {
    try {
      const token = localStorage.getItem("token");
      const formattedDate = formatDateToDDMMYYYY(date);

      const response = await fetch("http://localhost:5000/api/bookings/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          court_id: courtId,
          slot: slot,
          date: formattedDate,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Booking successful!");

        // Update booked slots state for the specific date
        setBookedSlots((prev) => ({
          ...prev,
          [`${date}-${courtId}-${slot}`]: true, // Mark this slot as booked for the specific date
        }));
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.message}`);
      }
    } catch (error) {
      console.error("Error during booking:", error);
      alert("An error occurred during booking. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome, {user.name || "Guest"}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block mb-2">Select Center:</label>
          <select
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select a center</option>
            {centers.map((center) => (
              <option key={center._id} value={center._id}>
                {center.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCenter && (
          <div>
            <label className="block mb-2">Select Sport:</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select a sport</option>
              {sports.map((sport) => (
                <option key={sport._id} value={sport._id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedSport && (
          <div>
            <label className="block mb-2">Select Date:</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="p-2 border rounded"
              required
            />
          </div>
        )}
      </div>

      {selectedSport && date && (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Available Courts</h2>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border-b p-2 text-center font-bold">Time Slot</th>
                {courts.map((court) => (
                  <th key={court.id} className="border-b p-2 text-center font-bold">{court.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courts.length > 0 && courts[0].slots.map((slot, index) => (
                <tr key={index}>
                  <td className="border-b p-2 text-center">{slot.slot}</td>
                  {courts.map((court) => (
                    <td key={court.id} className="border-b p-2 text-center">
                      {bookedSlots[`${date}-${court.id}-${slot.slot}`] ? (
                        <span className="text-red-500">Booked</span>
                      ) : (
                        <button
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
                          onClick={() => handleBooking(court.id, slot.slot, date)}
                        >
                          Book
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
