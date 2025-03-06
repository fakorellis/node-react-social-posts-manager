import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row className="w-100">
          <Col md={{ size: 6, offset: 3 }}>
            <Card className="shadow-lg p-4">
              <CardBody className="text-center">
                <h2 className="mb-3">Welcome to Social Posts Manager</h2>
                <p className="text-muted">
                  Manage your posts and interact with others.
                </p>
                <Button color="primary" tag={Link} to="/login" className="m-2">
                  Login
                </Button>
                <Button color="success" tag={Link} to="/signup" className="m-2">
                  Sign Up
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
