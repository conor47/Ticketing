import { Publisher, TicketUpdatedEvent, Subjects } from '@clmicrotix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
