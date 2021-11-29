// This is how a user looks like to the DB
const mongoose = require('mongoose');

const ingredients = new mongoose.Schema({
    ingredientName: {
        type: String,
    },
    unitType: {
        type: String,
    },
    calorie: {
        type: String,
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
     userEmail: {
    type: String,
}
});

module.exports = User = mongoose.model('ingredients', ingredients);