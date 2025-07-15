import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Button,
  Link as ChakraLink,
  Image,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { jwtDecode } from "jwt-decode";

const Links = [{ name: "Home", path: "/home" }];

function NavLink({ to, children }) {
  return (
    <ChakraLink
      as={Link}
      to={to}
      px={3}
      py={2}
      rounded="md"
      _hover={{ textDecoration: "none", bg: "gray.200" }}
      color="inherit"
      fontWeight="medium"
    >
      {children}
    </ChakraLink>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [nameerror, setNameError] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setNameError("No token found.");
      return;
    }
    const decoded = jwtDecode(token);
    const userId = decoded.userId;
    fetch(`http://localhost:5000/api/users/${userId}/user-name`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errMsg = await res.text();
          throw new Error(errMsg || "Failed to fetch user name");
        }
        return res.json();
      })
      .then((data) => {
        setUserName(data.username);
      })
      .catch(() => {
        setNameError("Failed to fetch user name");
        setUserName("");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <Box bg="teal.500" color="white" px={4}>
      <Flex h={16} align="center" justify="space-between">
        <HStack spacing={8} align="center">
          <HStack spacing={3} align="center">
            <Image
              src={Logo}
              alt="BookNest Logo"
              boxSize="40px"
              objectFit="contain"
            />
            <Box fontWeight="bold" fontSize="lg" userSelect="none">
              BookNest
            </Box>
          </HStack>
          <HStack
            as="nav"
            spacing={4}
            display={{ base: "none", md: "flex" }}
            fontWeight="medium"
          >
            {Links.map(({ name, path }) => (
              <NavLink key={name} to={path}>
                {name}
              </NavLink>
            ))}
          </HStack>
        </HStack>

        <Flex align="center">
          {userName && !nameerror && (
            <Text fontWeight="semibold" fontSize="md" userSelect="none" mr={2}>
              Welcome, {userName}
            </Text>
          )}
          {nameerror && (
            <Text fontWeight="semibold" fontSize="sm" color="red.200" mr={2}>
              {nameerror}
            </Text>
          )}
          <Button
            colorScheme="red"
            size="sm"
            onClick={handleLogout}
            _hover={{ bg: "red.600" }}
          >
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
