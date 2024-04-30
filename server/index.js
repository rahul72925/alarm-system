import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import SensorRouter from "./routes/sensorData.js";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import cors from "cors";

import {
  emitSensorDataConnection,
  emitDistinctTowersWssConnection,
} from "./websockets/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  })
);
const server = http.Server(app);

const PORT = 4005;

app.use(bodyParser.json());

/* initiate db connection */

(async () => {
  const replset = await MongoMemoryReplSet.create({
    replSet: { count: 4, storageEngine: "wiredTiger" },
    instanceOpts: [{ port: 27900 }],
    port: 27900,
  });

  const mongoUri = replset.getUri("alarm-system");
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
})();

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected successfully");
});

/* end db connection */

app.use("/server/api/sensor-data", SensorRouter);

server.listen(PORT, () => {
  console.log("server running on port:", PORT);
});

server.on("upgrade", async function upgrade(request, socket, head) {
  //handling upgrade(http to websocekt) event

  const url = request.url;
  //emit connection when request accepted
  if (url.includes("/get/anomalie")) {
    emitSensorDataConnection(request, socket, head);
  }
  if (url.includes("/get/distinct-towers")) {
    emitDistinctTowersWssConnection(request, socket, head);
  }
});
