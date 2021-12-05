const express = require('express');
const router = express.Router();
const User = require('../DB/schema/user');
const Recipe = require('../DB/schema/recipeModel');
const Ingredient = require('../DB/schema/ingredients');
const Feedback = require('../DB/schema/feedback');
const jwt = require('jsonwebtoken');

router.use(express.json());

// get recipe by id
router.get('/recipes', async (req, res) => {
    // /e.g, http://localhost:3001/api/recipes/?recipeId=6184781d533568e45cdbc19c
    const recipeId = req.query.recipeId;
    let recipe;
    await Recipe.findOne({ _id: recipeId }).then((recipeRes) => {
        if (recipeRes) {
            recipe = recipeRes;
        } else {
            res.json({ status: 404, details: 'Recipe not found' });
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
/**
 * @swagger
 * /api/users:
 *  get:
 *    description: Get all  users
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/users', async (req, res) => {

    const users = await User.find();
    if (users) {
        res.json({ status: 200, users: users });
    } else {
        res.json({ status: 404, details: 'User not found' })
    }
})

router.delete('/users', async (req, res) => {
    // e.g., http://localhost:3001/api/users/?userEmail=test@deelete.com
    const userEmail = req.query.userEmail;
    
    User.deleteOne({ email: userEmail }, function (err) {
        if (!err) {
            res.json({ status: 200 })
        }
        else {
            res.json({ status: 404 })
        }
    });
})
/**
 * @swagger
 * /api/ingredients:
 *  get:
 *    description: Get all  ingredients
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/ingredients', async (req, res) => {

    const ingredients = await Ingredient.find();
    if (ingredients) {
        res.json({ status: 200, ingredients: ingredients });
    } else {
        res.json({ status: 404, details: 'Ingredients not found' })
    }
})
// Get all ingredient by user ID
router.get('/ingredientsByUserId', async (req, res) => {
    // /e.g, http://localhost:3001/api/ingredientsByUserId/?userId=61847622533568e45cdbc197
    const userId = req.query.userId;
    let ingredients = []
    await Ingredient.find({ userId: userId }).then((ingredientRes) => {
        if (ingredientRes) {
            ingredients.push(ingredientRes);
            res.json({ status: 200, recipes: ingredients });
        }
        else {
            res.json({ status: 404, details: 'Ingredient not found' });
        }
    })
})

//Get all ingredient by user Email
router.get('/ingredientsByUserEmail', async (req, res) => {
    //e.g, http://localhost:3001/api/ingredientsByUserEmail/?userEmail=61847622533568e45cdbc197
    const userEmail = req.query.userEmail;
    let ingredients = []
    await Ingredient.find({ userEmail: userEmail }).then((ingredientRes) => {
        if (ingredientRes) {
            ingredients.push(ingredientRes);
            res.json({ status: 200, ingredients: ingredients });
        }
        else {
            res.json({ status: 404, details: 'Ingredient not found' });
        }
    })
})

//API : get recipe by user email e.g, http://localhost:3001/api/userRecipes/?email=ty6@gmail.com
router.get('/userRecipes', async (req, res) => {
    const email = req.query.email;
    console.log(email)
    let recipes = []
    await Recipe.find({ userEmail: email }).then((recipeRes) => {
        if (recipeRes) {
            recipes.push(recipeRes);
            res.json({ status: 200, recipes: recipes });
        }
        else {
            res.json({ status: 404, details: 'user not found' });
        }
    })
})
/**
 * @swagger
 * /api/allRecipes:
 *  get:
 *    description: Get all  recipes
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/allRecipes', async (req, res) => {
    const recipes = await Recipe.find();
    if (recipes) {
        res.json({ status: 200, recipes: recipes });
    } else {
        res.json({ status: 404, details: 'recipes not found' })
    }
})
/**
 * @swagger
 * /api/globalRecipes:
 *  get:
 *    description: Get global recipes
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/globalRecipes', async (req, res) => {
    const filters = req.query;
    const recipes = await Recipe.find();
    const filterRecipe = recipes.filter((recipe) => recipe.isPrivate === false)

    if (filterRecipe) {
        res.json({ status: 200, filterRecipe: filterRecipe });
    } else {
        res.json({ status: 404, details: 'recipes not found' })
    }
})

// get ingredient by id
router.get('/ingredient', async (req, res) => {
    // /e.g, http://localhost:3001/api/ingredient/?ingredientId=6184750a533568e45cdbc195
    const ingredientId = req.query.ingredientId;
    const ing = await Ingredient.findOne({ _id: ingredientId });
    if (ing) {
        res.json({ status: 200, ingredient: ing });
    }
    else {
        res.json({ status: 500, details: 'No ingredient found' })
    }
})
//Get ingredient by name
router.get('/ingredientByName', async (req, res) => {
    // /e.g, http://localhost:3001/api/ingredientByName/?ingredientName=Hawaiian Pizza
    const ingredientName = req.query.ingredientName;
    const ingredient = await Ingredient.findOne({ ingredientName: ingredientName });
    if (ingredient) {
        res.json({ status: 200, ingredient: ingredient });
    }
    else {
        res.json({ status: 500, details: 'No ingredient found' })
    }
})

// delete ingredient by ingredient id
router.delete('/ingredients', (req, res) => {
    // e.g., http://localhost:3001/api/ingredients/?ingredientId=61a801c0a5e53cbf6408af73
    const ingredientId = req.query.ingredientId;
    Ingredient.deleteOne({ _id: ingredientId }, function (err) {
        if (!err) {
            res.json({ status: 200 })
        }
        else {
            res.json({ status: 404 })
        }
    });
})

// Create new ingredient
router.post('/ingredient', async (req, res) => {
    const { ingredientName, calorie, unitType, user, userEmail } = req.body;
    let ingredient = {};
    ingredient.ingredientName = ingredientName;
    ingredient.unitType = unitType;
    ingredient.calorie = calorie;
    ingredient.user = user;
    ingredient.userEmail = userEmail;


    let ingredientModel = new Ingredient(ingredient);
    await ingredientModel.save()
        .then((ingredient) => {
            res.json({ status: 200, ingredient: ingredient });
        })
        .catch(error => {
            const tempObj = { ...error };
            delete tempObj.keyValue;
            res.json({ status: 'FAIL', details: tempObj }); // handle this from the backend
        });
});

// get recipe by id
router.get('/recipe', async (req, res) => {
    // /e.g, http://localhost:3001/api/recipe/?recipeId=6184750a533568e45cdbc195
    const recipeId = req.query.recipeId;
    const recipe = await Recipe.findOne({ _id: recipeId });
    if (recipe) {
        res.json({ status: 200, recipe: recipe });
    }
    else {
        res.json({ status: 500, details: 'No recipe found' })
    }
})
//Generate grocery list
router.get('/groceryList', async (req, res) => {
    // /e.g, http://localhost:3001/api/groceryList/?recipeId=6184750a533568e45cdbc195
    const recipeId = req.query.recipeId;
    // const recipe = await Recipe.findOne({ _id: recipeId });
    let recipeName
    let recipeItems = []
    await Recipe.find({ _id: recipeId }).then((recipeRes) => {
        console.log(recipeRes)
        recipeName = recipeRes[0].recipeName
        console.log("recipe Name", recipeName)
        // res.json({ status: 200, recipes: recipeRes});
        if (recipeRes) {
            recipeItems.push(recipeRes[0].recipeItem);
            res.json({ status: 200, recipes: recipeItems });
        }
        else {
            res.json({ status: 404, details: 'user not found' });
        }
    })

})


// Create new recipe & ingredients
router.post('/recipe', async (req, res) => {
    const { recipeName, description, price, recipePhoto, isPrivate, recipeItem, user, userEmail } = req.body;
    let recipe = {};
    recipe.recipeName = recipeName;
    recipe.description = description;
    recipe.price = price;
    recipe.recipePhoto = recipePhoto;
    recipe.isPrivate = isPrivate;
    recipe.recipeItem = recipeItem;
    recipe.user = user;
    recipe.userEmail = userEmail;
    let recipeModel = new Recipe(recipe);
    await recipeModel.save()
        .then((recipe) => {
            res.json({ status: 200, recipe: recipe });
        })
        .catch(error => {
            const tempObj = { ...error };
            delete tempObj.keyValue;
            res.json({ status: 'FAIL', details: tempObj }); // handle this from the backend
        });
});
// route for resetting password
router.post('/resetPassword', async (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    var query = { 'email': userEmail };

    User.findOneAndUpdate(query, { $set: { password: userPassword } }, { upsert: false }, function (err, doc) {
        if (err) {
            res.json({ status: 404 })
        }
        else {
            res.json({ status: 200 })
        }
    });
})

router.put('/editRecipe', async (req, res) => {
    // /e.g, http://localhost:3001/api/editRecipe/?recipeId=6184781d533568e45cdbc19c
    const recipeId = req.query.recipeId;
    const { recipeName, description, price, recipePhoto, isPrivate, recipeItem } = req.body;

    var query = {
        "_id": recipeId
    };

    Recipe.findOneAndUpdate(query, {
        $set: {
            recipeName: recipeName, description: description, price: price,
            recipePhoto: recipePhoto, isPrivate: isPrivate, recipeItem: recipeItem
        }
    }, { upsert: false }, function (err, doc) {
        if (err) {
            res.json({ status: 404 })
        }
        else {
            res.json({ status: 200 })
        }
    });
})

// delete recipe
router.delete('/recipe', (req, res) => {
    // /e.g, http://localhost:3001/api/recipe/?recipeId=6184750a533568e45cdbc195
    const recipeId = req.query.recipeId;
    Recipe.deleteOne({ _id: recipeId }, function (err) {
        if (!err) {
            res.json({ status: 200 })
        }
        else {
            res.json({ status: 404 })
        }
    });
})

// post feedback or support
router.post('/feedback', async (req, res) => {
    // /e.g, http://localhost:3001/api/feedback/
    const { userEmail, message, user, type, status } = req.body;

    let feedback = {};
    feedback.userEmail = userEmail;
    feedback.user = user;
    feedback.message = message;
    feedback.type = type;
    feedback.status = status;

    let feedbackModel = new Feedback(feedback);
    await feedbackModel.save()
        .then((response) => {
            res.json({ status: 200, feedback: response });
        })
        .catch(error => {
            const tempObj = { ...error };
            delete tempObj.keyValue;
            res.json({ status: 'FAIL', details: tempObj }); // handle this from the backend
        });
})

// get all feedbacks
router.get('/allFeedbacks', async (req, res) => {
    // e.g., http://localhost:3001/api/feedback/
    await Feedback.find({}, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 404 })
        } else {
            res.json({ status: 200, feedbacks: result });
        }
    }).clone().catch(function (err) { console.log(err) })
})

// get feedbacks by type
router.get('/feedback', async (req, res) => {
    // e.g., http://localhost:3001/api/feedback/?type=Support
    const type = req.query.type

    await Feedback.find({ type: type }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ status: 404 })
        } else {
            res.json({ status: 200, feedbacks: result });
        }
    }).clone().catch(function (err) { console.log(err) })
})

router.put("/editFeedback", async (req, res) => {
  // /e.g, http://localhost:3001/api/editRecipe/?id=6184781d533568e45cdbc19c
  const { time, message } = req.body;
  const query = { _id: req.query.id };

  Feedback.findOneAndUpdate(
    query,
    {
      $push: {
        feedbackDetails: {
          time: time,
          message: message
        },
      },
    },
    { upsert: false },
    function (err, doc) {
      if (err) {
        res.json({ status: 404 });
      } else {
        res.json({ status: 200 });
      }
    }
  );
});


router.put("/changeTicketStatus", async (req, res) => {
  // /e.g, http://localhost:3001/api/changeTicketStatus
  const { Status, ticketId } = req.body;
  console.log("status", Status);
  console.log("tid", ticketId);
  const query = { "_id": ticketId }

  Feedback.findOneAndUpdate(
    query,
    {
      $set: {
        Status: Status,
      },
    },
    { upsert: false },
    function (err, doc) {
      if (err) {
        res.json({ status: 404 });
      } else {
        res.json({ status: 200 });
      }
    }
  );
});

// API post route to compare answer
router.post('/securityQuestion', async (req, res) => {
    const userEmail = req.body.email;
    const securityAnswer = req.body.securityAnswer;

    await User.findOne({ email: userEmail }).then((user) => {
        if (user && user.securityAnswer == securityAnswer) {
            res.json({ status: 200 })
        }
        else {
            res.json({ status: 404 })
        }
    })
})

// route for getting the security question by user email
router.post("/fetchSecurityQuestion", async (req, res) => {
    const userEmail = req.body.email;
    console.log('email', userEmail);
    await User.findOne({ email: userEmail }).then((data) => {
        if (data) {
            res.json({ status: 200, securityQuestion: data.securityQuestion });
        } else {
            res.json({ status: 404 });
        }
    });
});


// Route for registering a user
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, role, password, securityQuestion, securityAnswer } = req.body;
    let user = {};
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email.trim();
    user.role = role;
    user.password = password;
    user.securityQuestion = securityQuestion;
    user.securityAnswer = securityAnswer.trim();

    let userModel = new User(user);
    await userModel.save()
        .then((user) => {
            res.json({ status: 200, user: user });
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
            console.log(user);
            if (user && user.password === password) {

                const successfulUser = {
                    _id: user._id,
                    email: user.email,
                    firstName: user.first_name,
                    last_name: user.last_name,
                    role: user.role,
                };
                console.log(successfulUser)
                const accessToken = generateAccessToken(successfulUser);
                const refreshToken = jwt.sign(successfulUser, process.env.REFRESH_TOKEN_SECRET);
                refreshTokens.push(refreshToken); // Put it in database or some file during production
                res.json({
                    status: 200,
                    user: successfulUser,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });
            } else {
                res.json({ status: 403, details: 'User or password is incorrect' });
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

