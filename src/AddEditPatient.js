import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MedicineInput from "./MedicineInput";
import SelectedMedicines from "./SelectedMedicines";

function AddPatient() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    sex: "",
    mobile: "",
    address: "",
    admit_date: "",
    discharge_date: "",
    chief_complaint: "",
    bp: "",
    pulse: "",
    spo2: "",
    temperature: "",
    hospital_treatment: "",
    discharge_treatment: "",
    hospital_medicines: [],
    discharge_medicines: [],
  });

  const API_URL = process.env.REACT_APP_API_URL || "https://kalavati-backend.onrender.com"; // Fallback URL

  const [medicineName, setMedicineName] = useState("");
  const [dischargeMedicineName, setDischargeMedicineName] = useState("");
  const [hospitalSuggestions, setHospitalSuggestions] = useState([]);
  const [dischargeSuggestions, setDischargeSuggestions] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [selectedDischargeMedicines, setSelectedDischargeMedicines] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      // Allow only numbers (digits) and enforce 10-digit limit
      if (/^\d{0,10}$/.test(value)) {
        setPatient((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setPatient((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchMedicineSuggestions = async (query, type) => {
    if (!query.trim()) {
      type === "hospital" ? setHospitalSuggestions([]) : setDischargeSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/medicines/search?query=${query}`);
      const data = await response.json();
      type === "hospital" ? setHospitalSuggestions(data) : setDischargeSuggestions(data);
    } catch (error) {
      console.error("Error fetching medicine suggestions:", error);
    }
  };

  const addMedicine = async (selectedMedicine, type) => {
    if (!selectedMedicine) return;

    try {
      const response = await fetch(`${API_URL}/medicines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: selectedMedicine.name }), // Ensure full name is sent
      });

      const newMedicine = await response.json();

      if (type === "hospital") {
        setSelectedMedicines([...selectedMedicines, newMedicine]);
        setPatient((prev) => ({
          ...prev,
          hospital_medicines: [...prev.hospital_medicines, newMedicine],
        }));
        setMedicineName("");
        setHospitalSuggestions([]);
      } else {
        setSelectedDischargeMedicines([...selectedDischargeMedicines, newMedicine]);
        setPatient((prev) => ({
          ...prev,
          discharge_medicines: [...prev.discharge_medicines, newMedicine],
        }));
        setDischargeMedicineName("");
        setDischargeSuggestions([]);
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };
  const handleDeleteDischargeMedicine = (id) => {
    const updated = selectedDischargeMedicines.filter((med) => med.id !== id);
    setSelectedDischargeMedicines(updated);
    setPatient((prev) => ({
      ...prev,
      discharge_medicines: updated.map((med) => med.id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedPatient = {
      ...patient,
      hospital_medicines: patient.hospital_medicines.map(med => med.id), // Extract only IDs
      discharge_medicines: patient.discharge_medicines.map(med => med.id), // Extract only IDs
    };
    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedPatient),
      });
      if (response.ok) {
        const data = await response.json(); // Assuming backend returns patient object with ID
        alert(`Patient created successfully with Case No. ${data.id}`);
        console.log(formattedPatient);

        navigate("/");
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🩺 Add New Patient</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Info Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">👤 Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={patient.name} onChange={handleInputChange} className="form-input" required />
            </div>
            <div>
              <label className="form-label">Age <span className="text-red-500">*</span></label>
              <input type="number" name="age" value={patient.age} onChange={handleInputChange} className="form-input" required />
            </div>
            <div>
              <label className="form-label">Gender <span className="text-red-500">*</span></label>
              <select name="sex" value={patient.sex} onChange={handleInputChange} className="form-input" required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="form-label">Mobile Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="mobile"
                value={patient.mobile}
                onChange={handleInputChange}
                className="form-input"
                required
                maxLength="10"
                inputMode="numeric" // Helps mobile users show number keyboard
                pattern="\d{10}"
                title="Mobile number must be exactly 10 digits"
              />
            </div>
            <div>
              <label className="form-label">Address <span className="text-red-500">*</span></label>
              <textarea
                name="address"
                value={patient.address}
                onChange={handleInputChange}
                className="form-input"
                required
              ></textarea>
            </div>

            <div>
              <label className="form-label">Admit Date <span className="text-red-500">*</span></label>
              <input type="date" name="admit_date" value={patient.admit_date} onChange={handleInputChange} className="form-input" max={new Date().toLocaleDateString("en-CA")}
                required />
            </div>
          </div>
        </div>

        {/* Medical Details Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🩹 Medical Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Chief Complaint <span className="text-red-500">*</span></label>
              <textarea
                name="chief_complaint"
                value={patient.chief_complaint}
                onChange={handleInputChange}
                className="form-input"
                required
              ></textarea>
            </div>
            <div>
              <label className="form-label">Blood Pressure</label>
              <input type="text" name="bp" value={patient.bp} onChange={handleInputChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">Pulse</label>
              <input type="text" name="pulse" value={patient.pulse} onChange={handleInputChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">SpO2 Level</label>
              <input type="text" name="spo2" value={patient.spo2} onChange={handleInputChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">Temperature</label>
              <input type="text" name="temperature" value={patient.temperature} onChange={handleInputChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">R/S</label>
              <input type="text" name="rs" value={patient.rs} onChange={handleInputChange} className="form-input" />
            </div>
          </div>
        </div>

        {/* Treatments Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🏥 Treatment & Medicines</h3>
          <div>
            <label className="form-label">Hospital Treatment</label>
            <textarea name="hospital_treatment" value={patient.hospital_treatment} onChange={handleInputChange} className="form-input"></textarea>
          </div>
          <div>
            <label className="form-label">R/X</label>
            <MedicineInput
              label="Search Hospital Medicine"
              medicineName={medicineName}
              setMedicineName={setMedicineName}
              addMedicine={(selectedMedicine) => addMedicine(selectedMedicine, "hospital")}
              suggestions={hospitalSuggestions}
              fetchSuggestions={(query) => fetchMedicineSuggestions(query, "hospital")}
            />
            <SelectedMedicines medicines={patient.hospital_medicines} />
          </div>
        </div>

        {/* Discharge Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🏠 Discharge Details</h3>
          <div>
            <label className="form-label">Discharge Treatment</label>
            <textarea name="discharge_treatment" value={patient.discharge_treatment} onChange={handleInputChange} className="form-input"></textarea>
          </div>
          <div>
            <label className="form-label">Add Discharge Medicines</label>
            <MedicineInput
              label="Search Discharge Medicine"
              medicineName={dischargeMedicineName}
              setMedicineName={setDischargeMedicineName}
              addMedicine={(selectedMedicine) => addMedicine(selectedMedicine, "discharge")}
              suggestions={dischargeSuggestions}
              fetchSuggestions={(query) => fetchMedicineSuggestions(query, "discharge")}
            />
            <SelectedMedicines medicines={patient.discharge_medicines} />
          </div>
        </div>

        <button type="submit" className="submit-button">Save Patient</button>
      </form>
    </div>
  );
}

export default AddPatient;
