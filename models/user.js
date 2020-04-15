const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')
const passwordComplexity = require('joi-password-complexity')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}) 

// const token = jwt.sign(userPick, config.get('jwtPrivateKey'))
userSchema.methods.generateJwtToken = function () {
  return jwt.sign({
    _id: this._id,
    name: this.name,
    email: this.email,
    isAdmin: this.isAdmin
  }, config.get('jwtPrivateKey'))
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().max(255).email().required(),
    password: passwordComplexity({
      min: 8,
      max: 255,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      // requirementCount: 2,
    }).required()
  })
  return schema.validate(user)
}

exports.User = User
exports.validate = validateUser