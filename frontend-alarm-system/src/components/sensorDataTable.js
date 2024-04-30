import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress } from "@mui/material";
import useWebSocket from "react-use-websocket";

const columns = [
  { field: "towerId", headerName: "Tower ID", width: 100 },
  { field: "temp", headerName: "Temperature(c)", width: 100 },
  {
    field: "fuel",
    headerName: "Fuel(l)",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    description: "This column has a value getter and is not sortable.",
    width: 150,
  },
  {
    field: "powerSource",
    headerName: "Power Source",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 150,
  },
  {
    field: "anomalie",
    headerName: "Anomalie",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 150,
  },
];
export const SensorDataTable = () => {
  const [sensorData, setSensorData] = useState([]);
  const [existingTowers, setExistingTowers] = useState(-1);
  const [sensorFetchDataStatus, setSensorFetchDatStatus] = useState("LOADING");

  const { lastMessage } = useWebSocket(
    "ws://127.0.0.1:4005/server/api/sensor-data/get/distinct-towers",
    {
      reconnectAttempts: 5,
      reconnectInterval: 3000,
      shouldReconnect: () => true,
      onError: (error) => console.log("get distinct sensor data error", error),
    }
  );

  function fetchSensorData() {
    fetch("http://localhost:4005/server/api/sensor-data/get")
      .then((res) => res.json())
      .then((result) => {
        setSensorData(result.data);
        setSensorFetchDatStatus("SUCCESS");
      })
      .catch((error) => {
        console.log("sensor data fetch error", error);
        setSensorFetchDatStatus("ERROR");
      });
  }

  useEffect(() => {
    if (sensorFetchDataStatus === "LOADING") fetchSensorData();
  }, [sensorFetchDataStatus]);

  useEffect(() => {
    if (lastMessage !== null) {
      if (existingTowers === -1) {
        // set total unique # of sensors at first load
        setExistingTowers(JSON.parse(lastMessage.data).length);
      } else {
        if (JSON.parse(lastMessage.data).length > existingTowers) {
          // refetch the sensors data
          setSensorFetchDatStatus("LOADING");
          setExistingTowers(JSON.parse(lastMessage.data).length);
        }
      }
    }
  }, [lastMessage]);

  if (sensorFetchDataStatus === "ERROR") return null;
  return (
    <DataGrid
      rows={sensorData}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 10 },
        },
      }}
      pageSizeOptions={[10, 20]}
      getRowId={(row) => row["_id"]}
      loading={sensorFetchDataStatus === "LOADING"}
      style={{ height: "100vh" }}
    />
  );
};
