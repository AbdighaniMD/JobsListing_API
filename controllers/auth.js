const Users = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors')

/**
 * POST /register
 * add user 
 * 
*/
const register = async (req, res) => {
    const user = new Users ({
        name :req.body.name,
        email:req.body.email,
        userName:req.body.userName,
        password:req.body.password
    });

    await user.save();
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{
            username: user.userName
        },token 
    });
}

/**
 * POST /login
 * filter / Search for a user using JWT sign
 * 
*/
const login = async (req, res) => {
    const {userName, password} = req.body;

    if(!userName || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await Users.findOne({userName});
    if (!user) {
      throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Please check your password again')
    }

    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{
            username: user.userName
        },token 
    });
}


module.exports = {
    register,
    login
}
