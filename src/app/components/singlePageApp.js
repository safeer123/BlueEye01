import React from "react";
import Content from "./Content";
import Home from "./Home";
import "./css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: -1
    };
  }

  navigateToPage = i => {
    this.setState({ page: i });
  };

  navigateToHome = () => {
    this.setState({ page: -1 });
  };

  render() {
    if (this.state.page === -1)
      return <Home navigateToPage={this.navigateToPage} />;
    else if (this.state.page >= 0)
      return (
        <Content
          match={{ params: { viewIndex: this.state.page } }}
          navigateToHome={this.navigateToHome}
        />
      );
    return <span>No Match</span>;
  }
}

export default App;
