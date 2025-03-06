import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import Navigation from "../components/Navigation";
import PostList from "../components/PostList";
import PaginationControls from "../components/PaginationControls";

const fetchPosts = async ({ queryKey }) => {
  const [, page] = queryKey;
  const token = localStorage.getItem("token");

  const { data } = await axios.get("http://localhost:4000/api/v1/posts", {
    params: { page, limit: 5 },
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

const likePost = async (postId) => {
  const token = localStorage.getItem("token");

  await axios.put(
    `http://localhost:4000/api/v1/users/me/posts/${postId}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

const AllPosts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: postsResponse, isLoading, error } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: fetchPosts,
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: likePost,
    onSuccess: (_, postId) => {
      queryClient.setQueryData(["posts", currentPage], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: oldData.data.map((post) =>
            post._id === postId ? { ...post, isLiked: !post.isLiked } : post
          ),
        };
      });
    },
  });

  const handleLike = (postId) => {
    mutation.mutate(postId);
  };

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-danger">Error fetching posts.</p>;

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <Navigation />
        </Col>

        <Col md={9}>
          <h2 className="mt-4 mb-4">Posts</h2>

          <PostList posts={postsResponse.data} handleLike={handleLike} />

          <PaginationControls
            currentPage={currentPage}
            totalPages={postsResponse.totalPages}
            setCurrentPage={setCurrentPage}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AllPosts;
