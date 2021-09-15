import {
  Subjects,
  ExpirationCompleteEvent,
  Publisher,
} from '@clmicrotix/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
