const express = require("express");
const Ingredient = require("../models/ingredient");
const Recipe = require("../models/recipes");
const router = express.Router();
const jwt = require("jsonwebtoken");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.addIngredient = async (req, res) => {
  try {
    const { ingredient } = req.body;

    if (!ingredient || ingredient.trim() === "") {
      return res.status(400).json({
        status: "failed",
        message: "Ingredient name is required",
      });
    }

    const ing = new Ingredient({ name: ingredient.trim() });

    await ing.save();

    res.status(200).json({
      status: "success",
      data: {
        _id: ing._id,
        name: ing.name,
      },
    });
  } catch (err) {
    let errorMessage;
    let statusCode = 500;

    if (err.code === 11000) {
      errorMessage = "Ingredient already exists";
      statusCode = 409;
    } else if (err.name === "ValidationError") {
      errorMessage = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
    } else {
      errorMessage = err.message;
    }
    res.status(statusCode).json({
      status: "failed",
      message: errorMessage,
    });
  }
};

exports.getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.status(200).json({
      status: "success",
      data: ingredients,
    });
  } catch (err) {
    console.error("Error fetching ingredients:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch ingredients",
    });
  }
};

exports.editIngredients = async (req, res) => {
  try {
    const { id, ingredient } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        message: "Ingredient ID is required",
      });
    }

    if (!ingredient || ingredient.trim() === "") {
      return res.status(400).json({
        status: "failed",
        message: "Ingredient name is required",
      });
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      { name: ingredient.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({
        status: "failed",
        message: "Ingredient not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedIngredient,
    });
  } catch (err) {
    let errorMessage;
    let statusCode = 500;

    if (err.code === 11000) {
      errorMessage = "Ingredient already exists";
      statusCode = 409;
    } else if (err.name === "ValidationError") {
      errorMessage = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
    } else {
      errorMessage = err.message;
    }

    res.status(statusCode).json({
      status: "failed",
      message: errorMessage,
    });
  }
};

exports.deleteIngredients = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        message: "Ingredient ID is required",
      });
    }

    const deletedIngredient = await Ingredient.findByIdAndDelete(id);

    if (!deletedIngredient) {
      return res.status(404).json({
        status: "failed",
        message: "Ingredient not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Ingredient deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;

    if (
      !title?.trim() ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0 ||
      !Array.isArray(instructions) ||
      instructions.length === 0 ||
      instructions.some((step) => !step.trim())
    ) {
      return res.status(400).json({
        message: "All fields are required and must be valid.",
      });
    }

    const foundIngredients = await Ingredient.find({
      _id: { $in: ingredients },
    });

    if (foundIngredients.length !== ingredients.length) {
      return res.status(400).json({
        message: "Some ingredients not found.",
      });
    }

    const newRecipe = new Recipe({
      title: title.trim(),
      ingredients,
      instructions: instructions.map((step) => step.trim()),
    });

    await newRecipe.save();

    res.status(201).json({
      message: "Recipe added successfully!",
      data: newRecipe,
    });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({
      message: "Server error. Could not add recipe.",
    });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const recipe = await Recipe.find().populate("ingredients", "name");
    res.status(200).json({
      status: "success",
      data: recipe,
    });
  } catch (err) {
    console.error("Error fetching recipes:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch recipes",
    });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate("ingredients");

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ success: true, data: recipe });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        message: "Recipe ID is required",
      });
    }

    const deleteRecipe = await Recipe.findByIdAndDelete(id);

    if (!deleteRecipe) {
      return res.status(404).json({
        status: "failed",
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Recipe deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid recipe ID format",
      });
    }

    const recipe = await Recipe.findById(id).populate(
      "ingredients",
      "name",
      "instructions"
    );

    if (!recipe) {
      return res.status(404).json({
        status: "failed",
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: recipe,
    });
  } catch (error) {
    console.error("Error fetching recipe by ID:", error.message);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

exports.editRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, instructions } = req.body;

    if (
      !id ||
      !title?.trim() ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0 ||
      !Array.isArray(instructions) ||
      instructions.length === 0 ||
      instructions.some((step) => !step.trim())
    ) {
      return res.status(400).json({
        message: "All fields are required and must be valid.",
      });
    }

    const foundIngredients = await Ingredient.find({
      _id: { $in: ingredients },
    });

    if (foundIngredients.length !== ingredients.length) {
      return res.status(400).json({
        message: "Some ingredients not found.",
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        ingredients,
        instructions: instructions.map((step) => step.trim()),
      },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({
        message: "Recipe not found.",
      });
    }

    res.status(200).json({
      message: "Recipe updated successfully!",
      data: updatedRecipe,
    });
  } catch (error) {
    console.error("Error editing recipe:", error);
    res.status(500).json({
      message: "Server error. Could not update recipe.",
    });
  }
};
