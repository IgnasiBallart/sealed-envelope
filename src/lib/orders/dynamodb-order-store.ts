import "server-only";
import { ConditionalCheckFailedException, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { Order, OrderStore } from "./types";

const TOKEN_HASH_INDEX = "token-hash-index";
const EMAIL_INDEX = "email-index";

/** Table and indexes are defined in infra/app/orders.tf. */
export class DynamoDbOrderStore implements OrderStore {
  private readonly db = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
    marshallOptions: { removeUndefinedValues: true },
  });

  constructor(private readonly tableName: string) {}

  async savePaidOrder(order: Order): Promise<Order> {
    try {
      await this.db.send(
        new PutCommand({
          TableName: this.tableName,
          Item: order,
          ConditionExpression: "attribute_not_exists(stripeSessionId)",
        }),
      );
      return order;
    } catch (error) {
      if (!(error instanceof ConditionalCheckFailedException)) throw error;
      const existing = await this.db.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { stripeSessionId: order.stripeSessionId },
          ConsistentRead: true,
        }),
      );
      return existing.Item as Order;
    }
  }

  async findByTokenHash(tokenHash: string): Promise<Order | null> {
    // GSIs are eventually consistent: an order written a moment ago may take ~1 s to show up here.
    const result = await this.db.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: TOKEN_HASH_INDEX,
        KeyConditionExpression: "tokenHash = :tokenHash",
        ExpressionAttributeValues: { ":tokenHash": tokenHash },
        Limit: 1,
      }),
    );
    return (result.Items?.[0] as Order | undefined) ?? null;
  }

  async listPaidByEmail(email: string): Promise<Order[]> {
    const orders: Order[] = [];
    let startKey: Record<string, unknown> | undefined;
    do {
      const page = await this.db.send(
        new QueryCommand({
          TableName: this.tableName,
          IndexName: EMAIL_INDEX,
          KeyConditionExpression: "email = :email",
          FilterExpression: "paid = :paid",
          ExpressionAttributeValues: { ":email": email, ":paid": true },
          ExclusiveStartKey: startKey,
        }),
      );
      orders.push(...((page.Items ?? []) as Order[]));
      startKey = page.LastEvaluatedKey;
    } while (startKey);
    return orders;
  }

  async markEmailSent(stripeSessionId: string, sentAt: string): Promise<void> {
    await this.db.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { stripeSessionId },
        UpdateExpression: "SET emailSentAt = :sentAt",
        ConditionExpression: "attribute_exists(stripeSessionId)",
        ExpressionAttributeValues: { ":sentAt": sentAt },
      }),
    );
  }
}
