import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MedicineInput from "./MedicineInput";
import SelectedMedicines from "./SelectedMedicines";

function EditPatient() {
  const { id } = useParams();
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
  });
  const API_URL = process.env.REACT_APP_API_URL || "https://kalavati-backend.onrender.com"; // Fallback URL

  const [selectedHospitalMedicines, setSelectedHospitalMedicines] = useState([]);
  const [selectedDischargeMedicines, setSelectedDischargeMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [dischargeMedicineName, setDischargeMedicineName] = useState("");
  const [hospitalSuggestions, setHospitalSuggestions] = useState([]);
  const [dischargeSuggestions, setDischargeSuggestions] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/patients/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPatient({
          ...data,

          admit_date: data.admit_date ? new Date(data.admit_date).toLocaleDateString("en-CA") : "",
          discharge_date: data.discharge_date ? new Date(data.discharge_date).toLocaleDateString("en-CA") : "",
        });
        setSelectedHospitalMedicines(data.hospital_medicines || []);
        setSelectedDischargeMedicines(data.discharge_medicines || []);
      })
      .catch((error) => console.error("Error fetching patient:", error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "admit_date" || name === "discharge_date") {
      // Convert the selected date to IST (UTC+5:30) manually
      const selectedDate = new Date(value);
      selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset() + 330); // 330 minutes = 5:30 hours

      setPatient((prev) => ({
        ...prev,
        [name]: value, // Store YYYY-MM-DD
      }));
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
      const res = await fetch(`${API_URL}/medicines/search?query=${query}`);
      const data = await res.json();
      type === "hospital" ? setHospitalSuggestions(data) : setDischargeSuggestions(data);
    } catch (error) {
      console.error("Error fetching medicine suggestions:", error);
    }
  };

  const addMedicine = async (selectedMedicine, type) => {
    if (!selectedMedicine || !selectedMedicine.name.trim()) return;

    try {
      let newMedicine;

      if (selectedMedicine.id) {
        // If a medicine was selected from suggestions, use it directly
        newMedicine = selectedMedicine;
      } else {
        // Check if the medicine already exists in the database before adding
        const checkRes = await fetch(`${API_URL}/medicines/search?query=${selectedMedicine.name}`);
        const existingMedicines = await checkRes.json();
        const existingMedicine = existingMedicines.find(
          (med) => med.name.toLowerCase() === selectedMedicine.name.toLowerCase()
        );

        if (existingMedicine) {
          newMedicine = existingMedicine; // Use existing medicine
        } else {
          // If it's a completely new medicine, add it to the database
          const res = await fetch(`${API_URL}/medicines`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: selectedMedicine.name }),
          });

          if (!res.ok) throw new Error("Failed to add medicine");
          newMedicine = await res.json();
        }
      }

      // Prevent duplicates
      const isDuplicate =
        (type === "hospital" && selectedHospitalMedicines.some((med) => med.id === newMedicine.id)) ||
        (type === "discharge" && selectedDischargeMedicines.some((med) => med.id === newMedicine.id));

      if (isDuplicate) {
        alert("Medicine is already added!");
        return;
      }

      if (type === "hospital") {
        const updatedHospitalMedicines = [...selectedHospitalMedicines, newMedicine];
        setSelectedHospitalMedicines(updatedHospitalMedicines);
        setPatient((prev) => ({
          ...prev,
          hospital_medicines: updatedHospitalMedicines.map((med) => med.id),
        }));
        setMedicineName(""); // Clear input field here
        setHospitalSuggestions([]); // Clear suggestions
      } else {
        const updatedDischargeMedicines = [...selectedDischargeMedicines, newMedicine];
        setSelectedDischargeMedicines(updatedDischargeMedicines);
        setPatient((prev) => ({
          ...prev,
          discharge_medicines: updatedDischargeMedicines.map((med) => med.id),
        }));
        setDischargeMedicineName(""); // Clear input field here
        setDischargeSuggestions([]); // Clear suggestions
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedPatient = {
        ...patient,
        hospital_medicines: selectedHospitalMedicines.map((med) => med.id),
        discharge_medicines: selectedDischargeMedicines.map((med) => med.id),
      };
      const response = await fetch(`${API_URL}/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPatient),
      });
      if (!response.ok) throw new Error("Failed to update patient");
      alert("Patient updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">✏️ Edit Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">👤 Personal Details</h3>
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
            <div>
              <label className="form-label">Discharge Date <span className="text-red-500">*</span></label>
              <input type="date" name="discharge_date" value={patient.discharge_date} onChange={handleInputChange} min={new Date().toLocaleDateString("en-CA")}
                className="form-input" />
            </div>
            <div>
              <label className="form-label">Chief Complaint <span className="text-red-500">*</span></label>
              <input
                name="chief_complaint"
                value={patient.chief_complaint}
                onChange={handleInputChange}
                className="form-input"
                disabled
              ></input>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🏥 Treatment & Medicines</h3>
          <div>
            <label className="form-label">Hospital Treatment</label>
            <textarea name="hospital_treatment" value={patient.hospital_treatment} onChange={handleInputChange} className="form-input"></textarea>
          </div>
          <MedicineInput
            label="Search Hospital Medicine"
            medicineName={medicineName}
            setMedicineName={setMedicineName}
            addMedicine={(selectedMedicine) => addMedicine(selectedMedicine, "hospital")}
            suggestions={hospitalSuggestions}
            fetchSuggestions={(query) => fetchMedicineSuggestions(query, "hospital")}
          />
          <SelectedMedicines medicines={selectedHospitalMedicines} />
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">🏠 Discharge Details</h3>
          <div>
            <label className="form-label">Discharge Treatment</label>
            <textarea name="discharge_treatment" value={patient.discharge_treatment} onChange={handleInputChange} className="form-input"></textarea>
          </div>
          <MedicineInput
            label="Search Discharge Medicine"
            medicineName={dischargeMedicineName}
            setMedicineName={setDischargeMedicineName}
            addMedicine={(selectedMedicine) => addMedicine(selectedMedicine, "discharge")}
            suggestions={dischargeSuggestions}
            fetchSuggestions={(query) => fetchMedicineSuggestions(query, "discharge")}
          />
          <SelectedMedicines medicines={selectedDischargeMedicines} />
        </div>

        <button type="submit" className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">Update Patient</button>
      </form>
    </div>
  );
}

export default EditPatient;