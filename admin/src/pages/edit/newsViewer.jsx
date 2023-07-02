import React from "react";
// import PropTypes from "prop-types";
import NewsComp from "@components/newsComp";
export default class NewsViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newsList: [],
    };
  }
  fetchNewsList = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "news", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        let newsList = [];
        data.forEach((news, index) => {
          newsList.push(<NewsComp info={news} key={index} />);
        });
        this.setState({ newsList: newsList });
      });
  };
  componentDidMount() {
    this.fetchNewsList();
  }
  render() {
    {
      console.log(this.state);
    }
    return (
      <div id="news" className="section row-1">
        {this.state.newsList.map((news) => {
          return news;
        })}
      </div>
    );
  }
}