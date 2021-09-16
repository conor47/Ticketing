import { Subjects, Publisher, PaymentCreatedEvent } from '@clmicrotix/common';

export class PaymentCratedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
