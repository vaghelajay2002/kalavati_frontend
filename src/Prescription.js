import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Prescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "https://kalavati-backend.onrender.com";

  const [patient, setPatient] = useState({});
  const [form, setForm] = useState({ advice: "" });
  const [medicineList, setMedicineList] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/patients/${id}`)
      .then((res) => res.json())
      .then((data) => setPatient(data));

    fetch(`${API_URL}/medicines`)
      .then((res) => res.json())
      .then((data) => setMedicineList(data));
  }, [id]);

  const handleInputChange = (e) => {
    setForm({ ...form, advice: e.target.value });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 print:p-0">
      <div className="max-w-3xl w-full bg-white rounded shadow-md p-6 print:shadow-none print:border-none print:p-0">
        <div className="space-y-3">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Sex:</strong> {patient.sex}</p>

          <div className="mt-4">
            <label className="block font-semibold mb-1">Advice:</label>
            <input
  type="text"
  name="advice"
  placeholder="Write advice..."
  value={form.advice}
  onChange={handleInputChange}
  className="w-full outline-none bg-transparent"
/>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4 text-left">
            <div><strong>Temp:</strong> {patient.temp}</div>
            <div><strong>SpO2:</strong> {patient.spo2}</div>
            <div><strong>Pulse:</strong> {patient.pulse}</div>
            <div><strong>BP:</strong> {patient.bp}</div>
            <div><strong>S/E:</strong> {patient.se}</div>
          </div>

          <div className="mt-4 text-left">
            <label className="font-semibold block mb-1">RX:</label>
            <ul className="list-disc pl-6">
              {medicineList.map((med, index) => (
                <li key={index}>{med.name}</li>
              ))}
            </ul>
          </div>
        </div>

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
