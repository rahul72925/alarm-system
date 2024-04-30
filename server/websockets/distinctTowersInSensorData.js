import { WebSocketServer } from "ws";
import { SensorData } from "../models/sensorData/index.js";

export const distinctTowersWss = new WebSocketServer({
  noServer: true,
  path: "/server/api/sensor-data/get/distinct-towers",
});

distinctTowersWss.on("connection", async (ws) => {
  subscribeSensorData();
  const data = await SensorData.find().distinct("towerId");
  ws.send(JSON.stringify(data));
});

export const subscribeSensorData = () => {
  const onSensorDataChange = SensorData.watch();
  onSensorDataChange.on("change", () => {
    distinctTowersWss.clients.forEach(async (client) => {
      const data = await SensorData.find().distinct("towerId");
      client.send(JSON.stringify(data));
    });
  });
};

export const emitDistinctTowersWssConnection = (request, socket, head) => {
  distinctTowersWss.handleUpgrade(request, socket, head, function done(ws) {
    distinctTowersWss.emit("connection", ws, request);
  });
};
