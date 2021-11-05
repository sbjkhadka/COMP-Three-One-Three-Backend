
const express = require('express');
const Ingredient = require("mongoose").model("ingredient");
const router = express.Router();

export const createIngredients= async (req, res) => {
    const ingredients = req.body;
    const newIngredient = new Ingredient(ingredients);
    try {
        await newIngredient.save();
        res.status(201).json(newIngredient);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};