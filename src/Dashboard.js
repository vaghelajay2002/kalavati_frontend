import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 patients initially
  const [loading, setLoading] = useState(true); // New loading state
  const API_URL = process.env.REACT_APP_API_URL || "https://kalavati-backend.onrender.com"; // Fallback URL

  useEffect(() => {
    fetch(`${API_URL}/patients`)
      .then((res) => res.json())
      .then((data) => {
        const sortedPatients = data.sort((a, b) => {

          return b.id-a.id; // Sort in descending order (LIFO)
        });
        console.log(data);
        
        setPatients(sortedPatients);
      })
      .catch((error) => console.error("Error fetching patients:", error))
      .finally(() => setLoading(false)); // Set loading to false once API call is complete
  }, []);

  // Show loading text while fetching data
  if (loading) {
    return <p className="text-center text-gray-500 mt-10 text-lg">Loading...</p>;
  }

  // Search by Patient ID
  const filteredPatients = patients.filter((patient) =>
    patient.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🩺 Patients List</h2>
        <button
          onClick={() => navigate("/add-patient")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
        >
          + New Patient
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Patient ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-3 border rounded-lg w-full mb-6 shadow-sm focus:ring focus:ring-blue-300"
      />

      {/* Patients Grid */}
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPatients.slice(0, visibleCount).map((patient) => (
            <div
              key={patient.id}
              className="p-6 border rounded-xl shadow-md bg-white transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <h3 className="font-bold text-xl text-blue-600">{patient.name}</h3>
              <p className="text-gray-700">
                <strong>Patient ID:</strong> {patient.id}
              </p>
              <p className="text-gray-700">
                <strong>Age:</strong> {patient.age}
              </p>
              <p className="text-gray-700">
                <strong>Gender:</strong> {patient.sex}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/patient/${patient.id}`)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                >
                  View Details
                </button>
                <button
                  onClick={() => navigate(`/edit-patient/${patient.id}`)}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">No patients found</div>
      )}

      {/* Show More Button */}
      {visibleCount < filteredPatients.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount(visibleCount + 10)}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900 transition-all"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
