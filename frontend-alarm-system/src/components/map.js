import React, { useState, useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";
import { Marker } from "./mapMarker";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmFodWw3MjkyNSIsImEiOiJjbHZreDFhZncyMG4wMmtudjlueHk0Y3RzIn0.DvAU_eYDyOjBn9gQufLlew";

let map = null;

export const Map = () => {
  const [anomaliesSensorData, setAnomaliesSensorData] = useState([]);

  const { lastMessage } = useWebSocket(
    "ws://127.0.0.1:4005/server/api/sensor-data/get/anomalie",
    {
      reconnectAttempts: 5,
      reconnectInterval: 3000,
      shouldReconnect: () => true,
      onError: (error) => console.log("get anomalie sensor data error", error),
    }
  );

  useEffect(() => {
    if (lastMessage !== null) {
      setAnomaliesSensorData(JSON.parse(lastMessage.data));
    }
  }, [lastMessage]);

  const mapContainerRef = useRef(null);

  //   Initialize map when component mounts
  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [79.1066, 20.83498],
      zoom: 4,
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (map !== null) {
      if (anomaliesSensorData.length > 0) {
        // Render custom marker components
        anomaliesSensorData.forEach((eachSensorData) => {
          // Create a React ref
          const ref = React.createRef();
          // Create a new DOM node and save it to the React ref
          ref.current = document.createElement("div");
          // Render a Marker Component on our new DOM node
          createRoot(ref.current).render(
            <Marker onClick={markerClicked} sensorData={eachSensorData} />
          );

          // Create a Mapbox Marker at our new DOM node
          new mapboxgl.Marker(ref.current)
            .setLngLat([eachSensorData.long, eachSensorData.lat])
            .addTo(map);
        });
      }
    }
  }, [map, anomaliesSensorData]);

  const markerClicked = (title) => {
    window.alert(title);
  };

  return (
    <div
      className="map-container"
      ref={mapContainerRef}
      style={{ height: "100vh" }}
    />
  );
};
