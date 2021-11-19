const db = require('./db')
const mongoose = require('mongoose');
const User = require('../DB/schema/user');
const usercontroller = require('../../server/controllers/user.controller');
const ingredientcontroller = require('../../server/controllers/ingredient.controller');
beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('First test suite for Backend ', () => {

    it('user can be created correctly', async () => {
        //**Test if new user can be created/registered */
        expect(async () => await usercontroller.createUser("testfirstname", "testlastname", "email@test.com", "user", "password", "What is your favourite color", "blue"))
            .not
            .toThrow();
    });

    it("Should return error if no ingredient found", async () => {
        try {
            await ingredientcontroller.getIngredients("idthatdoesnotexist1234");
        } catch (err) {
            expect(err).toBeTruthy();
            console.log('meessage,', err);
            expect(err.status).toBe(404);
            expect(err.message).toEqual("No ingredients found");
        }
    });
});
