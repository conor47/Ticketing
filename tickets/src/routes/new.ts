import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@clmicrotix/common';
import { Ticket } from '../../models/ticket';
import { TicketCreatePublisher } from '../events/publishers/ticket-created-publisher';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greated than zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();

    // passing in the values from the ticket is preferable as opposed to the values from the request as the values returned from the build method
    // may have been sanitised and modified.
    // new TicketCreatePublisher(client).publish({
    //   id: ticket.id,
    //   title: ticket.title,
    //   price:ticket.price,
    //   userId: ticket.userId,
    // });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
