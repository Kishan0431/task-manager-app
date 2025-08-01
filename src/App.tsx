// App.tsx
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthContainer } from "./pages/AuthContainer";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthContainer />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
