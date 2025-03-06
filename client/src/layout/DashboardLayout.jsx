import { Container, Row, Col } from "reactstrap";
import Navigation from "../components/Navigation";

const DashboardLayout = ({ children }) => {
  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={3}>
          <Navigation />
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <div className="p-4">{children}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;
