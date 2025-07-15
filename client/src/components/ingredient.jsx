import React from "react";
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
  Button,
  HStack,
  Input,
  Center,
  Spinner,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Navbar from "./navbar";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import axios from "axios";
const token = localStorage.getItem("jwtToken");

const IngredientTable = () => {
  const [loading, setLoading] = React.useState(false);
  const [ingredientList, setIngredientList] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [newIngredient, setNewIngredient] = React.useState("");
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [editIngredientName, setEditIngredientName] = React.useState("");
  const [editIngredientId, setEditIngredientId] = React.useState(null);
  const toast = useToast();

  React.useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/recipe/get-ingredient"
        );
        const formattedData = res.data.data.map((item) => ({
          id: item._id,
          name: item.name,
        }));
        setIngredientList(formattedData);
      } catch (err) {
        toast({
          title: "Failed to load ingredients",
          description: err.response?.data?.message || "Server error",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, [toast]);

  const handleAddIngredient = async () => {
    if (!newIngredient.trim()) {
      toast({
        title: "Ingredient name required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/recipe/add-ingredient",
        { ingredient: newIngredient.trim() },
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );

      const newItem = {
        id: response.data.data._id || response.data.data.id,
        name: response.data.data.name || newIngredient.trim(),
      };

      setIngredientList((prev) => [...prev, newItem]);
      setNewIngredient("");
      onAddClose();
      toast({
        title: "Ingredient added!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to add ingredient",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleEditOpen = (id) => {
    const ing = ingredientList.find((item) => item.id === id);
    if (!ing) return;
    setEditIngredientId(id);
    setEditIngredientName(ing.name);
    onEditOpen();
  };

  const handleEditSubmit = async () => {
    if (!editIngredientName.trim()) {
      toast({
        title: "Ingredient name required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/recipe/edit-ingredient",
        {
          id: editIngredientId,
          ingredient: editIngredientName.trim(),
        },
        {
          headers: {
            Authentication: `Bearer ${token}`,
          },
        }
      );

      setIngredientList((prev) =>
        prev.map((item) =>
          item.id === editIngredientId
            ? { ...item, name: response.data.data.name }
            : item
        )
      );
      onEditClose();
      toast({
        title: "Ingredient updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to update ingredient",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:5000/api/recipe/delete-ingredient", {
        data: { id },
        headers: {
          Authentication: `Bearer ${token}`,
        },
      });

      setIngredientList((prev) => prev.filter((item) => item.id !== id));

      toast({
        title: "Ingredient deleted!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete ingredient",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const columns = [
    {
      header: "Ingredient Name",
      accessorKey: "name",
      cell: (info) => <Box textAlign="center">{info.getValue()}</Box>,
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <Flex justify="center" gap={3}>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<FiEdit />}
            onClick={() => handleEditOpen(row.original.id)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            leftIcon={<FiTrash2 />}
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </Flex>
      ),
    },
  ];

  const table = useReactTable({
    data: ingredientList,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

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
      <Box maxW="container.md" mx="auto" p={6}>
        <Flex mb={4} justify="space-between" align="center">
          <Heading>Ingredients</Heading>
          <Button
            colorScheme="teal"
            size="md"
            leftIcon={<FiPlus />}
            onClick={onAddOpen}
          >
            Add Ingredient
          </Button>
        </Flex>

        <Input
          placeholder="Search ingredients..."
          mb={4}
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <TableContainer border="1px" borderColor="gray.200" borderRadius="md">
          <Table variant="simple" size="md">
            <Thead bg="green.50">
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      textAlign="center"
                      borderRight="1px solid #E2E8F0"
                      onClick={header.column.getToggleSortingHandler()}
                      cursor={
                        header.column.getCanSort() ? "pointer" : "default"
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted()
                        ? header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : " 🔽"
                        : ""}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
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
      </Box>

      <Modal isOpen={isAddOpen} onClose={onAddClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Ingredient</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Ingredient name"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleAddIngredient}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Ingredient</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Ingredient name"
              value={editIngredientName}
              onChange={(e) => setEditIngredientName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleEditSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default IngredientTable;
