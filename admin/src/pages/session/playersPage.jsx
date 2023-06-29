import React from "react";
import PropTypes from "prop-types";

import link from "@assets/images/link.svg";
import trash from "@assets/images/Trash.svg";
import arrow_left from "@assets/images/Arrow_left.svg";

import PlayerComp from "@components/playerCard";

export default class PlayersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupInfo: JSON.parse(localStorage.getItem("groupInfo")),
      playersList: [],
    };
  }
  copyLink = (event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(
      import.meta.env.VITE_API_PUBLIC_URL +
        `/login/${this.state.groupInfo.groupid}`
    );
  };
  deleteGroup = () => {
    console.log("delete clicked");
  };
  fetchPlayerList = () => {
    fetch(
      import.meta.env.VITE_API_SERVER_URL +
        `team/${this.state.groupInfo.groupid}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let playersList = [];
        data.map((player, index) => {
          playersList.push(<PlayerComp playerObj={player} key={index} />);
        });
        this.setState({ playersList: playersList }, () => {
          console.log(this.state.playersList);
        });
      });
  };
  componentDidMount() {
    this.fetchPlayerList();
  }
  render() {
    return (
      <div id="playersPage" style={{ display: "flex" }}>
        <div id="topBar">
          <div id="top">
            <button
              id="back"
              onClick={this.props.toggleSession}
              value="groupPage"
            >
              <img src={arrow_left} alt="back arrow" />
            </button>
            <div id="topLabel">
              <div>
                <p id="groupNum">{this.state.groupInfo.name}</p>
                <p id="players">
                  Players <i id="playerCount">{this.state.groupInfo.players}</i>
                </p>
              </div>
              <div>
                <button id="trash" onClick={this.deleteGroup}>
                  <img src={trash} alt="trashIcon" />
                </button>
                <button onClick={this.copyLink}>
                  <img src={link} alt="linkIcon" />
                </button>
              </div>
            </div>
          </div>
          <hr />
        </div>
        <div id="playersList">
          {this.state.playersList.map((element) => element)}
        </div>
      </div>
    );
  }
}
PlayersPage.propTypes = {
  toggleSession: PropTypes.func.isRequired,
};