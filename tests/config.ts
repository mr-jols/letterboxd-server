/* eslint-disable no-await-in-loop */
import mongoose from "mongoose";
import CONFIG from "../src/config";

class TestDb {
  public static async connect(): Promise<void> {
    await mongoose.connect(CONFIG.mongo.test_uri ?? "");
  }

  public static async disconnect(): Promise<void> {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  public static async dropCollections(): Promise<void> {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany();
    }
  }
}

export default TestDb;
