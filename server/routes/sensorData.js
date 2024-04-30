import express from "express";
import { createSensorData, getSensorsData } from "../controllers/index.js";

const SensorRouter = express.Router();

SensorRouter.post("/create", createSensorData);
SensorRouter.get("/get", getSensorsData);

export default SensorRouter;
