import {
  AttributeValue,
  DeleteItemCommand,
  DeleteItemCommandInput,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { dbClient } from "./aws/dynamo.ts";

export const putItem = async (
  tableName: string,
  item: Record<string, AttributeValue>,
) => {
  const params: PutItemCommandInput = {
    TableName: tableName,
    Item: item,
  };

  try {
    const command = new PutItemCommand(params);
    const response = await dbClient.send(command);
    console.log("Item successfully inserted:", response);
  } catch (error) {
    console.error("Error inserting item:", error);
  }
};

export const getItem = async (
  tableName: string,
  key: Record<string, AttributeValue>,
) => {
  const params: GetItemCommandInput = {
    TableName: tableName,
    Key: key,
  };

  try {
    const command = new GetItemCommand(params);
    const response = await dbClient.send(command);
    console.log("Item successfully retrieved:", response.Item);
    return response.Item;
  } catch (error) {
    console.error("Error retrieving item:", error);
  }
};

export const deleteItem = async (
  tableName: string,
  key: Record<string, AttributeValue>,
) => {
  const params: DeleteItemCommandInput = {
    TableName: tableName,
    Key: key,
    ReturnValues: "ALL_OLD",
    // Optional: ReturnValues: "ALL_OLD", // Returns the entire deleted item
  };

  try {
    const command = new DeleteItemCommand(params);
    const response = await dbClient.send(command);
    console.log("Item successfully deleted:", response);
    return response;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error; // Rethrow to allow calling code to handle the error
  }
};
