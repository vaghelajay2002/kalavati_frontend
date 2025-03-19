const SelectedMedicines = ({ medicines }) => {
    return (
      <div className="mt-4">
        <h2 className="font-bold">Selected Medicines</h2>
        <ul className="list-disc ml-5">
          {medicines.map((med) => (
            <li key={med.id} className="p-1">
             {/* {console.log(med)}  */}
              {med.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default SelectedMedicines;
  