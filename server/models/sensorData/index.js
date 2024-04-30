import { Schema, model } from "mongoose";

const sensorDataSchema = new Schema(
  {
    towerId: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
    temp: {
      type: Number,
      required: true,
      max: 50,
    },
    fuel: {
      type: Number,
      required: true,
      max: 50,
      min: 0,
    },
    powerSource: {
      type: String,
      enum: ["DG", "ELECTRIC"],
      required: true,
    },
    anomalie: {
      type: Boolean,
      required: true,
    },
    city: {
      type: String,
    },
  },
  { timestamps: true }
);

sensorDataSchema.index({ createdAt: 1, towerId: 1 });

export const SensorData = model("SensorData", sensorDataSchema);
