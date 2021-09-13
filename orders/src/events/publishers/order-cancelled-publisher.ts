import { Publisher, OrderCancelledEvent, Subjects } from '@clmicrotix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
