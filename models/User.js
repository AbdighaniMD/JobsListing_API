const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,
      },
      email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please provide a valid email',
        ],
        unique: true,
      },
      userName: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,
        unique: true,
      },
      password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
      },
});

//Pre middleware functions are executed one after another
UserSchema.pre('save', async function () {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});


UserSchema.methods.createJWT =  function () {
  return jwt.sign(
    { userId: this._id, username: this.userName },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}


UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcryptjs.compare(canditatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('Users', UserSchema);