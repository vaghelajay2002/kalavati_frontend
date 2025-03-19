import { useState } from "react";

function MedicineInput({ label, medicineName, setMedicineName, addMedicine, suggestions, fetchSuggestions }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div>
      {/* <label className="block font-semibold">{label}:</label> */}
      <input
        type="text"
        value={medicineName}
        placeholder="Search Medicines..."
        onChange={(e) => {
          setMedicineName(e.target.value);
          fetchSuggestions(e.target.value);
          setShowSuggestions(true);
        }}
        className="border p-2 w-full"
      />
      
      {/* Medicine Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="border border-gray-300 bg-white absolute z-10 w-full">
          {suggestions.map((medicine) => (
            <li
              key={medicine.id}
              onClick={() => {
                addMedicine(medicine); // Pass full medicine object
                setMedicineName(""); // Set full name
                setShowSuggestions(false);
              }}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {medicine.name}
            </li>
          ))}
        </ul>
      )}
      
      <button type="button" onClick={() => addMedicine({ name: medicineName })} className="mt-2 p-2 bg-blue-500 text-white rounded">
        Add Medicine
      </button>
    </div>
  );
}

export default MedicineInput;
