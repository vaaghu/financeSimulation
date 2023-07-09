import React from "react";
import PropTypes from "prop-types";

import "@assets/styles/stocks.scss";
// import Alarmclock from "@assets/images/Alarmclock.svg";
import Coin from "@assets/images/coin.svg";
// import Gain from "@assets/images/gain.svg"
import AssetsCompCommon from "@components/assestsCompCommon";
import Time from "@components/time";
import formatCurrencyValue from "@utils/formatCurrencyValue";
class StocksComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cash: localStorage.getItem("cash"),
      stockList: [],
      mutualFundList: [],
      commodityList: [],
      content: [],
    };
  }
  toggleStatusButton = (e) => {
    let target = e
      ? e.currentTarget
      : document.querySelector("#statusButton").children[0];
    let buttons = document.querySelector("#statusButton").children;
    Array.from(buttons).forEach((button) => {
      button.style.color = "rgba(34, 63, 128, 0.5)";
      button.style.borderBottomColor = "rgba(34, 63, 128, 0.4)";
    });
    target.style.color = "#223F80";
    target.style.borderBottomColor = "#223F80";
    let content;
    switch (target.getAttribute("value")) {
      case "stock":
      default:
        content = this.state.stockList;
        break;
      case "mutualFund":
        content = this.state.mutualFundList;
        break;
      case "commodities":
        content = this.state.commodityList;
        break;
    }
    this.setState({ content: content });
  };
  fetchList = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "invest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupid: localStorage.getItem("groupid") }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState(data, () => {
          this.toggleStatusButton();
        });
      });
  };
  componentDidMount() {
    this.fetchList();
  }
  render() {
    {
      console.log(this.state);
    }
    return (
      <div id="stocks">
        <div id="topBar">
          <div>
            <img className="coin" src={Coin} alt="coin" />
            <p className="cashCount">{formatCurrencyValue(this.state.cash)}</p>
          </div>
          <p className="pageTitle">Buy/Sell</p>
          <Time />
        </div>
        <div id="main">
          <div id="stockInfo">
            <div id="marquee">
              {JSON.parse(localStorage.getItem("isRunning")) ? (
                this.state.content.map((element, index) => {
                  // console.log(element,index)
                  return (
                    <div key={index}>
                      <p>
                        {element.name} | {element.price} |
                      </p>
                      {element.diff > 0 && (
                        <a className="gain">{element.diff}%</a>
                      )}
                      {element.diff < 0 && (
                        <a className="loss">{element.diff}%</a>
                      )}
                    </div>
                  );
                })
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div id="about">
            <div id="statusButton">
              <button onClick={this.toggleStatusButton} value="stock">
                Stocks
              </button>
              <button onClick={this.toggleStatusButton} value="mutualFund">
                Mutual fund
              </button>
              <button onClick={this.toggleStatusButton} value="commodities">
                Commodities
              </button>
            </div>
          </div>
          <div id="content">
            {JSON.parse(localStorage.getItem("isRunning")) ? (
              this.state.content.map((asset, index) => {
                // console.log(element,index)
                return (
                  <AssetsCompCommon
                    key={asset.id}
                    id={asset.id}
                    name={asset.name}
                    holdings={asset.holdings}
                    price={asset.price}
                    diff={asset.diff}
                    position={index % 2 === 0 ? "top" : "bottom"}
                    toggleMainDisplay={this.props.toggleMainDisplay}
                  />
                );
              })
            ) : (
              <p> GAME PAUSED </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
StocksComp.propTypes = {
  toggleMainDisplay: PropTypes.func.isRequired,
};
export default StocksComp;
