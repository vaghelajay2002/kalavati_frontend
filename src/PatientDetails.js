import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";

function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || "https://kalavati-backend.onrender.com"; // Fallback URL


  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/patients/${id}`);
        const data = await res.json();
  
        // Fetch hospital medicine names
        const hospitalMedDetails = await Promise.all(
          (data.hospital_medicines || []).map(async (medId) => {
            const res = await fetch(`${API_URL}/medicines/${medId}`);
            return await res.json();
          })
        );
  
        // Fetch discharge medicine names
        const dischargeMedDetails = await Promise.all(
          (data.discharge_medicines || []).map(async (medId) => {
            const res = await fetch(`${API_URL}/medicines/${medId}`);
            return await res.json();
          })
        );
  
        // Set the patient with medicine details
        setPatient({
          ...data,
          hospital_medicines: hospitalMedDetails,
          discharge_medicines: dischargeMedDetails,
        });
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };
  
    fetchPatientDetails();
  }, [id]);
  

  if (!patient) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Patient Details</h2>
      
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Personal Details</h3>
        
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><strong>Case id:</strong> {patient.case_no}</p>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Sex:</strong> {patient.sex}</p>
          <p><strong>Mobile:</strong> {patient.mobile}</p>
          <p><strong>Address:</strong> {patient.address}</p>
          <p><strong>Admit Date:</strong> {patient.admit_date.split("T")[0]}</p>
          {patient.discharge_date && (
            <p><strong>Discharge Date:</strong> {patient.discharge_date ? patient.discharge_date.split("T")[0] : "Not Discharged"}</p>
          )}
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
        {patient.discharge_treatment && (
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Discharge Treatment</h3>
        <p>{patient.discharge_treatment || "No discharge treatment provided"}</p>
      </div>
      )}
      {patient.discharge_treatment && (
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
      )}
    </div>
  );
}

export default PatientDetails;
