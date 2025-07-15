import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Heading,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const location = useLocation();
  const successMessage = location.state?.message || "";
  const [success, setSuccess] = useState(successMessage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    try {
      await axios
        .post("http://localhost:5000/api/login/login-user", formData)
        .then((res) => {
          localStorage.setItem("jwtToken", res.data.token);

          const decodedToken = jwtDecode(res.data.token);
          const userRole = decodedToken.role;

          setError("");

          switch (userRole) {
            case "admin":
              navigate("/home");
              break;
            case "user":
              navigate("/home");
              break;
            default:
              console.error("Unknown role");
              setError("Invalid role");
          }
        });
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <Center minH="100vh" bg="gray.100" p={4}>
      <Box
        bg="white"
        p={8}
        rounded="md"
        boxShadow="md"
        width={{ base: "90%", sm: "400px" }}
      >
        <Heading mb={6} textAlign="center" size="lg">
          Login
        </Heading>
        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        {success && (
          <Alert status="success" mb={4}>
            <AlertIcon />
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FormControl>

            <Button colorScheme="blue" type="submit" width="full" mt={4}>
              Login
            </Button>
          </VStack>
        </form>
        <Text mt={4} textAlign="center">
          Don&apos;t have an account?{" "}
          <Link to="/signup" style={{ color: "#3182CE", fontWeight: "bold" }}>
            Sign Up
          </Link>
        </Text>
      </Box>
    </Center>
  );
}

export default Login;
