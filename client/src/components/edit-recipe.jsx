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
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./navbar";

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

const EditRecipe = () => {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [instructions, setInstructions] = useState([""]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingredientRes, recipeRes] = await Promise.all([
          axios.get("http://localhost:5000/api/recipe/get-ingredient"),
          axios.get(`http://localhost:5000/api/recipe/${id}`),
        ]);

        const ingOptions = ingredientRes.data.data.map((i) => ({
          value: i._id,
          label: i.name,
        }));
        setIngredients(ingOptions);

        const recipe = recipeRes.data.data;
        setTitle(recipe.title);
        setSelected(
          recipe.ingredients.map((i) => ({
            value: i._id,
            label: i.name,
          }))
        );
        setInstructions(recipe.instructions);
      } catch {
        toast({
          title: "Failed to load recipe",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handleUpdate = async () => {
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
      await axios.put(
        `http://localhost:5000/api/recipe/edit-recipe/${id}`,
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
        title: "Recipe updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/view-recipes");
    } catch {
      toast({
        title: "Failed to update recipe",
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
        <Heading mb={6}>Edit Recipe</Heading>
        <VStack spacing={5} align="stretch">
          <FormControl isRequired>
            <FormLabel>Recipe Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Recipe Title"
            />
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

          <Button colorScheme="blue" onClick={handleUpdate}>
            Update Recipe
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default EditRecipe;
