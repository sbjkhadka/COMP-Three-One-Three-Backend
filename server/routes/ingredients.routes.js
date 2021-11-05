const express= require('express')

const {createIngredient,getIngredients} = require("../controllers/ingredient.controller");

const router = express.Router();
router.post("/ingredient", createIngredient);
router.get("/ingredient", getIngredients);