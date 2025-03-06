import { useState } from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ title: "", message: "" }); // Error state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ title: "", message: "" });

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/register",
        formData
      );
      if (response.status === 201) {
        navigate("/login"); // Redirect to login page after successful signup
      }
    } catch (err) {
      const errorCode = err.response?.data?.errorCode;

      if (errorCode) {
        setError({
          title: errorCode.userTitle || "Signup Error",
          message:
            errorCode.userMessage || "Something went wrong. Please try again.",
        });
      } else {
        setError({
          title: "Signup Failed",
          message: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row className="w-100">
          <Col md={{ size: 6, offset: 3 }} sm={8} xs={10}>
            <Card className="shadow-lg signup-card">
              <CardBody className="p-4">
                <h2 className="text-center mb-4">Sign Up</h2>

                {error.title && (
                  <Alert color="danger">
                    <strong>{error.title}</strong>
                    <br />
                    {error.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Username</Label>
                    <Input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <div className="text-center mt-3">
                    <Button color="primary" type="submit" disabled={loading}>
                      {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                  </div>
                </Form>

                <p className="mt-3 text-center">
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;
