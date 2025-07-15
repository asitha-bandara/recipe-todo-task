import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import Logo from "../assets/logo.png";
import Background from "../assets/bg.jpg";
import Book from "../assets/cook.jpg";

function LandingPage() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Box
        bg="white"
        boxShadow="sm"
        px={8}
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="container.lg">
          <Flex align="center" justify="space-between">
            <Link
              as={RouterLink}
              to="/"
              display="flex"
              alignItems="center"
              _hover={{ textDecoration: "none" }}
              cursor="pointer"
            >
              <Image src={Logo} alt="Logo" boxSize="30px" mr={2} />
              <Heading size="md" color="teal.600" fontWeight="bold">
                Kitchen Whispers
              </Heading>
            </Link>

            <HStack spacing={6}>
              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                colorScheme="teal"
              >
                Login
              </Button>
              <Button as={RouterLink} to="/signup" colorScheme="teal">
                Sign up
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Box
        position="relative"
        bgImage={Background}
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        minH="calc(100vh - 72px)"
        display="flex"
        alignItems="center"
      >
        <Box
          bg="rgba(0, 0, 0, 0.6)"
          w="100%"
          py={16}
          px={{ base: 6, md: 12 }}
          color="white"
        >
          <Container maxW="container.lg">
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
            >
              <VStack
                spacing={6}
                maxW={{ base: "100%", md: "50%" }}
                align="start"
              >
                <Heading size="2xl" fontWeight="bold" lineHeight="shorter">
                  Dive into the World of Cooking
                </Heading>
                <Text fontSize="xl" opacity={0.85}>
                  Discover, explore, and cook your favorite meals from a vast
                  collection of recipes. Kitchen Whispers brings the knowledge to your
                  kitchen with just a few clicks.
                </Text>
              </VStack>
              <Box
                maxW={{ base: "100%", md: "45%" }}
                mt={{ base: 8, md: 0 }}
                ml={{ md: 8 }}
              >
                <Image
                  src={Book}
                  alt="Books"
                  borderRadius="md"
                  boxShadow="lg"
                  objectFit="cover"
                  w="100%"
                  h={{ base: "250px", md: "350px" }}
                />
              </Box>
            </Flex>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default LandingPage;
