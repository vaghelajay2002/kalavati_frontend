import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";

function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || "https://kalavati-backend.onrender.com"; // Fallback URL

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/patients/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPatient(data);
        const queryParams = new URLSearchParams(location.search);
        
        // Print only once after data is fully loaded
        if (queryParams.get("print") === "true") {
          setTimeout(() => {
            window.print();
          }, 1000); // Allow 1 second for rendering before printing
  
          // Redirect to home only after print is closed
          const handleAfterPrint = () => {
            navigate("/");
          };
  
          window.addEventListener("afterprint", handleAfterPrint);
  
          return () => {
            window.removeEventListener("afterprint", handleAfterPrint);
          };
        }
      })
      .catch((error) => console.error("Error fetching patient:", error));
  }, [id, location.search, navigate]);
  
  

  useEffect(() => {
    fetch(`${API_URL}/patients/${id}`)
      .then((res) => res.json())
      .then((data) => setPatient(data))
      .catch((error) => console.error("Error fetching patient:", error));
  }, [id]);

  if (!patient) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Patient Details</h2>
      
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Personal Details</h3>
        
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><strong>Case id:</strong> {patient.id}</p>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Sex:</strong> {patient.sex}</p>
          <p><strong>Mobile:</strong> {patient.mobile}</p>
          <p><strong>Address:</strong> {patient.address}</p>
          <p><strong>Admit Date:</strong> {patient.admit_date.split("T")[0]}</p>
          <p><strong>Discharge Date:</strong> {patient.discharge_date ? patient.discharge_date.split("T")[0] : "Not Discharged"}</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Medical Information</h3>
        <p><strong>Chief Complaint:</strong> {patient.chief_complaint}</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <p><strong>BP:</strong> {patient.bp} mmHg</p>
          <p><strong>Pulse:</strong> {patient.pulse} bpm</p>
          <p><strong>SpO2:</strong> {patient.spo2}%</p>
          <p><strong>Temperature:</strong> {patient.temperature} °F</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Hospital Treatment</h3>
        <p>{patient.hospital_treatment || "No treatment provided"}</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-lg font-bold mt-4">Hospital Medicines</h3>
      <div className="bg-white shadow rounded p-4 mt-2">
        {patient.hospital_medicines?.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {patient.hospital_medicines.map((med, index) => (
              <li key={index} className="p-2 bg-blue-100 rounded">{med.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No medicines added</p>
        )}
      </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Discharge Treatment</h3>
        <p>{patient.discharge_treatment || "No discharge treatment provided"}</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-bold mt-4">Discharge Medicines</h3>
      <div className="bg-white shadow rounded p-4 mt-2">
        {patient.discharge_medicines?.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {patient.discharge_medicines.map((med, index) => (
              <li key={index} className="p-2 bg-green-100 rounded">{med.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No discharge medicines added</p>
        )}
      </div>
      </div>
    </div>
  );
}

export default PatientDetails;
