export type Order = {
  /** Stripe Checkout Session id. Also the order id. */
  stripeSessionId: string;
  email: string;
  productSlug: string;
  paid: boolean;
  tokenHash: string;
  createdAt: string;
  emailSentAt?: string;
};

export interface OrderStore {
  /** Inserts the order unless one with the same Stripe session id exists, and returns the stored one. */
  savePaidOrder(order: Order): Promise<Order>;
  findByTokenHash(tokenHash: string): Promise<Order | null>;
  listPaidByEmail(email: string): Promise<Order[]>;
  markEmailSent(stripeSessionId: string, sentAt: string): Promise<void>;
}
