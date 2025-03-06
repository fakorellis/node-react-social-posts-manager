import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "reactstrap";
import { AuthProvider } from "./context/AuthContext.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import AllPosts from "./pages/AllPosts.jsx";
import LikedPosts from "./pages/LikedPosts.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Protected Route */}
            <Route
              path="/posts"
              element={
                <ProtectedRoute>
                  <AllPosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/liked-posts"
              element={
                <ProtectedRoute>
                  <LikedPosts />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
