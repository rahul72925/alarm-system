import logo from "./logo.svg";
import "./App.css";
import { Map } from "./components/map";
import "mapbox-gl/dist/mapbox-gl.css";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { SensorDataTable } from "./components/sensorDataTable";

function App() {
  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Map />
          </Grid>
          <Grid item xs={5}>
            <SensorDataTable />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;
