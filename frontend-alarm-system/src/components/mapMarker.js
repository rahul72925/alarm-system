export const Marker = ({ onClick, children, sensorData }) => {
  return (
    <button onClick={() => onClick(sensorData.towerId)} className="marker">
      {sensorData.towerId}
    </button>
  );
};
