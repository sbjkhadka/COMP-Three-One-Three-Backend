const express = require('express');
const router = express.Router();
const User = require('../DB/schema/user');
const Recipe = require('../DB/schema/recipeModel');
const Ingredient = require('../DB/schema/ingredients');
const jwt = require('jsonwebtoken');

router.use(express.json());

router.get('/', (req, res) => {
    res.send('Testing... testing');
});

// get recipe by id
router.get('/recipes', async (req, res) => {
    // /e.g, http://localhost:3001/api/recipes/?recipeId=6184781d533568e45cdbc19c
    const recipeId = req.query.recipeId;
    let recipe = new Recipe();
    await Recipe.findOne({ _id: recipeId }).then((recipeRes) => {
        if (recipeRes) {
            recipe = recipeRes;
        } else {
            res.json({ status: 500, details: 'Recipe not found' });
        }
    })
    let recipeItem = recipe.recipeItem;
    let ingredients = [];

    for (var i = 0; i < recipeItem.length; i++) {
        var obj = recipeItem[i];
        await Ingredient.findOne({ _id: obj.ingredients }).then((ing) => {
            if (ing) {
                ingredients.push(ing);
            }
        })
    }
    res.json({ status: 200, ingredients: ingredients, recipe: recipe });
})

router.get('/ingredients', async (req, res) => {

    const ingredients = await Ingredient.find();
    if (ingredients) {
        res.json({ status: 200, ingredients: ingredients });
    } else {
        res.json({ status: 'FAIL', details: 'Ingredients not found' })
    }
})

router.get('/allRecipes', async (req, res) => {
    const recipes = await Recipe.find();
    if (recipes) {
        res.json({ status: 200, recipes: recipes });
    } else {
        res.json({ status: 'FAIL', details: 'recipes not found' })
    }
})
router.get('/globalRecipes', async (req, res) => {

    const filters = req.query;
    const recipes = await Recipe.find();
    const filterRecipe = recipes.filter((recipe) => recipe.isGlobal === true)

    if (filterRecipe) {
        res.json({ status: 200, filterRecipe: filterRecipe });
    } else {
        res.json({ status: 'FAIL', details: 'recipes not found' })
    }
})

// route for recovering password
router.post('/resetPassword', async (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    var query = { 'email': userEmail };

    User.findOneAndUpdate(query, { $set: { password: userPassword } }, { upsert: false }, function (err, doc) {
        if (err) {
            res.json({ status: 'Failed to find user.' })
        }
        else {
            res.json({ status: 200 })
        }
    });
})

// route for getting the security question by user email
router.post('/securityQuestion', async (req, res) => {
    const userEmail = req.body.email;
    await User.findOne({ email: userEmail }).then((data) => {
        if (data) {
            res.json({ status: 'OK', securityQuestion: data.securityQuestion })
        }
        else {
            res.json({ status: 'User not found' })
        }
    })
})


// Route for registering a user
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, role, password, securityQuestion, securityAnswer } = req.body;
    let user = {};
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.role = role;
    user.password = password;
    user.securityQuestion = securityQuestion;
    user.securityAnswer = securityAnswer;

    let userModel = new User(user);
    await userModel.save()
        .then((user) => {
            res.json({ status: 'OK', user: user });
        })
        .catch(error => {
            const tempObj = { ...error };
            delete tempObj.keyValue;
            res.json({ status: 'FAIL', details: tempObj }); // handle this from the backend
        });
});

// Route for login
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    await User.findOne({ email: email })
        .then((user) => {
            if (user && user.password === password) {
                console.log('user', user);
                const successfulUser = {
                    email: user.email,
                    firstName: user.first_name,
                    last_name: user.last_name,
                    role: user.role,
                };
                const accessToken = generateAccessToken(successfulUser);
                const refreshToken = jwt.sign(successfulUser, process.env.REFRESH_TOKEN_SECRET);
                refreshTokens.push(refreshToken); // Put it in database or some file during production
                res.json({
                    status: 'OK',
                    user: successfulUser,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });
            } else {
                res.json({ status: 'FAIL', details: 'User or password is incorrect' });
            }
        })
        .catch((error) => {
            const tempObj = { ...error };
            delete tempObj.keyValue;
            console.log('err', error.message)
            res.json({ status: 'FAIL', details: tempObj }); // handle this from the backend
        });
});

// Testing route for getting list of recipees by user
router.get('/recipees', authenticateToken, (req, res) => {
    console.log('request', req);
    res.json(recipees.filter((recipee) => recipee.email === req.user.email));
});

router.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ email: user.email });
        res.json({ accessToken: accessToken });
    });
});

router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

module.exports = router;

// Middle wares and test data
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}

const recipees = [
    {
        email: 'subarna.khadka@acme.edu.np',
        title: 'subarna recipe',
    },
    {
        email: 'someoneelse@acme.edu.np',
        title: 'someoneelse recipe',
    },
];

let refreshTokens = []; // Put it in database or some file during production
