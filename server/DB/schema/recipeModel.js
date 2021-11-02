// This is how a user looks like to the DB
const mongoose = require('mongoose');
const recipe = new mongoose.Schema({
        recipeName: {
            type: String,
        },
        description: {
            type: String,
        },
        price: {
            type: String,
        },
        recipePhoto: {
            type: String,
        },
    isGlobal:{
            type:Boolean
    },
    recipeItem: [{
            itemQuantity: {
                type: String,
            },
               ingredients:{
                   type:mongoose.Schema.Types.ObjectId,
                   ref: 'ingredients',
               }
        }],
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

module.exports = User = mongoose.model('recipe', recipe);