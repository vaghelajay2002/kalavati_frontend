import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const fixedCharges = [
  { label: "Consultation", defaultAmount: 200 },
  { label: "Followup", defaultAmount: 100 },
  { label: "RBS", defaultAmount: 50 },
  { label: "Minor Dressing", defaultAmount: 100 },
  { label: "Major Dressing", defaultAmount: 200 },
  { label: "Suturing", defaultAmount: 200 },
  { label: "Catheter/RT", defaultAmount: 100 },
  { label: "Gen. Ward Charges", defaultAmount: 500 },
  { label: "Semi Special Room", defaultAmount: 1000 },
  { label: "AC Special Room", defaultAmount: 1500 },
  { label: "Injection Charges", defaultAmount: 100 },
  { label: "MLC Charges", defaultAmount: 2000 },
  { label: "Other Charges", defaultAmount: 0 }
];


function Bill() {
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL || "https://kalavati-backend.onrender.com";

  const [patient, setPatient] = useState({});
  const [search, setSearch] = useState("");
  const [charges, setCharges] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/patients/${id}`)
      .then((res) => res.json())
      .then((data) => setPatient(data));
  }, [id]);

  const handleAddCharge = (label, defaultAmount) => {
    if (!charges.find((c) => c.label === label)) {
      setCharges([...charges, { label, amount: defaultAmount }]);
    }
    setSearch("");
  };

  const handleAmountChange = (index, value) => {
    if (isNaN(value) || Number(value) < 0) return;
    const updated = [...charges];
    updated[index].amount = value;
    setCharges(updated);
  };

  const handleDelete = (index) => {
    const updated = [...charges];
    updated.splice(index, 1);
    setCharges(updated);
  };

  const total = charges.reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const handlePrint = () => {
    // Optional: Store total in patient record before printing
    // fetch(`${API_URL}/patients/${id}/updateTotal`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ total })
    // });
    window.print();
  };

  const filteredCharges = fixedCharges.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 print:p-0">
      <div className="w-full max-w-3xl bg-white p-6 rounded shadow print:shadow-none print:border-none print:p-0">

        {/* Print Header */}
        <div className="hidden print:block mb-6">
          <div className="flex justify-between">
            <div className="text-left">
              <h1 className="text-2xl font-bold">Kalavati Hospital</h1>
              <p className="text-sm">
                Bhagyalaxmi Complex, near bus stand, <br />
                Manjusar, Savali, Vadodara
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">HOSPITAL <br />
                INVOICE</h2>
              <p className="text-sm mt-2">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <div>
              <p><strong>Patient Name:</strong> {patient.name}</p>
              <p><strong>Age:</strong> {patient.age}</p>
            </div>
          </div>

          {/* Charges Table */}
          <table className="w-full mt-6 border border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Charge Description</th>
                <th className="border px-4 py-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {charges.map((charge, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-1">{charge.label}</td>
                  <td className="border px-4 py-1 text-right">{charge.amount}</td>
                </tr>
              ))}
              <tr>
                <td className="border px-4 py-2 font-bold">Total</td>
                <td className="border px-4 py-2 text-right font-bold">₹{total}</td>
              </tr>
            </tbody>
          </table>

          {/* Signature */}
          <div className="mt-10 text-right pr-4">
            <p>Signature: __________________</p>
          </div>
        </div>

        {/* On-screen (non-print) section */}
        <div className="space-y-2 text-left mb-6 print:hidden">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.sex}</p>
        </div>

        {/* Search Charges */}
        <div className="mb-4 print:hidden">
          <input
            type="text"
            placeholder="Search charges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {search && (
            <ul className="border mt-1 rounded shadow bg-white max-h-40 overflow-auto">
              {filteredCharges.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => handleAddCharge(item.label, item.defaultAmount)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item.label} - ₹{item.defaultAmount}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Charges List */}
        <div className="space-y-4 mb-4 print:hidden">
          {charges.map((charge, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 border-b pb-2"
            >
              <span className="flex-1">{charge.label}</span>
              <input
                type="number"
                min="0"
                value={charge.amount}
                onChange={(e) => handleAmountChange(index, e.target.value)}
                className="w-28 border p-1 rounded"
              />
              <button
                onClick={() => handleDelete(index)}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Show Total (Non-Print) */}
        <div className="text-right font-semibold text-lg mt-4 mb-6 print:hidden">
          Total: ₹{total}
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
