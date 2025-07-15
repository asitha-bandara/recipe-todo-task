import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Avatar,
  Heading,
  Text,
  Stack,
  Button,
  Flex,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";

const ProfileView = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("No token found, please login.");
      setLoading(false);
      return;
    }
    let decoded = jwtDecode(token);
    const userId = decoded.userId;
    if (!userId) {
      setError("User ID not found in token.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errMsg = await res.text();
          throw new Error(errMsg || "Failed to fetch user data");
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch user data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <Flex justify="center" align="center" minH="100vh">
          <Spinner size="xl" />
        </Flex>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Flex justify="center" align="center" minH="100vh" bg="gray.50">
          <Box p={6} bg="white" rounded="md" shadow="md" textAlign="center">
            <Text fontSize="xl" mb={4} color="red.500">
              {error}
            </Text>
            <Button colorScheme="teal">Go to Login</Button>
          </Box>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Flex justify="center" p={8} bg="gray.50" minH="90vh">
        <Box
          maxW="600px"
          w="full"
          bg="white"
          boxShadow="md"
          rounded="lg"
          p={6}
          textAlign="center"
        >
          <Avatar size="xl" name={userData.username} mb={8} />
          <Heading fontSize="2xl" fontWeight={600} mb={8}>
            {userData.username}
          </Heading>
          <Text fontSize="md" color="gray.600" mb={8}>
            Role :{" "}
            {userData.role
              ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
              : "N/A"}
          </Text>
          <Text fontSize="md" color="gray.600" mb={8}>
            Email : {userData.email}
          </Text>
          <Text fontSize="md" color="gray.600" mb={8}>
            Date of Birth :{" "}
            {userData.dob
              ? new Date(userData.dob).toLocaleDateString("en-CA")
              : "N/A"}
          </Text>
          <Text fontSize="md" color="gray.600" mb={10}>
            NIC : {userData.nic}
          </Text>
          <Divider mb={10} />
          <Stack direction="row" spacing={4} justify="center">
            <Button colorScheme="teal" variant="solid">
              <Link to="/edit-user" _hover={{ textDecoration: "none" }}>
                Edit Profile
              </Link>
            </Button>
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default ProfileView;
