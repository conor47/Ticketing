import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { body } from 'express-validator';

import { validateRequest, BadRequestError } from '@clmicrotix/common';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email is already in use');
    }

    const user = User.build({ email, password });
    await user.save();
    // generate jwt and store it on the session object
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // we define the property on the session object in this way as typescript does not like us setting properties using the req.session.jtw
    // syntax
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
