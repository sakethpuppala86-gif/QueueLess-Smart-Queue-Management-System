import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerPage from "./CustomerPage";
import StaffDashboard from "./StaffDashboard";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<CustomerPage />}
        />

        <Route
          path="/staff"
          element={<StaffDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;