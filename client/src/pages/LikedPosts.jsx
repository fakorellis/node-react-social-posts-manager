import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Container, Row, Col, Button } from "reactstrap";
import Navigation from "../components/Navigation";
import PostList from "../components/PostList";
import PaginationControls from "../components/PaginationControls";

const fetchLikedPosts = async ({ queryKey }) => {
  const [, page] = queryKey;
  const token = localStorage.getItem("token");

  const { data } = await axios.get(
    "http://localhost:4000/api/v1/users/me/liked-posts",
    {
      params: { page, limit: 5 },
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // Ensure all posts in Liked Posts page have isLiked: true
  return {
    ...data,
    data: data.data.map((post) => ({ ...post, isLiked: true })),
  };
};

const likePost = async (postId) => {
  const token = localStorage.getItem("token");

  await axios.put(
    `http://localhost:4000/api/v1/users/me/posts/${postId}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// API call to unlike all posts using DELETE
const unlikeAllPosts = async () => {
  const token = localStorage.getItem("token");

  await axios.delete("http://localhost:4000/api/v1/users/me/liked-posts", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const LikedPosts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const {
    data: postsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["likedPosts", currentPage],
    queryFn: fetchLikedPosts,
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: likePost,
    onSuccess: (_, postId) => {
      queryClient.setQueryData(["likedPosts", currentPage], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: oldData.data.filter((post) => post._id !== postId),
        };
      });
    },
  });

  const unlikeAllMutation = useMutation({
    mutationFn: unlikeAllPosts,
    onSuccess: () => {
      queryClient.setQueryData(["likedPosts", currentPage], {
        ...postsResponse,
        data: [],
      });
    },
  });

  const handleLike = (postId) => {
    mutation.mutate(postId);
  };

  const handleUnlikeAll = () => {
    if (postsResponse.data.length > 0) {
      unlikeAllMutation.mutate();
    }
  };

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-4 text-danger">Error fetching posts.</p>
    );

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <Navigation />
        </Col>

        <Col md={9}>
          <h2 className="mt-4 mb-4">Liked Posts</h2>
          {postsResponse.data.length > 0 && (
            <Button className="mb-4" color="danger" onClick={handleUnlikeAll}>
              {unlikeAllMutation.isLoading ? "Unliking..." : "Unlike All"}
            </Button>
          )}

          {postsResponse.data.length === 0 ? (
            <p className="text-center mt-4">No liked posts yet.</p>
          ) : (
            <>
              <PostList posts={postsResponse.data} handleLike={handleLike} />
              <PaginationControls
                currentPage={currentPage}
                totalPages={postsResponse.totalPages}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LikedPosts;
