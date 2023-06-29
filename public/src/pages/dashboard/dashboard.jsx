import React from "react";

import User_circle from "@assets/images/User.svg";
import User_fill from "@assets/images/User_fill.svg";
import Chart_alt from "@assets/images/Chart_alt.svg";
import Chart_alt_fill from "@assets/images/Chart_alt_fill.svg";
import Message from "@assets/images/Message.svg";
import Message_alt_fill from "@assets/images/Message_alt_fill.svg";
import ProfileComp from "@pages/dashboard/profile";
import NotifComp from "@pages/dashboard/notification";
import StocksComp from "@pages/dashboard/stocks";
import "@assets/styles/dashboard.scss";
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: <ProfileComp toggleMainDisplay={this.props.toggleMainDisplay} />,
      displayName: "ProfileComp",
    };
  }
  changeDisplay = (e) => {
    let display, displayName;
    console.log(this.state);
    let value = e.currentTarget ? e.currentTarget.value : e;
    let navImg = document.querySelectorAll(".navImg");
    navImg[0].src = User_circle;
    navImg[1].src = Chart_alt;
    navImg[2].src = Message;

    switch (value) {
      case "ProfileComp":
      default:
        display = (
          <ProfileComp toggleMainDisplay={this.props.toggleMainDisplay} />
        );
        navImg[0].src = User_fill;
        displayName = "ProfileComp";
        break;
      case "StocksComp":
        display = (
          <StocksComp toggleMainDisplay={this.props.toggleMainDisplay} />
        );
        navImg[1].src = Chart_alt_fill;
        displayName = "StocksComp";
        break;
      case "NotifComp":
        display = <NotifComp />;
        navImg[2].src = Message_alt_fill;
        displayName = "NotifComp";
        break;
    }
    this.setState({ display: display, displayName: displayName }, () => {
      this.props.setItem("dashboard", this.state);
      console.log(this.state.display);
    });
  };
  componentDidMount() {
    let state = this.props.getItem("dashboard");
    if (!state) {
      state = {};
      state.display = (
        <ProfileComp toggleMainDisplay={this.props.toggleMainDisplay} />
      );
      state.displayName = "ProfileComp";
    }
    console.log(state);
    this.changeDisplay(state.displayName);
    this.setState(state);
  }
  render() {
    console.log("Dashboard page: ", this.props);
    return (
      <div id="dashboard">
        <div id="main">{this.state.display}</div>
        <div id="fixedNav">
          <button value="ProfileComp" onClick={this.changeDisplay}>
            <img id="userImg" className="navImg" src={User_fill} alt="User" />
          </button>
          <button value="StocksComp" onClick={this.changeDisplay}>
            <img id="chartImg" className="navImg" src={Chart_alt} alt="chart" />
          </button>
          <button value="NotifComp" onClick={this.changeDisplay}>
            <img
              id="messageImg"
              className="navImg"
              src={Message}
              alt="message"
            />
          </button>
        </div>
      </div>
    );
  }
}

export default Dashboard;