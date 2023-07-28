/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable prefer-arrow-callback */
import express, { type Express } from "express";
import CONFIG from "./config";
import mongoose from "mongoose";
import router from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import axios, { AxiosError } from "axios";

const server: Express = express();

function connect(): void {
  mongoose.connection
    .on("error", console.error)
    .on("disconnected", connect)
    .once("open", listen);

  mongoose.connect(CONFIG.mongo.uri ?? "");
}

function listen(): void {
  console.log("Database Connected");
  server.listen(CONFIG.port, () => {
    console.log(`Server started on port ${CONFIG.port}`);
  });
}

connect();
server.use(cors());
server.use(express.json());
server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }));
server.use(router);
