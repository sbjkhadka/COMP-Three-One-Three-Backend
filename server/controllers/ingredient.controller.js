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

module.exports.getIngredient = async (ingredientId) => {
    try {
        const ingredients = await Ingredeint.find({ _id: ingredientId }).then((ing) => {
            return { ingredients: ing }
        })
    } catch (error) {
        return { status: 404, message: 'No ingredients found' }
    }
};
