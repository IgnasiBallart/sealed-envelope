import "server-only";
import { env } from "@/lib/env";
import { DynamoDbOrderStore } from "./dynamodb-order-store";
import { LocalOrderStore } from "./local-order-store";
import type { OrderStore } from "./types";

export type { Order, OrderStore } from "./types";

let store: OrderStore | undefined;

function createStore(): OrderStore {
  switch (env.orderStore()) {
    case "local":
      return new LocalOrderStore(env.localDataDir());
    case "dynamodb":
      return new DynamoDbOrderStore(env.ordersTable());
  }
}

export function orderStore(): OrderStore {
  store ??= createStore();
  return store;
}
