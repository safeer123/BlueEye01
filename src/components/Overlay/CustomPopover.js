import React from "react";

export default class CustomPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: {y: 500}
    }
  }
  
  render() {
    if (!this.props.visible) return null;

    return (
      <div
        className="custom-popover"
        style={{
          ...this.props.style,
          right: 0,
          top: this.state.position.y
        }}
      >
        <div>
          {this.props.displayItemList.map(displayItem => {
            let { text, key } = displayItem;
            if (text.length > 25) text = text.substr(0, 25) + "..";
            return <h4 key={key}>{text}</h4>;
          })}
        </div>
      </div>
    );
  }
}
