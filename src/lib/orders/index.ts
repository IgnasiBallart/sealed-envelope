import "server-only";
import { env } from "@/lib/env";
import { LocalOrderStore } from "./local-order-store";
import type { OrderStore } from "./types";

export type { Order, OrderStore } from "./types";

let store: OrderStore | undefined;

function createStore(): OrderStore {
  switch (env.orderStore()) {
    case "local":
      return new LocalOrderStore(env.localDataDir());
  }
}

export function orderStore(): OrderStore {
  store ??= createStore();
  return store;
}
