// This is how a user looks like to the DB
const mongoose = require('mongoose');

const feedback = new mongoose.Schema({
    type: {
        type: String,
    },
    message: {
        type: String,
    },
    userEmail: {
        type: String,
        enum: ['Support', 'Feedback']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }
});

module.exports = User = mongoose.model('feedback', feedback);