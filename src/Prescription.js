import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Prescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "https://kalavati-backend.onrender.com";

  const [patient, setPatient] = useState({});
  const [form, setForm] = useState({ advice: "" });
  const [medicines, setMedicines] = useState([]);

  const [followUpDate, setFollowUpDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toISOString().split("T")[0];
  });

  const [pastHistory, setPastHistory] = useState("");
  const [kco, setKco] = useState("");

  useEffect(() => {
    const fetchPatientAndMedicines = async () => {
      try {
        const res = await fetch(`${API_URL}/patients/${id}`);
        const data = await res.json();

        const hospitalMedDetails = await Promise.all(
          (data.hospital_medicines || []).map(async (medId) => {
            const res = await fetch(`${API_URL}/medicines/${medId}`);
            return await res.json();
          })
        );

        const dischargeMedDetails = await Promise.all(
          (data.discharge_medicines || []).map(async (medId) => {
            const res = await fetch(`${API_URL}/medicines/${medId}`);
            return await res.json();
          })
        );

        const allMedicines = [...hospitalMedDetails, ...dischargeMedDetails];

        setPatient(data);
        setMedicines(allMedicines);
      } catch (error) {
        console.error("Error loading prescription data:", error);
      }
    };

    fetchPatientAndMedicines();
  }, [id]);

  const handleInputChange = (e) => {
    setForm({ ...form, advice: e.target.value });
  };

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen flex justify-center p-4 pt-20 print:p-0">
      <div className="max-w-3xl w-full bg-white rounded shadow-md p-6 print:shadow-none print:border-none print:p-4 print-margin-top">

        {/* Date and K/C/O (right aligned) */}
<div className="mb-4 flex flex-col items-end text-sm text-gray-600 space-y-1">
  <p><strong>Date:</strong> {today}</p>

  {/* Editable K/C/O input - visible only on screen */}
  <input
    type="text"
    value={kco}
    onChange={(e) => setKco(e.target.value)}
    placeholder="K/C/O"
    className="print:hidden border-b outline-none bg-transparent w-40 text-right"
  />

  {/* K/C/O shown in print */}
  {kco && (
    <p className="hidden print:block"><strong>K/C/O:</strong> {kco}</p>
  )}
</div>


        <div className="space-y-3">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.sex}</p>
          <p><strong>Chief Complaint:</strong> {patient.chief_complaint}</p>

          {/* Editable Advice input (visible only on screen) */}
          <div className="mt-4 print:hidden">
            <label className="block font-semibold mb-1">Advice:</label>
            <input
              type="text"
              name="advice"
              placeholder="Write advice..."
              value={form.advice}
              onChange={handleInputChange}
              className="w-full outline-none bg-transparent border-b"
            />
          </div>

          {/* Print view Advice (visible only when printing) */}
          {form.advice && (
            <div className="mt-4 hidden print:grid grid-cols-1">
              <p><strong>Advice:</strong> {form.advice}</p>
            </div>
          )}

          {/* Vitals */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4 text-left">
            <div><strong>Temp:</strong> {patient.temperature || "N/A"} °F</div>
            <div><strong>SpO2:</strong> {patient.spo2 || "N/A"} % </div>
            <div><strong>Pulse:</strong> {patient.pulse || "N/A"} bpm </div>
            <div><strong>BP:</strong> {patient.bp || "N/A"} mmg </div>
            <div><strong>R/S:</strong> {patient.rs || "N/A"} </div>
            <div><strong>S/N:</strong> {patient.sn || "N/A"} </div>
          </div>

          {/* RX Section */}
          <div className="mt-4 text-left">
            <label className="font-semibold block mb-1">RX:</label>
            {medicines.length > 0 ? (
              <ul className="list-disc pl-6">
                {medicines.map((med, index) => (
                  <li key={index}>{med.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No medicines added</p>
            )}
          </div>

          {/* Follow Up */}
          <div className="mt-4 print:hidden">
            <label className="block font-semibold mb-1">Follow Up:</label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="border-b bg-transparent outline-none print:border-none"
            />
          </div>
          {followUpDate && (
            <div className="mt-2 hidden print:block">
              <p><strong>Follow Up:</strong> Next visit on {followUpDate}</p>
            </div>
          )}

          {/* Editable Past History input (visible only on screen) */}
<div className="mt-4 print:hidden">
  <label className="block font-semibold mb-1">Past History:</label>
  <input
    type="text"
    value={pastHistory}
    onChange={(e) => setPastHistory(e.target.value)}
    placeholder="Enter past history"
    className="w-full outline-none bg-transparent border-b"
  />
</div>

{/* Print view of Past History (only visible during print) */}
{pastHistory && (
  <div className="mt-4 hidden print:block">
    <p><strong>Past History:</strong> {pastHistory}</p>
  </div>
)}

        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4 justify-center print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Print
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Prescription;
