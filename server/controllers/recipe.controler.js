const express = require('express');
const Recipe = require("mongoose").model("RecipeModel");

const router = express.Router();

export const getGlobalRecipes = async (req, res) => {
    const filters = req.query;
    const recipes = await Recipe.find();
    const filterRecipe = recipes.filter((recipe) => recipe.isGlobal === true)

    if (filterRecipe) {
        res.json({ status: 200, filterRecipe: filterRecipe });
    } else {
        res.json({ status: 404, details: 'recipes not found' })
    }
};