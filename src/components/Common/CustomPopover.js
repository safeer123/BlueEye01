import React from "react";
import "./index.css";

export default class CustomPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (!this.props.visible) return null;
    const className = this.props.className ? this.props.className : "";
    return (
      <div className={`custom-popover ${className}`}>
        <div>
          {this.props.displayItemList.map(displayItem => {
            const { text, key } = displayItem;
            // if (text.length > 25) text = `${text.substr(0, 50)}..`;
            return <p key={key}>{text}</p>;
          })}
        </div>
      </div>
    );
  }
}
