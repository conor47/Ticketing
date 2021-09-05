import express from 'express';
import jwt from 'jsonwebtoken';

// route for handling client requests to check if a user is authenticated

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  // below conditional is equivalent to if(!req.session || !req.session.jwt)
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (error) {
    res.send({ currentuser: null });
  }
});

export { router as currentUserRouter };
