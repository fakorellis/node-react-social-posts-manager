import { ListGroup, ListGroupItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation(); // Get current route

  return (
    <div className="p-3">
      <h4>Navigation</h4>
      <ListGroup>
        <ListGroupItem
          tag={NavLink}
          to="/posts"
          action
          className={location.pathname === "/posts" ? "active-nav-item" : ""}
        >
          Posts
        </ListGroupItem>
        <ListGroupItem
          tag={NavLink}
          to="/liked-posts"
          action
          className={
            location.pathname === "/liked-posts" ? "active-nav-item" : ""
          }
        >
          Liked Posts
        </ListGroupItem>
        <ListGroupItem
          tag={NavLink}
          to="/create-post"
          action
          className={
            location.pathname === "/create-post" ? "active-nav-item" : ""
          }
        >
          Create Post
        </ListGroupItem>
      </ListGroup>
    </div>
  );
};

export default Navigation;
