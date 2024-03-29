import React from "react";
import PropTypes from "prop-types";
import "@assets/styles/profile.scss";
// import Alarmclock from "@assets/images/Alarmclock.svg";
import badge from "@assets/images/badge.svg";
import emptyBadge from "@assets/images/emptyBadge.svg";
import pie_chart from "@assets/images/pie_chart.svg";
import white_group from "@assets/images/white_group.svg";
import Vector from "@assets/images/Vector.svg";
import Coin from "@assets/images/coin.svg";
import Time from "@components/time";
import reward from "@assets/images/rewardCard.svg";

import yearPhase from "@utils/yearPhase.json";
import { WithRouter } from "@components/routingWrapper";
// import share from "@assets/images/share.svg";

/*
import Arrow_left from "@assets/images/Arrow_left.svg"
import User_fill from "@assets/images/User_fill.svg"
import Chart_alt from "@assets/images/Chart_alt.svg"
import Message from "@assets/images/Message.svg";
*/
import { PieChart, Pie, Cell } from "recharts";
const socket = new WebSocket(import.meta.env.VITE_API_WEBSOCKET_URL);
class ProfileComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: 2099,
      phase: 1,
      star: 0,
      pieValue: 0,
    };
  }
  triggerDelay = 500;
  toShare = async () => {
    if (navigator.share && navigator.canShare) {
      fetch("")
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "image.jpg", { type: blob.type });

          navigator
            .share({
              files: [file],
            })
            .then(() => {
              console.log("Image shared successfully!");
            })
            .catch((error) => {
              console.error("Error sharing image:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    }
  };
  updateProfileInfo = () => {
    fetch(
      import.meta.env.VITE_API_SERVER_URL +
        "portfolio/" +
        localStorage.getItem("groupid"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        // body: JSON.stringify({"userid":localStorage.getItem('userid')})
      }
    );
    // .then((response) => {
    //   if (response.status === 200 || response.status === 201) {
    //     // this.props.navigate("dashboard")
    //   }
    //   return response.json();
    // })
    // .then((data) => {
    //   // Handle the response data
    //   console.log(data);
    // });
  };
  logout = () => {
    let countDownIntervalKey = localStorage.getItem("countDownIntervalKey");
    if (countDownIntervalKey) clearInterval(countDownIntervalKey);
    this.props.navigate("../login/" + localStorage.getItem("groupid"));
    localStorage.clear();
  };
  setStars = () => {
    let starCount = (Number.parseInt(localStorage.getItem("year")) - 2100) | 0;
    starCount += JSON.parse(localStorage.getItem("isEnd")) ? 1 : 0;
    let holders = document.querySelectorAll(".starHolder");
    holders.forEach((holder, index) => {
      if (index < starCount) {
        holder.src = badge;
        holder.className = "starHolder starPresent";
      } else {
        holder.src = emptyBadge;
        holder.className = "starHolder starEmpty";
      }
    });
    if (JSON.parse(localStorage.getItem("isEnd"))) {
      if (!JSON.parse(sessionStorage.getItem("cardAnimationEnd"))) {
        document.querySelector("#card").style.animationName = "cardRotate";
        setTimeout(() => {
          document.querySelector("#reward").style.zIndex = "1";
          document.querySelector("#empty").style.zIndex = "-1";
        }, 750);
        setTimeout(() => {
          document.querySelector("#card").style.animationName = "";
          sessionStorage.setItem("cardAnimationEnd", true);
        }, 1500);
      } else {
        document.querySelector("#reward").style.zIndex = "1";
        document.querySelector("#empty").style.zIndex = "-1";
      }
    } else {
      document.querySelector("#reward").style.zIndex = "-1";
      document.querySelector("#empty").style.zIndex = "1";
      sessionStorage.setItem("cardAnimationEnd", false);
      document.querySelector("#empty").style.height = `${27 * starCount}%`;
    }
  };
  updateProgressBar = () => {
    let keys = Object.keys(yearPhase);
    let year = localStorage.getItem("year");
    // let year = 2106;
    let currentYear = Number(year) - Number(keys[0]);
    if (currentYear < 0) return this.setState({ pieValue: 0 });

    let max = Number(keys[keys.length - 1]) + 1 - Number(keys[0]);
    let perPhaseValue = 1 / (7 * yearPhase[year].length);
    let percent = Number.parseInt(
      (currentYear / max +
        perPhaseValue * Number(localStorage.getItem("phase"))) *
        100
    );
    this.setState({ pieValue: percent });
  };
  checkMessage = (event) => {
    if (localStorage.getItem("dashboard") != "ProfileComp") return;
    let data = JSON.parse(event.data);
    this.setStars();
    switch (data.msgType) {
      case "GameChg":
        for (let groupid of data.groupList) {
          if (groupid == localStorage.getItem("groupid")) {
            localStorage.setItem("isEnd", false);
            this.setState({ year: data.year, phase: data.phase }, () => {
              this.updateProgressBar();
              this.setStars();
            });
          }
        }
        break;
      case "EndGame":
        this.setStars();
        break;
      default:
        break;
    }
  };
  componentDidMount() {
    this.setState({
      year: Number.parseInt(localStorage.getItem("year")),
      phase: Number.parseInt(localStorage.getItem("phase")),
    });
    // this.updateProfileInfo();
    this.setStars();
    this.updateProgressBar();
    socket.removeEventListener("message", this.checkMessage);
    socket.addEventListener("message", this.checkMessage);
  }
  render() {
    return (
      <div id="profile">
        <div id="topBar">
          {/* <img src={Arrow_left} onClick={this.props.togglePortfolioComp} alt="back_arrow" /> */}
          <div></div>
          <p className="pageTitle">Profile</p>
          <Time />
        </div>
        <div id="main">
          <div id="circle">
            <div id="progress" className="progress-0"></div>
            <PieChart width={200} height={200} style={{ position: "absolute" }}>
              <defs>
                <linearGradient
                  id="myGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="2.98%" stopColor="#223F80" />
                  <stop offset="26.65%" stopColor="#444584" />
                  <stop offset="101.79%" stopColor="#A43936" />
                </linearGradient>
              </defs>
              <Pie
                data={[
                  { name: "awf", value: this.state.pieValue },
                  {
                    name: "awf",
                    value: 100 - this.state.pieValue,
                  },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={82.5}
                outerRadius={92.5}
                startAngle={90}
                endAngle={-450}
              >
                <Cell
                  style={{ outline: "none", border: "none" }}
                  fill={"url(#myGradient)"}
                  stroke="none"
                  key={1}
                />
                <Cell
                  style={{ outline: "none", border: "none" }}
                  fill={"transparent"}
                  stroke="none"
                  key={2}
                />
                {/* <Label
                  content={
                    <this.CustomLabel
                      labelText="year"
                      value={this.state.year}
                    />
                  }
                  position="center"
                /> */}
              </Pie>
            </PieChart>
            <p id="title">Year</p>
            <p id="yearNum">{this.state.year}</p>
          </div>
          <div className="badgeRow">
            <img className="starHolder" alt="star" />
            <img className="starHolder" alt="star" />
            <img className="starHolder" alt="star" />
          </div>
          <div className="badgeRow">
            <img className="starHolder" alt="star" />
            <img className="starHolder" alt="star" />
            <img className="starHolder" alt="star" />
            <img className="starHolder" alt="star" />
          </div>
          <div id="card">
            <div id="empty"></div>
            <div id="emptyCard2"></div>
            <div id="reward">
              <img
                id="mainImg"
                src={reward}
                alt="reward"
                onClick={this.toShare}
              />
              {/* <button id="share">
                <img src={share} alt="share" />
                <p>Share</p>
              </button> */}
            </div>
          </div>
          <p id="desc">Will unlock once all the badges have been collected</p>
          <div id="options">
            <div
              className="option"
              onClick={() =>
                setTimeout(
                  () => this.props.toggleMainDisplay("portfolio"),
                  this.triggerDelay
                )
              }
              value="portfolio"
            >
              <img src={Coin} className="animate" alt="coin" />
              <img src={pie_chart} alt="portfolio logo" />
              <p>Portfolio</p>
            </div>
            <hr />

            <div
              className="option"
              id="team"
              onClick={() =>
                setTimeout(
                  () => this.props.toggleMainDisplay("team"),
                  this.triggerDelay
                )
              }
              value="team"
            >
              <img src={Coin} className="animate" alt="coin" />
              <img src={white_group} alt="team logo" />
              <p>Team</p>
            </div>

            <hr />
            <div
              className="option"
              onClick={() => setTimeout(() => this.logout(), this.triggerDelay)}
            >
              <img src={Coin} className="animate" alt="coin" />
              <img src={Vector} alt="logout logo" />
              <p>Logout</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
ProfileComp.propTypes = {
  navigate: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
  toggleMainDisplay: PropTypes.func.isRequired,
};
export default WithRouter(ProfileComp);
