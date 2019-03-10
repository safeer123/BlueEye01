import React from "react";
import SampleViewList from "../../../SampleViews/config";
import "./index.css";

export default () => (
  <div className="home-wrapper">
    <div className="home-thumbnails">
      {SampleViewList.map((sampleView, i) => (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={null}
          className="home-thumbnail"
          onClick={() => {
            window.location = `./sample/${i}`;
          }}
        >
          <h3>{sampleView.name}</h3>
          <p>{sampleView.description}</p>
        </div>
      ))}
    </div>
  </div>
);
