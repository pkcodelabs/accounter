import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/home";
import MoneyTransfer from "./pages/moneytransfer";
import Auth from "./pages/login";
import logo from "./assets/logo.png"; // Adjust the path if needed

function RequireAuth({ children }) {
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true }); // Proper React Router way
  };

  return (
    <div className="min-h-screen text-[#34D399] ">
      {/* Header */}
      <header className="flex items-center justify-between bg-white shadow-md p-4">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="App Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-xl hidden md:block font-bold"> Accounts</h1>
        </div>

        <nav className="flex space-x-4">
          <Link to="/" className=" hover:underline font-medium">
            Billings
          </Link>
          <Link to="/moneytransfer" className=" hover:underline font-medium">
            Money Transfer
          </Link>
        </nav>

        <div>
          <button
            onClick={handleLogout}
            className="text-red-500 font-medium  px-3 py-1 rounded hover:bg-red-600"
          >
            logout
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-6">
        <Routes>
          <Route path="/login" element={<Auth />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />

          <Route
            path="/moneytransfer"
            element={
              <RequireAuth>
                <MoneyTransfer />
              </RequireAuth>
            }
          />

          {/* Redirect unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
