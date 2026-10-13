import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Order, OrderStore } from "./types";

/** Development-only store: a JSON file under LOCAL_DATA_DIR. Single process, no concurrency guarantees beyond it. */
export class LocalOrderStore implements OrderStore {
  private readonly file: string;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(dataDir: string) {
    this.file = path.resolve(dataDir, "orders.json");
  }

  savePaidOrder(order: Order): Promise<Order> {
    return this.mutate((orders) => {
      const existing = orders.find((o) => o.stripeSessionId === order.stripeSessionId);
      if (existing) return existing;
      orders.push(order);
      return order;
    });
  }

  async findByTokenHash(tokenHash: string): Promise<Order | null> {
    const orders = await this.read();
    return orders.find((o) => o.tokenHash === tokenHash) ?? null;
  }

  async listPaidByEmail(email: string): Promise<Order[]> {
    const orders = await this.read();
    return orders.filter((o) => o.paid && o.email === email);
  }

  async markEmailSent(stripeSessionId: string, sentAt: string): Promise<void> {
    await this.mutate((orders) => {
      const order = orders.find((o) => o.stripeSessionId === stripeSessionId);
      if (order) order.emailSentAt = sentAt;
    });
  }

  private async read(): Promise<Order[]> {
    try {
      return JSON.parse(await readFile(this.file, "utf8")) as Order[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
  }

  private mutate<T>(change: (orders: Order[]) => T): Promise<T> {
    const run = this.queue.then(async () => {
      const orders = await this.read();
      const result = change(orders);
      await mkdir(path.dirname(this.file), { recursive: true });
      const tmp = `${this.file}.tmp`;
      await writeFile(tmp, JSON.stringify(orders, null, 2));
      await rename(tmp, this.file);
      return result;
    });
    this.queue = run.catch(() => undefined);
    return run;
  }
}
