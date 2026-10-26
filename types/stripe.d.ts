declare module 'stripe' {
  namespace Stripe {
    type Event = any;
    namespace Checkout {
      type Session = any;
    }
    type LatestApiVersion = any;
  }
  class Stripe {
    constructor(apiKey: string, config?: any);
    checkout: any;
    webhooks: any;
    [key: string]: any;
  }
  export default Stripe;
}
