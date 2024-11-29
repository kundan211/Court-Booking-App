import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Helper function for API requests
const makeRequest = async (url, method = "GET", data = null) => {
  const token = localStorage.getItem("token");

  try {
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error:", error);
    // alert("An error occurred. Please try again.");
  }
};

// Main Admin Component
function AdminDashboard() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [centers, setCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [activeForm, setActiveForm] = useState("center");
  const [slots, setSlots] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    const fetchCenters = async () => {
      const result = await makeRequest("http://localhost:5000/api/manager/centers");
      setCenters(result.centers || []);
    };

    fetchCenters();
  }, []);

  useEffect(() => {
    const fetchSports = async () => {
      if (!selectedCenter) return;
      const result = await makeRequest(`http://localhost:5000/api/manager/centers/${selectedCenter}/sports`);
      setSports(result.sports || []);
    };

    fetchSports();
  }, [selectedCenter]);

  useEffect(() => {
    const fetchCourts = async () => {
      if (!selectedSport) return;
      const result = await makeRequest(`http://localhost:5000/api/manager/sports/${selectedSport}/courts`);
      setCourts(result.courts || []);
    };

    fetchCourts();
  }, [selectedSport]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Redirect to the login page using useNavigate
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeForm === "slots") {
      if (!selectedCourt) {
        alert("Please select a court.");
        return;
      }
      const slotArray = slots.split(",").map((slot) => slot.trim());
      const result = await makeRequest(`http://localhost:5000/api/manager/court/${selectedCourt}/slots`, "POST", { slots: slotArray });
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="mb-8 text-3xl font-bold text-center">Admin Page</h1>

      {/* Logout Button at Top Right */}
      <div className="flex justify-end mb-4">
        <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700">
          Logout
        </button>
      </div>

      {/* Button Section */}
      <div className="flex justify-center mb-8 space-x-4">
        <button onClick={() => setActiveForm("center")} className={`px-4 py-2 rounded-md text-white ${activeForm === "center" ? "bg-blue-700" : "bg-blue-500"}`}>
          Add Center
        </button>
        <button onClick={() => setActiveForm("sport")} className={`px-4 py-2 rounded-md text-white ${activeForm === "sport" ? "bg-blue-700" : "bg-blue-500"}`}>
          Add Sport
        </button>
        <button onClick={() => setActiveForm("court")} className={`px-4 py-2 rounded-md text-white ${activeForm === "court" ? "bg-blue-700" : "bg-blue-500"}`}>
          Add Court
        </button>
      </div>

      {/* Forms Section */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Add Center Form */}
        {activeForm === "center" && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            const centerName = e.target.centerName.value;
            const location = e.target.location.value;
            const result = await makeRequest("http://localhost:5000/api/manager/center", "POST", { name: centerName, location });
            alert(result.message);
            setCenters((prev) => [...prev, result.center]);
            e.target.reset();
          }} className="p-4 space-y-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Add Center</h2>
            <input name="centerName" type="text" placeholder="Center Name" className="w-full p-2 border rounded-md" required />
            <input name="location" type="text" placeholder="Location" className="w-full p-2 border rounded-md" required />
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">Add Center</button>
          </form>
        )}

        {/* Add Sport Form */}
        {activeForm === "sport" && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            const sportName = e.target.sportName.value;
            const result = await makeRequest("http://localhost:5000/api/manager/sport", "POST", { name: sportName, center_id: selectedCenter });
            alert(result.message);
            setSports((prev) => [...prev, result.sport]);
            e.target.reset();
          }} className="p-4 space-y-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Add Sport</h2>
            <select value={selectedCenter} onChange={(e) => setSelectedCenter(e.target.value)} className="w-full p-2 border rounded-md" required>
              <option value="">Select Center</option>
              {centers.map((center) => (
                <option key={center._id} value={center._id}>{center.name}</option>
              ))}
            </select>
            <input name="sportName" type="text" placeholder="Sport Name" className="w-full p-2 border rounded-md" required />
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">Add Sport</button>
          </form>
        )}

        {/* Add Court Form */}
        {activeForm === "court" && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            const courtName = e.target.courtName.value;
            const slotInput = e.target.slotInput.value;
            const slotArray = slotInput.split(",").map(slot => slot.trim());

            const result = await makeRequest("http://localhost:5000/api/manager/court", "POST", {
              name: courtName,
              sport_id: selectedSport,
              slots: slotArray
            });

            alert(result.message);
            e.target.reset();
          }} className="p-4 space-y-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Add Court</h2>
            <select value={selectedCenter} onChange={(e) => setSelectedCenter(e.target.value)} className="w-full p-2 border rounded-md" required>
              <option value="">Select Center</option>
              {centers.map((center) => (
                <option key={center._id} value={center._id}>{center.name}</option>
              ))}
            </select>
            <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} className="w-full p-2 border rounded-md" required>
              <option value="">Select Sport</option>
              {sports.filter(sport => sport.center_id === selectedCenter).map((sport) => (
                <option key={sport._id} value={sport._id}>{sport.name}</option>
              ))}
            </select>
            <input name="courtName" type="text" placeholder="Court Name" className="w-full p-2 border rounded-md" required />
            <input name="slotInput" type="text" placeholder="Enter Slots (e.g., 09:00-10:00, 10:00-11:00)" className="w-full p-2 border rounded-md" required />
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">Add Court</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
