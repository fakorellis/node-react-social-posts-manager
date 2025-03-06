import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import axios from "axios";

const createPost = async (postData) => {
  const token = localStorage.getItem("token");

  const { data } = await axios.post(
    "http://localhost:4000/api/v1/posts",
    postData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return data;
};

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setTitle("");
      setBody("");
      setSuccess(true);
      setError(null);
      queryClient.invalidateQueries(["posts"]); // Refresh posts list
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to create post.");
      setSuccess(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !body) {
      setError("Title and Body are required.");
      return;
    }

    mutation.mutate({ title, body });
  };

  return (
    <Col md={6}>
      <h2 className="mt-4 mb-4">Create a New Post</h2>

      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">Post created successfully!</Alert>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="body">Body</Label>
          <Input
            type="textarea"
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Creating..." : "Create Post"}
        </Button>
      </Form>
    </Col>
  );
};

export default CreatePost;
