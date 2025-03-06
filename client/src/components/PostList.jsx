import { Card, CardBody, CardTitle, Button } from "reactstrap";

const PostList = ({ posts, handleLike }) => {
  return (
    <>
      {posts.map((post) => (
        <Card key={post._id} className="mb-4">
          <CardBody>
            <CardTitle tag="h5">{post.title}</CardTitle>
            <p>{post.body}</p>
            <Button
              color={post.isLiked ? "warning" : "success"}
              onClick={() => handleLike(post._id)}
            >
              {post.isLiked ? "Unlike" : "Like"}
            </Button>
          </CardBody>
        </Card>
      ))}
    </>
  );
};

export default PostList;
