import React from "react";

export default class CustomPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: { y: 50 }
    };
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
            if (text.length > 25) text = `${text.substr(0, 50)}..`;
            return <p key={key}>{text}</p>;
          })}
        </div>
      </div>
    );
  }
}
