import { SensorData } from "../../models/sensorData/index.js";

export const createSensorData = async (req, res) => {
  try {
    const { towerId, lat, long, temp, fuel, powerSource } = req.body;
    if (!(towerId || lat || long || temp || fuel || powerSource)) {
      throw new Error("Required data not available");
    }

    let anomalie = false;

    /*
    - If temperature of site is greater than 45 degree Celsius
    - If fuel is less than 20 liters
    - If power source is running on generator conAnuously for more than 2Hrs. You have to
    check previous sensors data if conAnuously previous data has Power source as DG for
    2 Hrs. then raise this alarm.
    */

    if (temp > 45) anomalie = true;
    else if (fuel < 20) anomalie = true;
    else {
      // check is there any entry for a tower for running on generator since last 2 hours
      const currentTime = new Date();
      const timeOnTowHoursAgo = currentTime.setTime(
        currentTime.getTime() - 2 * 60 * 60 * 1000
      );
      const sensorDataForDGInLastTwoHours = await SensorData.findOne({
        powerSource: "DG",
        createdAt: { $gt: timeOnTowHoursAgo },
      });
      if (sensorDataForDGInLastTwoHours) anomalie = true;
    }
    const newSensorData = new SensorData({
      towerId,
      lat,
      long,
      temp,
      fuel,
      powerSource,
      anomalie,
    });

    await newSensorData.save();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("create sensor data error", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      data: null,
    });
  }
};

export const getSensorsData = async (req, res) => {
  try {
    const { limit = null, offset = null, filters = {} } = req.query;

    const sensorsData = await SensorData.find();

    return res.status(200).json({
      success: true,
      data: sensorsData,
    });
  } catch (error) {
    console.log("create sensor data error", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      data: null,
    });
  }
};
