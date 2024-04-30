import { WebSocketServer } from "ws";
import { SensorData } from "../models/sensorData/index.js";

export const sensorDataWss = new WebSocketServer({
  noServer: true,
  path: "/server/api/sensor-data/get/anomalie",
});

sensorDataWss.on("connection", async (ws) => {
  subscribeSensorData();

  const data = await SensorData.find({ anomalie: true });
  ws.send(JSON.stringify(data));
});

export const subscribeSensorData = () => {
  const onSensorDataChange = SensorData.watch();
  onSensorDataChange.on("change", () => {
    sensorDataWss.clients.forEach(async (client) => {
      const data = await SensorData.find({ anomalie: true });
      client.send(JSON.stringify(data));
    });
  });
};

export const emitSensorDataConnection = (request, socket, head) => {
  sensorDataWss.handleUpgrade(request, socket, head, function done(ws) {
    sensorDataWss.emit("connection", ws, request);
  });
};
