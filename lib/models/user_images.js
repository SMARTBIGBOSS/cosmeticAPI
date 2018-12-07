'use strict';

var mongoose = require('mongoose');

var UserImagesSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
        trim: true
    },
    originalName: {
        type: String,
        required: true
    }
}, { collection: 'user_images' });

module.exports = mongoose.model('UserImage', UserImagesSchema);