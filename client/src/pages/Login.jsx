import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Alert,
  Spinner,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/login",
        { username, password }
      );

      if (response.status === 200) {
        const token = response.data.data.token;
        await login(token);
        navigate("/posts");
      }
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Login failed! Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row className="w-100">
          <Col md={{ size: 6, offset: 3 }}>
            <Card className="shadow-lg p-4">
              <CardBody>
                <h2 className="text-center mb-4">Login</h2>

                {error && <Alert color="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <Button
                    color="primary"
                    block
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Login"}
                  </Button>
                </Form>
                <p className="mt-3 text-center">
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
