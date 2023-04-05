import React from "react";
import AssetsComp from "./assetComp";

export default class AssetsViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetsList: [],
      currentActiveAssetButton: "0",
    };
  }
  displayList = () => {};
  toggleAssetSection = (e) => {
    let assetButtons = document.querySelector("#top").children;
    let currentActiveAssetButton = "0";
    if (e != undefined) {
      currentActiveAssetButton = e.currentTarget.getAttribute("value");
    }
    assetButtons[this.state.currentActiveAssetButton].style.borderBottomColor =
      "#8492B3";
    assetButtons[currentActiveAssetButton].style.borderBottomColor = "#223F80";
    let displayList = [];
    switch (currentActiveAssetButton) {
      case "1":
        displayList = this.state.mutualFund;
        break;
      case "2":
        displayList = this.state.commodity;
        break;
      case "0":
      default:
        displayList = this.state.stock;
    }
    this.setState({
      currentActiveAssetButton: currentActiveAssetButton,
      assetsList: displayList,
    });
  };
  fetchList = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "getAssets", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState(data, () => {
          // console.log(this.state);
          this.toggleAssetSection();
        });
      });
  };
  componentDidMount() {
    this.fetchList();
  }
  render() {
    return (
      <div id="assets" className="section">
        <div id="top">
          <button value="0" onClick={this.toggleAssetSection}>
            Stocks
          </button>
          <button value="1" onClick={this.toggleAssetSection}>
            Mutual funds
          </button>
          <button value="2" onClick={this.toggleAssetSection}>
            Commodities
          </button>
        </div>
        <div id="editMainSection">
          {this.state.assetsList.map((assets, index) => {
            return (
              <AssetsComp key={assets.id} index={index + 1} info={assets} />
            );
          })}
        </div>
      </div>
    );
  }
}