import express from 'express';

import { currentUser } from '@clmicrotix/common';

// route for handling client requests to check if a user is authenticated

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  // below conditional is equivalent to if(!req.session || !req.session.jwt)

  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
