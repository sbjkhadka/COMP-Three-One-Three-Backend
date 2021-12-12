const express = require('express');
const Recipe = require('../DB/schema/recipeModel')

const router = express.Router();

module.exports.deleteRecipe = async (recipeId) => {
    Recipe.deleteOne({ _id: recipeId }).then((response) => {
        return {
            status: 200,
            userId: response._id
        }
    })
        .catch(error => {
            throw error;
        });
}