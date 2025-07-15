import React from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Link as ChakraLink,
  VStack,
  Image,
} from "@chakra-ui/react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Ing from "../assets/ing.jpg";
import Recipe from "../assets/recip.avif";
import Find from "../assets/find.webp";
import Chef from "../assets/chef.jpg";

function getUserRole() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch {
    return null;
  }
}

export default function HomePage() {
  const role = getUserRole();

  const userCards = [
    {
      title: "Find Recipes",
      description: "Explore our collection of recipes and find your next meal.",
      path: "/recipes",
      imgSrc: Find,
    },
    {
      title: "View My Profile",
      description: "View your account details.",
      path: "/profile",
      imgSrc: Chef,
    },
  ];

  const adminCards = [
    {
      title: "Add Ingredients",
      description: "Add and manage ingredients used in recipes.",
      path: "/ingredient",
      imgSrc: Ing,
    },
    {
      title: "View Recipes",
      description: "Add, edit or delete recipes in the system.",
      path: "/view-recipes",
      imgSrc: Recipe,
    },
    {
      title: "Find Recipes",
      description: "Explore our collection of recipes and find your next meal.",
      path: "/recipes",
      imgSrc: Find,
    },
    {
      title: "View My Profile",
      description: "View your account details.",
      path: "/profile",
      imgSrc: Chef,
    },
  ];

  const cardsToShow = role === "admin" ? adminCards : userCards;

  return (
    <>
      <Navbar />
      <Box p={8}>
        <Heading>Welcome to the Home Page!</Heading>
        <Text mt={4} fontSize="lg" maxW="600px" mb={8}>
          You are logged in. Use the links below to navigate.
        </Text>

        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: role === "admin" ? 4 : 3 }}
          spacing={6}
        >
          {cardsToShow.map(({ title, description, path, imgSrc }) => (
            <ChakraLink
              as={Link}
              to={path}
              key={title}
              _hover={{ textDecoration: "none" }}
              height="100%"
            >
              <Box
                borderWidth="1px"
                borderRadius="md"
                p={6}
                bg="white"
                color="black"
                boxShadow="md"
                _hover={{ boxShadow: "xl", transform: "scale(1.05)" }}
                transition="all 0.2s ease-in-out"
                cursor="pointer"
                display="flex"
                flexDirection="column"
                height="100%"
                minHeight="420px"
              >
                <Image
                  src={imgSrc}
                  alt={title}
                  borderRadius="md"
                  mb={4}
                  height="300px"
                  width="100%"
                  objectFit="cover"
                />
                <VStack align="start" spacing={3} flex="1">
                  <Box
                    flex="1"
                    display="flex"
                    flexDirection="column"
                  >
                    <Heading size="md" mb={2}>
                      {title}
                    </Heading>
                    <Text>{description}</Text>
                  </Box>
                </VStack>
              </Box>
            </ChakraLink>
          ))}
        </SimpleGrid>
      </Box>
    </>
  );
}
