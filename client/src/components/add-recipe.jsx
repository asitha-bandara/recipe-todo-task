import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack,
  HStack,
  IconButton,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import axios from "axios";
import Navbar from "./navbar";

// Custom chakra-themed styles
const chakraStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderColor: state.isFocused ? "#3182ce" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 1px #3182ce" : "none",
    "&:hover": { borderColor: "#3182ce" },
    borderRadius: "6px",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "6px",
    backgroundColor: "white",
    zIndex: 5,
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#e6fffa",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#2c7a7b",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    ":hover": { backgroundColor: "#b2f5ea", color: "#2c7a7b" },
  }),
};

const animatedComponents = makeAnimated();

const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [instructions, setInstructions] = useState([""]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    async function loadIngredients() {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/recipe/get-ingredient"
        );
        setIngredients(
          res.data.data.map((i) => ({ value: i._id, label: i.name }))
        );
      } catch {
        toast({
          title: "Error loading ingredients",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
    loadIngredients();
  }, [toast]);

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !selected.length ||
      instructions.some((ins) => !ins.trim())
    ) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:5000/api/recipe/add-recipe",
        {
          title,
          ingredients: selected.map((s) => s.value),
          instructions,
        },
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Recipe added!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTitle("");
      setSelected([]);
      setInstructions([""]);
    } catch {
      toast({
        title: "Failed to add recipe",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Center mt={20}>
          <Spinner size="xl" />
        </Center>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box maxW="container.md" mx="auto" p={6}>
        <Heading mb={6}>Add New Recipe</Heading>
        <VStack spacing={5} align="stretch">
          <FormControl isRequired>
            <FormLabel>Recipe Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Select Ingredients</FormLabel>
            <Select
              closeMenuOnSelect={false}
              isMulti
              options={ingredients}
              components={animatedComponents}
              styles={chakraStyles}
              placeholder="Select ingredients..."
              value={selected}
              onChange={setSelected}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Instructions (in order)</FormLabel>
            <VStack spacing={3} align="stretch">
              {instructions.map((step, i) => (
                <HStack key={i} align="flex-start">
                  <Textarea
                    placeholder={`Step ${i + 1}`}
                    value={step}
                    onChange={(e) => {
                      const newIns = [...instructions];
                      newIns[i] = e.target.value;
                      setInstructions(newIns);
                    }}
                  />
                  {instructions.length > 1 && (
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() =>
                        setInstructions((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                      aria-label="Delete step"
                    />
                  )}
                </HStack>
              ))}
              <Button
                leftIcon={<AddIcon />}
                onClick={() => setInstructions((prev) => [...prev, ""])}
                variant="outline"
                colorScheme="green"
              >
                Add Step
              </Button>
            </VStack>
          </FormControl>

          <Button colorScheme="blue" onClick={handleSubmit}>
            Submit Recipe
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default AddRecipe;
