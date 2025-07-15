import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Center,
  Spinner,
  HStack,
  Button,
  Input,
  Select,
  Wrap,
  WrapItem,
  Badge,
} from "@chakra-ui/react";
import Navbar from "./navbar";
import axios from "axios";
import ReactSelect from "react-select";
import { useNavigate } from "react-router-dom";

import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const computeDifficulty = (stepsCount) => {
  if (stepsCount <= 3) return "Easy";
  if (stepsCount <= 6) return "Medium";
  return "Hard";
};

const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [titleFilter, setTitleFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    const fetchRecipesAndIngredients = async () => {
      try {
        const [recipeRes, ingredientRes] = await Promise.all([
          axios.get("http://localhost:5000/api/recipe/get-recipes"),
          axios.get("http://localhost:5000/api/recipe/get-ingredient"),
        ]);

        const enrichedRecipes = (recipeRes.data.data || []).map((recipe) => ({
          ...recipe,
          difficulty: computeDifficulty(recipe.instructions.length),
        }));

        setRecipes(enrichedRecipes);

        const formattedIngredients = (ingredientRes.data.data || []).map(
          (ing) => ({
            label: ing.name,
            value: ing._id,
          })
        );
        setIngredientsList(formattedIngredients);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipesAndIngredients();
  }, []);

  const columns = [
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => (
        <Text fontWeight="bold" textAlign="center">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor("ingredients", {
      header: "Ingredients",
      cell: (info) => (
        <Wrap justify="center">
          {info.getValue().map((ing) => (
            <WrapItem key={ing._id}>
              <Badge
                px={3}
                py={1}
                borderRadius="md"
                bg="teal.100"
                color="teal.800"
              >
                {ing.name}
              </Badge>
            </WrapItem>
          ))}
        </Wrap>
      ),
    }),
    columnHelper.accessor("difficulty", {
      header: "Difficulty",
      cell: (info) => (
        <Text textAlign="center" fontWeight="semibold">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          colorScheme="teal"
          size="sm"
          onClick={() => navigate(`/recipes/${row.original._id}`)}
        >
          Make Recipe
        </Button>
      ),
    }),
  ];

  // Filter functions
  const filterByTitle = (row, columnId, filterValue) => {
    if (!filterValue) return true;
    return row
      .getValue(columnId)
      .toLowerCase()
      .includes(filterValue.toLowerCase());
  };

  const filterByDifficulty = (row, columnId, filterValue) => {
    if (!filterValue) return true;
    return row.getValue(columnId) === filterValue;
  };

  const filterBySelectedIngredients = (row) => {
    if (selectedIngredients.length === 0) return true;

    const ingredientIdsInRow = row.original.ingredients.map((ing) => ing._id);
    const selectedIds = selectedIngredients.map((ing) => ing.value);

    return selectedIds.every((id) => ingredientIdsInRow.includes(id));
  };

  const table = useReactTable({
    data: recipes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      title: filterByTitle,
      difficulty: filterByDifficulty,
    },
    globalFilterFn: () => true,
  });

  const filteredRows = table
    .getRowModel()
    .rows.filter(filterBySelectedIngredients);

  const handleClearFilters = () => {
    setTitleFilter("");
    setDifficultyFilter("");
    setSelectedIngredients([]);
    table.setColumnFilters([]);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Center mt="20">
          <Spinner size="xl" />
        </Center>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box maxW="container.lg" mx="auto" p={6}>
        <Heading mb={6} textAlign="center">
          Find Recipes
        </Heading>

        <HStack spacing={4} mb={4} justify="center" flexWrap="wrap">
          <Input
            placeholder="Filter by recipe title"
            value={titleFilter}
            onChange={(e) => {
              setTitleFilter(e.target.value);
              table.setColumnFilters((prev) => [
                ...prev.filter((f) => f.id !== "title"),
                { id: "title", value: e.target.value },
              ]);
            }}
            maxW="250px"
          />
          <Select
            placeholder="Filter by difficulty"
            value={difficultyFilter}
            onChange={(e) => {
              setDifficultyFilter(e.target.value);
              table.setColumnFilters((prev) => [
                ...prev.filter((f) => f.id !== "difficulty"),
                { id: "difficulty", value: e.target.value },
              ]);
            }}
            maxW="180px"
            variant="filled"
            focusBorderColor="teal.400"
            bg="white"
            _hover={{ bg: "gray.50" }}
            _focus={{ bg: "white" }}
            borderRadius="md"
            shadow="sm"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </Select>
          <Box minW="250px">
            <ReactSelect
              isMulti
              closeMenuOnSelect={false}
              options={ingredientsList}
              placeholder="Filter by ingredients"
              value={selectedIngredients}
              onChange={(selected) => setSelectedIngredients(selected || [])}
            />
          </Box>
          <Button onClick={handleClearFilters} variant="outline">
            Clear Filters
          </Button>
        </HStack>

        {filteredRows.length === 0 ? (
          <Text textAlign="center">No matching recipes found.</Text>
        ) : (
          <TableContainer border="1px" borderColor="gray.200" borderRadius="md">
            <Table variant="simple" size="md">
              <Thead bg="teal.50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th key={header.id} textAlign="center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {filteredRows.map((row) => (
                  <Tr key={row.id} _hover={{ bg: "gray.100" }}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id} textAlign="center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {filteredRows.length > 0 && (
          <HStack mt={4} justify="space-between">
            <Button
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </HStack>
        )}
      </Box>
    </>
  );
};

export default Recipes;
