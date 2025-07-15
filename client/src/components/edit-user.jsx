import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
  useToast,
  Stack,
  FormErrorMessage,
  SimpleGrid,
} from "@chakra-ui/react";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";

const EditUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dob: "",
    nic: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [nicError, setNicError] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

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
        const dobFormatted = data.dob
          ? new Date(data.dob).toISOString().slice(0, 10)
          : "";
        setFormData((prev) => ({
          ...prev,
          username: data.username || "",
          email: data.email || "",
          dob: dobFormatted,
          nic: data.nic || "",
        }));
      })
      .catch((err) => setError(err.message || "Failed to fetch user data"))
      .finally(() => setLoading(false));
  }, []);

  const validatePasswords = (data) => {
    const errors = {};
    const { oldPassword, newPassword, confirmPassword } = data;

    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword) {
        errors.oldPassword = "Please enter your existing password";
      }
      if (!newPassword) {
        errors.newPassword = "Please enter a new password";
      } else if (newPassword.length < 8) {
        errors.newPassword = "Password should be at least 8 characters";
      } else if (newPassword.length > 20) {
        errors.newPassword = "Password should not exceed 20 characters";
      }
      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your new password";
      } else if (newPassword !== confirmPassword) {
        errors.confirmPassword = "New passwords do not match";
      }
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    if (name === "nic") {
      const nicRegex = /^(?:\d{9}[VXvx]|\d{12})$/;
      if (!nicRegex.test(value)) {
        setNicError("Invalid NIC format");
      } else {
        setNicError("");
      }
    }

    setFormData(updatedFormData);

    if (
      name === "oldPassword" ||
      name === "newPassword" ||
      name === "confirmPassword"
    ) {
      const errors = validatePasswords(updatedFormData);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const pwErrors = validatePasswords(formData);
    if (Object.keys(pwErrors).length > 0) {
      setPasswordErrors(pwErrors);
      return;
    }

    setSaving(true);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("No token found, please login.");
      setSaving(false);
      return;
    }

    let decoded = jwtDecode(token);
    const userId = decoded.userId;

    const payload = {
      username: formData.username,
      email: formData.email,
      dob: formData.dob,
      nic: formData.nic,
    };

    if (formData.oldPassword && formData.newPassword) {
      payload.oldPassword = formData.oldPassword;
      payload.newPassword = formData.newPassword;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to update user data");
      }

      toast({
        title: "Profile updated.",
        status: "success",
        duration: 1500,
      });

      navigate("/profile");
    } catch (err) {
      try {
        const parsed = JSON.parse(err.message);
        setError(parsed.message || "An unexpected error occurred");
      } catch {
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <>
      <Navbar />
      <Flex justify="center" p={8} bg="gray.50" minH="90vh">
        <Box
          maxW="700px"
          w="full"
          bg="white"
          boxShadow="md"
          rounded="lg"
          p={6}
          as="form"
          onSubmit={handleSubmit}
        >
          {error && (
            <Box
              mb={4}
              p={4}
              bg="red.50"
              border="1px solid"
              borderColor="red.300"
              rounded="md"
            >
              <Text color="red.600" fontWeight="medium">
                {error}
              </Text>
            </Box>
          )}

          <SimpleGrid columns={2} spacing={6} mb={6}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired isInvalid={nicError !== ""}>
              <FormLabel>NIC</FormLabel>
              <Input name="nic" value={formData.nic} onChange={handleChange} />
              {nicError && <FormErrorMessage>{nicError}</FormErrorMessage>}
            </FormControl>
          </SimpleGrid>

          <Box borderTop="1px" borderColor="gray.200" pt={6}>
            <Text fontWeight="bold" mb={4}>
              Change Password
            </Text>

            <SimpleGrid columns={2} spacing={6}>
              <FormControl
                isInvalid={!!passwordErrors.oldPassword}
                isRequired={formData.newPassword || formData.confirmPassword}
              >
                <FormLabel>Existing Password</FormLabel>
                <Input
                  name="oldPassword"
                  type="password"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />
                <FormErrorMessage>
                  {passwordErrors.oldPassword}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!passwordErrors.newPassword}
                isRequired={formData.oldPassword}
              >
                <FormLabel>New Password</FormLabel>
                <Input
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <FormErrorMessage>
                  {passwordErrors.newPassword}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={!!passwordErrors.confirmPassword}
                isRequired={formData.oldPassword}
                gridColumn={{ base: "span 2", md: "auto" }}
              >
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <FormErrorMessage>
                  {passwordErrors.confirmPassword}
                </FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </Box>

          <Stack direction="row" spacing={4} justify="center" mt={8}>
            <Button
              colorScheme="teal"
              type="submit"
              isLoading={saving}
              loadingText="Saving"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
              isDisabled={saving}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default EditUser;
