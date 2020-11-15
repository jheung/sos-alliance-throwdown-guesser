import React, { useState } from "react";
import FilesUploader from "./component/files-uploader";
import "./App.css";

const LANES = [
  { id: "LANE_LEFT", label: "Left lane" },
  { id: "LANE_CENTER", label: "Center lane" },
  { id: "LANE_RIGHT", label: "Right lane" },
];

function App() {
  const [processedImages, setProcessedImages] = useState({});
  const [laneData, setLaneData] = useState({});

  const processLaneData = (data) => {
    const processedLanes = LANES.reduce((acc, { id: laneId }) => {
      const processedLane = data[laneId].map(({ words }) => {
        const user = words
          .slice(0, -2)
          .map((word) => word.text)
          .join(" ");
        const { text: power } = words[words.length - 2];
        const { text: order } = words[words.length - 1];

        return {
          user,
          power,
          order,
        };
      });

      return { ...acc, [laneId]: processedLane };
    }, {});

    const orderedLanes = LANES.reduce((acc, { id: laneId }) => {
      const orderedLane = processedLanes[laneId].sort((a, b) => {
        const aParsed = parseInt(a.order, 10);
        const bParsed = parseInt(b.order, 10);

        const aOrder = isNaN(aParsed) ? 0 : aParsed;
        const bOrder = isNaN(bParsed) ? 0 : bParsed;

        return aOrder - bOrder;
      });

      return { ...acc, [laneId]: orderedLane };
    }, {});

    return orderedLanes;
  };

  const handleLaneScreenshots = (id, data) => {
    setProcessedImages({ ...processedImages, [id]: data });
  };

  const handleUploadForm = async (event) => {
    event.preventDefault();

    fetch("http://localhost:3001/api/process/lanes", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ screenshots: processedImages }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const processedData = processLaneData(data);
        setLaneData(processedData);
      });
  };

  return (
    <div className="App">
      <form className="form" onSubmit={handleUploadForm}>
        <div className="lanes">
          {LANES.map((lane) => (
            <fieldset key={lane.id}>
              <FilesUploader
                label={lane.label}
                id={lane.id}
                onChange={handleLaneScreenshots}
              />
              {processedImages?.[lane.id]?.map((image, index) => (
                <img
                  key={lane.id + index}
                  src={image}
                  alt="Processed"
                  style={{ maxWidth: "100%" }}
                />
              ))}
            </fieldset>
          ))}
        </div>
        <button type="submit">Process screenshots</button>
      </form>

      <div className="lanes">
        {LANES.map((lane) => (
          <table key={lane.id}>
            <tbody>
              {laneData?.[lane.id]?.map((lane) => (
                <tr>
                  <td>{lane.user}</td>
                  <td>{lane.power}</td>
                  <td>{lane.order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
}

export default App;
