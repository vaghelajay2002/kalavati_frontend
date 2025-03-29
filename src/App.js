import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import PatientDetails from "./PatientDetails";
import AddEditPatient from "./AddEditPatient";
import EditPatient from "./EditPatient";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import Prescription from "./Prescription"; // or wherever your file is located
import Bill from "./Bill";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protect Dashboard */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* Protect Other Routes */}
        <Route 
          path="/add-patient" 
          element={
            <PrivateRoute>
              <AddEditPatient />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/edit-patient/:id" 
          element={
            <PrivateRoute>
              <EditPatient />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/patient/:id" 
          element={
            <PrivateRoute>
              <PatientDetails />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/prescription/:id" 
          element={
            <PrivateRoute>
            <Prescription />
            </PrivateRoute>  
          } 
        />
        <Route 
          path="/bill/:id" 
          element={
            <PrivateRoute>
            <Bill />
            </PrivateRoute>  
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
