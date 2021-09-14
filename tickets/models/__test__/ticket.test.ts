import { Ticket } from '../ticket';

it('implemented OCC', async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: '1010',
  });

  // save the ticket
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two seperate changes to to tickets
  firstInstance!.set({ price: 50 });
  secondInstance!.set({ price: 60 });

  // save the first changed ticket
  await firstInstance!.save();

  // save the second changed ticket and expect and error
  try {
    await secondInstance!.save();
  } catch (error) {
    return error;
  }

  throw new Error('Should be unreachable');
});

it('increments versin number each save', async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: '123',
  });

  // save the ticket
  await ticket.save();

  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
