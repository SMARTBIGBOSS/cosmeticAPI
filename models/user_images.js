let mongoose = require('mongoose');

let UserImagesSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
        trim: true
    },
    originalName: {
        type: String,
        required: true
    }
},
    {collection: 'user_images'});

module.exports = mongoose.model('UserImage', UserImagesSchema);

