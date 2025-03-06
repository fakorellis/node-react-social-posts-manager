import { ListGroup, ListGroupItem, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

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
      <Button color="danger" size="sm" className="mt-4 w-100" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Navigation;
