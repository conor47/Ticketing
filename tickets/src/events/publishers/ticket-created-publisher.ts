import { Publisher, TicketCreatedEvent, Subjects } from '@clmicrotix/common';

export class TicketCreatePublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
