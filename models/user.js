var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, 
        required: true,
        trim: true
    }, 
    name: {
        type: String,
        required: true,
        trim: true
    },
    favoriteBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
})
//authenticate input against database documents
UserSchema.statics.authenticate = (email, password, callback) => {
    User.findOne({email: email})
        .exec((error, user) => {
            if(error) {
                callback(error);
            } else if(!user) {
                var err = new Error('User not found.');
                err.status = 400;
                callback(err);
            }
            bcrypt.compare(password, user.password, (error, result) =>{
                if(result === true) {
                    callback(null, user);
                }else {
                    callback();
                }
            })
        });
}

//hash password before saving to database
UserSchema.pre('save', function (next) {
    var user = this; //refers to the object the user created on sign up via the form
    bcrypt.hash(user.password, 10, function(err, hash) {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
})

var User = mongoose.model('User', UserSchema);
module.exports = User;