import React from "react";
import { Trash2 } from "lucide-react"; // Red trash basket icon

const SelectedMedicines = ({ medicines, handleDelete }) => {
  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Selected Medicines:</h4>
      <ul className="space-y-2">
        {medicines.map((med) => (
          <li
            key={med.id}
            className="flex justify-between items-center bg-white p-2 rounded shadow text-gray-800"
          >
            <span>{med.name}</span>
            <button
              type="button"
              onClick={() => handleDelete(med.id)}
              className="text-red-500 hover:text-red-700 font-bold"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" fill="currentColor" />
            </button>
          </li>
        ))}
        {medicines.length === 0 && <li className="text-gray-500 italic">No medicines added.</li>}
      </ul>
    </div>
  );
};

export default SelectedMedicines;
