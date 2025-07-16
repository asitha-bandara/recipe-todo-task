import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  VStack,
  Checkbox,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Progress,
  HStack,
  Icon,
  Circle,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { InfoOutlineIcon, CheckIcon } from "@chakra-ui/icons";
import axios from "axios";
import Navbar from "./navbar";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [checkedSteps, setCheckedSteps] = useState({});

  const bgGradient = useColorModeValue(
    "linear(to-br, rgba(56, 178, 172, 0.15), rgba(255, 255, 255, 0.15))",
    "linear(to-br, rgba(56, 178, 172, 0.1), rgba(26, 32, 44, 0.15))"
  );
  const bgBox = useColorModeValue("white", "gray.700");
  const borderIngredients = useColorModeValue("teal.300", "teal.600");
  const borderSteps = useColorModeValue("gray.300", "gray.600");
  const ingredientBadgeColor = useColorModeValue("teal.600", "teal.300");
  const ingredientBadgeCheckedBg = useColorModeValue("teal.500", "teal.700");
  const ingredientBadgeUncheckedBg = useColorModeValue("teal.100", "teal.900");
  const stepsCheckedBg = useColorModeValue("teal.100", "gray.600");
  const stepsUncheckedBg = useColorModeValue("gray.50", "gray.700");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const stepCircleCheckedBg = useColorModeValue("teal.500", "teal.700");
  const stepCircleUncheckedBg = useColorModeValue("gray.400", "gray.500");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipe/${id}`);
        setRecipe(res.data.data);

        const initialIngredients = {};
        res.data.data.ingredients.forEach((ing) => {
          initialIngredients[ing._id] = false;
        });
        setCheckedIngredients(initialIngredients);

        const initialSteps = {};
        res.data.data.instructions.forEach((_, idx) => {
          initialSteps[idx] = false;
        });
        setCheckedSteps(initialSteps);
      } catch (err) {
        console.error("Error fetching recipe", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Center mt="20" minH="70vh">
          <Spinner size="xl" thickness="4px" speed="0.75s" color="teal.400" />
        </Center>
      </>
    );
  }

  if (!recipe) {
    return (
      <>
        <Navbar />
        <Center mt="20" minH="70vh">
          <Text fontSize="lg" color="red.500" fontWeight="semibold">
            Recipe not found.
          </Text>
        </Center>
      </>
    );
  }

  const allIngredientsChecked =
    Object.values(checkedIngredients).every(Boolean);
  const allStepsChecked = Object.values(checkedSteps).every(Boolean);

  const toggleIngredient = (id) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStep = (idx) => {
    setCheckedSteps((prev) => {
      const newChecked = { ...prev };
      if (newChecked[idx]) {
        for (let i = idx; i < Object.keys(newChecked).length; i++) {
          newChecked[i] = false;
        }
      } else {
        newChecked[idx] = true;
      }
      return newChecked;
    });
  };

  const totalIngredients = recipe.ingredients.length;
  const checkedIngredientsCount =
    Object.values(checkedIngredients).filter(Boolean).length;

  const totalSteps = recipe.instructions.length;
  const checkedStepsCount = Object.values(checkedSteps).filter(Boolean).length;

  return (
    <>
      <Navbar />
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        zIndex={-1}
        bgGradient={bgGradient}
        opacity={0.3}
      />
      <Box
        maxW="container.md"
        mx="auto"
        p={6}
        bg={bgBox}
        borderRadius="lg"
        boxShadow="2xl"
        mt={8}
        mb={12}
      >
        <Box textAlign="center" mb={6} px={4}>
          <Heading
            fontSize="2xl"
            mb={1}
            color={headingColor}
            fontWeight="extrabold"
            letterSpacing="wide"
          >
            {recipe.title}
          </Heading>
          <Text fontSize="sm" color="gray.500" maxW="600px" mx="auto" mb={3}>
            {recipe.description}
          </Text>
          <Progress
            value={(checkedIngredientsCount / totalIngredients) * 100}
            size="sm"
            colorScheme="teal"
            borderRadius="lg"
            mb={1}
          />
          <Text
            fontWeight="semibold"
            color={ingredientBadgeColor}
            fontSize="xs"
          >
            Ingredients progress: {checkedIngredientsCount} / {totalIngredients}
          </Text>
        </Box>

        <Box
          p={5}
          mb={8}
          border="1px solid"
          borderColor={borderIngredients}
          borderRadius="md"
          boxShadow="md"
        >
          <HStack mb={4} spacing={2} align="center">
            <Icon as={InfoOutlineIcon} boxSize={5} color="teal.500" />
            <Heading size="md" color="teal.600">
              Check off your Ingredients
            </Heading>
          </HStack>
          <Flex wrap="wrap" gap={3} justify="center">
            {recipe.ingredients.map((ing) => {
              const isChecked = checkedIngredients[ing._id];
              return (
                <Badge
                  key={ing._id}
                  cursor="pointer"
                  px={3}
                  py={1}
                  borderRadius="full"
                  boxShadow={isChecked ? "md" : "sm"}
                  color={isChecked ? "white" : ingredientBadgeColor}
                  bg={
                    isChecked
                      ? ingredientBadgeCheckedBg
                      : ingredientBadgeUncheckedBg
                  }
                  fontWeight="bold"
                  fontSize="xs"
                  userSelect="none"
                  transition="all 0.25s ease"
                  _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
                  onClick={() => toggleIngredient(ing._id)}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  {isChecked && <CheckIcon />}
                  {ing.name}
                </Badge>
              );
            })}
          </Flex>
        </Box>

        <Box
          p={5}
          border="1px solid"
          borderColor={borderSteps}
          borderRadius="md"
          boxShadow="md"
          opacity={allIngredientsChecked ? 1 : 0.3}
          pointerEvents={allIngredientsChecked ? "auto" : "none"}
          transition="opacity 0.3s ease"
          mb={8}
        >
          <HStack mb={4} spacing={2} align="center">
            <Icon
              as={InfoOutlineIcon}
              boxSize={5}
              color={allIngredientsChecked ? "teal.600" : "gray.400"}
            />
            <Heading
              size="md"
              color={allIngredientsChecked ? "teal.600" : "gray.400"}
            >
              Follow the Steps
            </Heading>
          </HStack>
          <Progress
            value={(checkedStepsCount / totalSteps) * 100}
            size="sm"
            colorScheme="teal"
            borderRadius="lg"
            mb={4}
          />
          <Text
            fontWeight="semibold"
            color={ingredientBadgeColor}
            fontSize="xs"
            mb={4}
            textAlign="center"
          >
            Steps progress: {checkedStepsCount} / {totalSteps}
          </Text>
          <VStack spacing={3} align="stretch">
            {recipe.instructions.map((step, idx) => {
              const isChecked = checkedSteps[idx];
              const prevStepChecked = idx === 0 ? true : checkedSteps[idx - 1];

              return (
                <HStack
                  key={idx}
                  bg={isChecked ? stepsCheckedBg : stepsUncheckedBg}
                  p={3}
                  borderRadius="md"
                  boxShadow={isChecked ? "md" : "sm"}
                  transition="all 0.25s ease"
                  cursor={prevStepChecked ? "pointer" : "not-allowed"}
                  onClick={() => prevStepChecked && toggleStep(idx)}
                  userSelect="none"
                >
                  <Circle
                    size="20px"
                    bg={isChecked ? stepCircleCheckedBg : stepCircleUncheckedBg}
                    color="white"
                    fontWeight="bold"
                    userSelect="none"
                  >
                    {idx + 1}
                  </Circle>
                  <Checkbox
                    isChecked={isChecked}
                    colorScheme="teal"
                    size="sm"
                    flex="1"
                    fontWeight="medium"
                    isDisabled={!prevStepChecked}
                    pointerEvents="none"
                  >
                    <Text fontSize="xs">{step}</Text>
                  </Checkbox>
                </HStack>
              );
            })}
          </VStack>
        </Box>

        {allStepsChecked && (
          <Alert
            status="success"
            borderRadius="md"
            boxShadow="lg"
            fontSize="md"
            textAlign="center"
            justifyContent="center"
            py={4}
            px={6}
            mb={8}
          >
            <AlertIcon boxSize={8} mr={4} />
            <Box>
              <AlertTitle fontSize="md">Congratulations!</AlertTitle>
              <AlertDescription fontSize="sm">
                You&apos;ve completed all the steps for this recipe! Enjoy your
                meal! 🎉
              </AlertDescription>
            </Box>
          </Alert>
        )}
      </Box>
    </>
  );
};

export default RecipeDetail;
