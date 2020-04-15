const _ = require('lodash')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const express = require('express')
const { User } = require('../models/user')
const router = express.Router()

router.post('/', async (req, res) => {
  const { error, value } = validate(req.body)
  if (error)
    return res.status(400).send(error.details[0].message)

  let user = await User.findOne({email: value.email})
  if (!user)
    return res.status(400).send('Invalid email or password')   

  const validPassword = await bcrypt.compare(value.password, user.password)
  if (!validPassword)
    return res.status(400).send('Invalid email or password')   

  const userToken = user.generateJwtToken() 
  const userPick = _.pick(user, ['_id', 'name', 'email'])

  res.set('x-auth-token', userToken).status(200).send(userPick)
})

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),    
  })
  return schema.validate(user)
}

module.exports = router