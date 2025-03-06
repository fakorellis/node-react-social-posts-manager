import { ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="p-3">
      <h4>Navigation</h4>
      <ListGroup>
        <ListGroupItem tag={Link} to="/posts" action>
          Posts
        </ListGroupItem>
        <ListGroupItem tag={Link} to="/liked-posts" action>
          Liked Posts
        </ListGroupItem>
      </ListGroup>
    </div>
  );
};

export default Navigation;
