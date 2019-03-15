import React from "react";
import SampleViewList from "../../../SampleViews/config";
import "./index.css";

export default props => (
  <div className="home-wrapper">
    <div className="home-thumbnails">
      {SampleViewList.map((sampleView, i) => (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={null}
          className="home-thumbnail"
          onClick={() => {
            if (props.navigateToPage) {
              props.navigateToPage(i);
            }
          }}
        >
          <h3>{sampleView.name}</h3>
          <p>{sampleView.description}</p>
        </div>
      ))}
    </div>
  </div>
);
