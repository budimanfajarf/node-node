const _ = require('lodash')
const bcrypt = require('bcrypt')
const express = require('express')
const { User, validate } = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/register', async (req, res) => {
  const { error, value } = validate(req.body)
  if (error)
    return res.status(400).send(error.details[0].message)

  let user = await User.findOne({email: value.email})
  if (user)
    return res.status(400).send('Email already registered')   

  const salt = await bcrypt.genSalt(10)
  value.password = await bcrypt.hash(value.password, salt)

  user = new User(value)
  user = await user.save()

  const userToken = user.generateJwtToken() 
  const userPick = _.pick(user, ['_id', 'name', 'email'])

  res.set('x-auth-token', userToken).status(200).send(userPick)
})

router.get('/me', auth, async (req, res) => {
  const user = await User.findOne({_id: req.user._id}).select('-password -__v')
  return res.send(user)
})

module.exports = router