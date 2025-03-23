import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || "https://kalavati-backend.onrender.com";

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    fetch(`${API_URL}/patients`)
      .then((res) => res.json())
      .then((data) => {
        const sortedPatients = data.sort((a, b) => b.id - a.id);
        setPatients(sortedPatients);
      })
      .catch((error) => console.error("Error fetching patients:", error))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      fetch(`${API_URL}/patients/${id}`, { method: "DELETE" })
        .then(() => {
          setPatients(patients.filter((patient) => patient.id !== id));
        })
        .catch((error) => console.error("Error deleting patient:", error));
    }
  };

  const handlePrint = (id) => {
    navigate(`/patient/${id}?print=true`); // Navigate to PatientDetails with a query param
  setTimeout(() => {
    window.print();
  }, 1000); // Wait 1 second before printing
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10 text-lg">Loading...</p>;
  }

  const filteredPatients = patients.filter((patient) =>
    patient.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🩺 Patients List</h2>
        <button
          onClick={() => navigate("/add-patient")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
        >
          + New Patient
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by Patient ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-3 border rounded-lg w-full mb-6 shadow-sm focus:ring focus:ring-blue-300"
      />

      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPatients.slice(0, visibleCount).map((patient) => (
            <div
              key={patient.id}
              className="p-6 border rounded-xl shadow-md bg-white transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-blue-600">{patient.name}</h3>
                <button onClick={() => handlePrint(patient.id)} className="text-gray-600 hover:text-gray-800">
  <Printer size={20} />
</button>
              </div>
              <p className="text-gray-700">
                <strong>Case No.</strong> {patient.id}
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
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">No patients found</div>
      )}

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
