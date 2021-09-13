import mongoose from 'mongoose';

import { Order, OrderStatus } from './order';

interface TicketAddrs {
  title: string;
  price: number;
  id: string;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAddrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAddrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

// this is how we add methods to a document.
// Method for checking whether a given ticket is reserved
ticketSchema.methods.isReserved = async function () {
  // this will === the docuement we just called isReserved() on
  const existingOrder = await Order.findOne({
    ticket: this.id,
    status: {
      $in: [
        OrderStatus.Complete,
        //@ts-ignore
        OrderStatus.AwaitingPayment,
        //@ts-ignore
        OrderStatus.Created,
      ],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
