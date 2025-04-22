import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import GiftAirtime from "./pages/GiftAirtime";
import GiftToken from "./pages/GiftToken";
import WalletContextProvider from "./components/walletConnect";
import { Layout } from "./components/Layout";

function App() {
  return (
    <WalletContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/gift-airtime"
              element={
                <ProtectedRoute>
                  <GiftAirtime />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gift-token"
              element={
                <ProtectedRoute>
                  <GiftToken />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </WalletContextProvider>
  );
}

export default App;
