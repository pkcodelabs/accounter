import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// import "easzy-form/dist/index.css";
import Home from "./pages/home";
import MoneyTransfer from "./pages/moneytransfer";
function App() {
  return (
    <BrowserRouter>
      <div className="p-4">
        <Routes>
          <Route path="/home" element={<Home />} />{" "}
          <Route path="/moneytransfer" element={<MoneyTransfer />} />{" "}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
