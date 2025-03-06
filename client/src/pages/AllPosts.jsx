import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Row, Col, FormGroup, Input, Button } from "reactstrap";
import PostList from "../components/PostList";
import PaginationControls from "../components/PaginationControls";

const fetchPosts = async ({ queryKey }) => {
  const [, page, searchTerm] = queryKey;
  const token = localStorage.getItem("token");

  const { data } = await axios.get("http://localhost:4000/api/v1/posts", {
    params: { page, limit: 5, search: searchTerm || "" },
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
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Debounced search term
  const queryClient = useQueryClient();

  // Debounce search input (delays API request)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Delay API call by 500ms

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: postsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", currentPage, debouncedSearchTerm],
    queryFn: fetchPosts,
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: likePost,
    onSuccess: (_, postId) => {
      queryClient.setQueryData(["posts", currentPage, debouncedSearchTerm], (oldData) => {
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
  if (error)
    return (
      <p className="text-center mt-4 text-danger">Error fetching posts.</p>
    );

  return (
    <Col md={9}>
      <h2 className="mt-4 mb-4">Posts</h2>

      {/* Search Bar */}
      <Row className="mb-4">
        <Col md={8}>
          <FormGroup>
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <Button
            color="primary"
            onClick={() => setDebouncedSearchTerm(searchTerm)}
          >
            Search
          </Button>
        </Col>
      </Row>

      <PostList posts={postsResponse.data} handleLike={handleLike} />

      <PaginationControls
        currentPage={currentPage}
        totalPages={postsResponse.totalPages}
        setCurrentPage={setCurrentPage}
      />
    </Col>
  );
};

export default AllPosts;
