const db = require('./db')
const mongoose = require('mongoose');
const User = require('../DB/schema/user');
const usercontroller = require('../../server/controllers/user.controller')

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

    it('can verify user correctly', async () => {
        
    })

});
