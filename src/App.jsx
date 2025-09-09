import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

// import "easzy-form/dist/index.css";
import Home from "./pages/home";
import MoneyTransfer from "./pages/moneytransfer";
function App() {
  return (
    <BrowserRouter>
      <div className="p-4">
        <Link to="moneytransfer">monet transfer</Link>
        <Routes>
          <Route path="/" element={<Home />} />{" "}
          <Route path="/moneytransfer" element={<MoneyTransfer />} />{" "}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
