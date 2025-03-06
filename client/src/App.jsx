import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "reactstrap";
import { AuthProvider } from "./context/AuthContext.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import AllPosts from "./pages/AllPosts.jsx";
import LikedPosts from "./pages/LikedPosts.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePost from "./pages/CreatePost.jsx";

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
                  <DashboardLayout>
                    <AllPosts />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/liked-posts"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <LikedPosts />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CreatePost />
                  </DashboardLayout>
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
