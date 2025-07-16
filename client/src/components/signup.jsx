import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
  Heading,
  Alert,
  AlertIcon,
  FormErrorMessage,
  SimpleGrid,
} from "@chakra-ui/react";

function Signup() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [nicError, setNicError] = useState("");
  const navigate = useNavigate();

  const nicRegex = /^(?:\d{9}[VXvx]|\d{12})$/;

  const validateNic = (value) => {
    if (!nicRegex.test(value)) {
      setNicError("Invalid NIC format");
    } else {
      setNicError("");
    }
  };

  useEffect(() => {
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  }, [password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (nicError) {
      setError("Please fix the errors before submitting.");
      return;
    }
    if (passwordError) {
      setError("Please fix the errors before submitting.");
      return;
    }
    if (!nic) {
      setError("NIC is required");
      return;
    }
    if (!dob) {
      setError("Date of Birth is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    axios
      .post("http://localhost:5000/api/users/add-user", {
        name,
        dob,
        nic,
        email,
        password,
      })
      .then(() => {
        navigate("/login", {
          state: { message: "Registration successful! Please login." },
        });
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Registration failed. Please try again.");
        }
        console.error(err);
      });
  };

  return (
    <Center minH="100vh" bg="gray.100" p={4}>
      <Box
        bg="white"
        p={8}
        rounded="md"
        boxShadow="md"
        width={{ base: "90%", sm: "600px" }}
      >
        <Heading mb={6} textAlign="center" size="lg">
          Sign Up
        </Heading>

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={4}
            alignItems="flex-start"
          >
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </FormControl>

            <FormControl id="dob" isRequired>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </FormControl>

            <FormControl id="nic" isRequired isInvalid={nicError !== ""}>
              <FormLabel>NIC</FormLabel>
              <Input
                type="text"
                placeholder="Enter NIC"
                value={nic}
                onChange={(e) => {
                  setNic(e.target.value);
                  validateNic(e.target.value);
                }}
                maxLength={12}
                autoComplete="off"
              />
              {nicError && <FormErrorMessage>{nicError}</FormErrorMessage>}
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <FormControl
              id="confirmPassword"
              isRequired
              isInvalid={passwordError !== ""}
            >
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {passwordError && (
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              )}
            </FormControl>
          </SimpleGrid>

          <Button colorScheme="green" type="submit" width="full" mt={6}>
            Sign Up
          </Button>
        </form>

        <Text mt={4} textAlign="center">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#3182CE", fontWeight: "bold" }}>
            Login
          </Link>
        </Text>
      </Box>
    </Center>
  );
}

export default Signup;
