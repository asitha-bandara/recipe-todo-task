const express = require('express');
const router = express.Router();
const { authenticate,authorize } = require('../middleware/auth');
const recipeController = require('../controllers/recipeController');

router.post("/add-ingredient", authenticate, authorize("admin"), recipeController.addIngredient);
router.get("/get-ingredient", recipeController.getAllIngredients);
router.put("/edit-ingredient", authenticate, authorize("admin"), recipeController.editIngredients);
router.delete("/delete-ingredient", authenticate, authorize("admin"), recipeController.deleteIngredients);
router.post("/add-recipe", authenticate, authorize("admin"), recipeController.addRecipe);
router.get("/get-recipes", recipeController.getRecipes);
router.get("/:id", recipeController.getRecipe);
router.delete("/delete-recipe/:id", authenticate, authorize("admin"), recipeController.deleteRecipe);
router.get("/recipe/:id", recipeController.getRecipeById);
router.put("/edit-recipe/:id", authenticate, authorize("admin"), recipeController.editRecipe);

module.exports = router;