import "./App.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";

// Providers
import InchargeAuthProvider from "./utils/InchargeAuth";
import AdminAuthProvider from "./utils/AdminAuth";
import { FacultyAuthProvider } from "./utils/FacultyAuth";

// Routes & Utils
import AppRoutes from "./routes/AppRoutes";
import { setupLoggers } from "./utils/loggerSetup";

function App() {
  useEffect(() => {
    // Suppress specific Recharts and browser-specific noise
    setupLoggers();
  }, []);

  return (
    <InchargeAuthProvider>
      <AdminAuthProvider>
        <FacultyAuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </FacultyAuthProvider>
      </AdminAuthProvider>
    </InchargeAuthProvider>
  );
}

export default App;
