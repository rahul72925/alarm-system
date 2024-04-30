import axios from "axios";

const towers = [
  { towerId: 1, city: "Mumbai", lat: 19.076, long: 72.8777 },
  { towerId: 2, city: "Delhi", lat: 28.7041, long: 77.1025 },
  { towerId: 3, city: "Bangalore", lat: 12.9716, long: 77.5946 },
  { towerId: 4, city: "Hyderabad", lat: 17.385, long: 78.4867 },
  { towerId: 5, city: "Chennai", lat: 13.0827, long: 80.2707 },
  { towerId: 6, city: "Kolkata", lat: 22.5726, long: 88.3639 },
  { towerId: 7, city: "Pune", lat: 18.5204, long: 73.8567 },
  { towerId: 8, city: "Jaipur", lat: 26.9124, long: 75.7873 },
  { towerId: 9, city: "Ahmedabad", lat: 23.0225, long: 72.5714 },
  { towerId: 10, city: "Surat", lat: 21.1702, long: 72.8311 },
];

function getRandomNumber(from, to, inDecimal = false) {
  const num = Math.random() * (to - from + 1);
  return inDecimal
    ? parseFloat((num + from).toFixed(2))
    : Math.floor(num) + from;
}

function testData() {
  const randomTowerNumber = getRandomNumber(0, 8);
  let towerData = towers[randomTowerNumber];

  towerData["temp"] = getRandomNumber(0, 49, true);
  towerData["fuel"] = getRandomNumber(0, 49, true);
  towerData["powerSource"] = ["DG", "ELECTRIC"][getRandomNumber(0, 1)];
  return towerData;
}

function generateSensorData() {
  setInterval(() => {
    const sensorData = testData();
    axios("http://localhost:4005/server/api/sensor-data/create", {
      method: "POST",
      data: sensorData,
    })
      .then(({ data }) => console.log(data.success))
      .catch((error) => console.log(error.message));
  }, 5000);
}

generateSensorData();
