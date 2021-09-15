// A fake implementation of our nats wrapper class for mock testing with Jest

// we are only including in this fake natsWrapper the necessary properties for testing
export const natsWrapper = {
  client: {
    // the mock function jest.fn() is a function that we can test. It internally keeps track of whether it was invoked, how many times it
    // was invoked etc. We can also provide a mock implementation to still satisfy our mock netsWrapper functionality
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
