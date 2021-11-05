import express from "express";
import { createIngredients} from "../controllers/ingredient.controller";
const router = express.Router();
router.post("/ingredient/", createIngredients);