import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Bill() {
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL || "https://kalavati-backend.onrender.com";

  const [patient, setPatient] = useState({});
  const [charges, setCharges] = useState({
    consulting: "",
    stitches: "",
    injection: "",
    medicine: ""
  });

  useEffect(() => {
    fetch(`${API_URL}/patients/${id}`)
      .then((res) => res.json())
      .then((data) => setPatient(data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharges({ ...charges, [name]: value });
  };

  const total = Object.values(charges).reduce((acc, val) => acc + Number(val || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 print:p-0">
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow print:shadow-none print:border-none print:p-0 text-center">
        <h2 className="text-2xl font-bold mb-6 print:mb-2 print:hidden">Invoice</h2>

        <div className="space-y-2 text-left mb-6">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.sex}</p>
        </div>

        {/* Editable Charges (Screen View) */}
        <div className="space-y-4 text-left print:hidden">
          {["consulting", "stitches", "injection", "medicine"].map((field) => (
            <div key={field}>
              <label className="font-medium capitalize">{field} Charge:</label>
              <input
                type="number"
                name={field}
                value={charges[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          ))}
        </div>

        {/* Grid Display (Print View) */}
        <div className="hidden print:grid grid-cols-2 gap-x-4 gap-y-2 text-left text-lg mt-6">
          <div><strong>Consulting Charge:</strong></div>
          <div>Rs. {charges.consulting || 0}</div>
          <div><strong>Stitches Charge:</strong></div>
          <div>Rs. {charges.stitches || 0}</div>
          <div><strong>Injection Charge:</strong></div>
          <div>Rs. {charges.injection || 0}</div>
          <div><strong>Medicine Charge:</strong></div>
          <div>Rs. {charges.medicine || 0}</div>
        </div>

        {/* Total */}
        <div className="mt-6 text-xl font-bold text-right pr-4">
          Total: Rs. {total}
        </div>

        {/* Signature */}
        <div className="mt-10 text-right pr-10">
          <p>Signature: __________________</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bill;
