import express, { Request, Response } from 'express';
import { isRegularExpressionLiteral } from 'typescript';

const router = express.Router();

router.post('/api/tickets', (req: Request, res: Response) => {
  res.sendStatus(200);
});

export { router as createTicketRouter };
