const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_I = 10;
require('dotenv').config();
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required: true,
        maxlength:100
    },
    email:{
        type:String,
        required: true,
        trim: true,
        unique: 1
    },
    password:{
        type:String,
        required: true,
        minlength: 5
    },
    todo:{
        type: Array,
        default: []
    },
    token:{
        type:String
    }

})

userSchema.pre('save', function(next){
var user = this;

if(user.isModified('password')){
bcrypt.genSalt(SALT_I, function(err, salt){
    if(err) return next(err)

    bcrypt.hash(user.password,salt, function(err,hash){
        if(err) return next(err);
        user.password = hash;
        next();
    } )

})
} else{
    next()
}

})

userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword,this.password,function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(), "PASSWORD123")  
     
    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null,user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    jwt.verify(token, "PASSWORD123", function(err, decode){
        user.findOne({"_id": decode, "token": token}, function(err,user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User } 