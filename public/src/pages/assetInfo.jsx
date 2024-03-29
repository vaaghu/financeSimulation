import React from "react";
import PropTypes from "prop-types";
import Arrow_left from "@assets/images/Arrow_left.svg";
import "@assets/styles/news.scss";
import Time from "@components/time";
import point from "@assets/images/bullet_point.svg";

class AssetInfoComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: "",
      text: [""],
    };
  }
  getInfo = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "assetInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ assetid: this.state.id }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.info) {
          data.info = data.info
            .replace(/_asset_/gi, this.state.name)
            .split("\n");
        } else {
          data.info == undefined;
        }
        this.setState({ text: data.info });
      });
  };
  componentDidMount() {
    this.setState(JSON.parse(localStorage.getItem("asset")), () =>
      this.getInfo()
    );
  }
  render() {
    return (
      <div id="news">
        <div id="topBar">
          <div id="back">
            <img
              src={Arrow_left}
              alt="back_arrow"
              onClick={() => {
                setTimeout(
                  () => this.props.toggleMainDisplay("dashboard"),
                  400
                );
              }}
            />
          </div>
          <p className="pageTitle">{this.state.name}</p>
          <Time />
        </div>
        <div id="main">
          <div id="assetsContent">
            {this.state.text &&
              this.state.text.map((line, index) => {
                if (line == "") {
                  return;
                } else {
                  return (
                    <div key={index} className="news">
                      <img src={point} alt="bullet_point" />
                      <p>{line}</p>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
    );
  }
}
AssetInfoComp.propTypes = {
  // info: PropTypes.object.isRequired,
  toggleMainDisplay: PropTypes.func.isRequired,
};

export default AssetInfoComp;
