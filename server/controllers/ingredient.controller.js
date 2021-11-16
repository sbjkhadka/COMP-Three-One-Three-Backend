const express = require('express');
const Ingredient = require('../DB/schema/ingredients')

const router = express.Router();

module.exports.createIngredient = async (req, res) => {
    const ingredients = req.body;
    console.log("create method run")
    const newIngredient = new Ingredient(ingredients);
    try {
        await newIngredient.save();
        res.status(201).json(newIngredient);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

module.exports.getIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredeint.findAll();
        return { ingredients: ingredients }
    } catch (error) {
        return { status: 404, message: 'No ingredients found' }
    }
};
