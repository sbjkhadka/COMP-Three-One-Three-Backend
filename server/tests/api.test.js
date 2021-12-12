const User = require('../DB/schema/user');
const usercontroller = require('../../server/controllers/user.controller');
const ingredientcontroller = require('../../server/controllers/ingredient.controller');
const recipecontroller = require('../../server/controllers/recipe.controler');
const db = require('./db')
const mongoose = require('mongoose');

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('Test suite for Backend ', () => {

    it('user can be created correctly', async () => {
        //**Test if new user can be created/registered */
        expect(async () => await usercontroller.createUser("testfirstname", "testlastname", "email@test.com", "user", "password", "What is your favourite color", "blue"))
            .not
            .toThrow();
    });

    it("Should return meaningful error if no ingredient found", async () => {
        try {
            await ingredientcontroller.getIngredient("idthatdoesnotexist1234");
        } catch (err) {
            expect(err).toBeTruthy();
            expect(err.status).toBe(404);
            expect(err.message).toEqual("No ingredients found");
        }
    });
    it('Recipe can be deleted successfully.', async () => {
        expect(async () => await recipecontroller.deleteRecipe('6184781d533568e45cdbc19c')).not
            .toThrow();
    })
});
