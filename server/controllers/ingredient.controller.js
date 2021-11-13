
const express = require('express');
const Ingredient = require("mongoose").model("ingredients");

const router = express.Router();

export const createIngredient= async (req, res) => {
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

export const getIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.findAll();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
