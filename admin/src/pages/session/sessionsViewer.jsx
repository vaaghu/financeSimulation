import React from "react";
import PropTypes from "prop-types";
import search from "@assets/images/Search.svg";
import add_round from "@assets/images/Add_round.svg";
import coin from "@assets/images/coin.svg";
import downIcon from "@assets/images/Download.svg";
import trash from "@assets/images/Trash.svg";
import empty_session from "@assets/images/empty_session.svg";

import DeletePrompt from "./deletePrompt";

export default class SessionsViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionsList: [],
      deleteSessionName: "",
      deleteSessionId: 0,
      DeletePrompDisplay: false,
    };
  }
  downloadFile = (id, title) => {
    const fileName = title + ".xlsx";
    const downloadUrl = import.meta.env.VITE_API_SERVER_URL + "download/" + id;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", fileName);
    fetch(downloadUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (response.status == 403 || response.status == 401) {
          this.props.setItem({ isAuth: false });
          throw new Error("unAuth");
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob(); // Assumes the response is a Blob (e.g., a file)
      })
      .then((blob) => {
        // Create a URL for the Blob data and trigger the download
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        link.click();

        // Clean up the URL object after the download is initiated
        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  displaySessions = (list) => {
    let container = document.querySelector("#sessionList");
    if (!container) return;
    if (container.replaceChildren) {
      container.replaceChildren();
    } else {
      container.innerHTML = "";
    }
    if (list.length > 0) {
      let card,
        nameDiv,
        coinIcon,
        name,
        infoDiv,
        groupBox,
        playerBox,
        groupLabel,
        playerLabel,
        groupInfo,
        playerInfo,
        excelDownload,
        deleteSession,
        deleteDiv,
        downloadDiv,
        downloadIcon;
      for (let session of list) {
        card = document.createElement("button");
        card.onclick = () => {
          localStorage.setItem("currentSessionName", session.title);
          localStorage.setItem("currentSessionID", session.sessionid);
          this.props.toggleSession("groupPage");
        };
        card.value = "groupPage";
        card.className = "sessionCards";
        nameDiv = document.createElement("div");
        nameDiv.id = "nameDiv";
        name = document.createElement("p");
        name.id = "name";
        coinIcon = document.createElement("img");
        coinIcon.src = coin;
        coinIcon.alt = "coin";
        nameDiv.appendChild(coinIcon);
        nameDiv.appendChild(name);

        infoDiv = document.createElement("div");
        infoDiv.id = "infoDiv";
        groupBox = document.createElement("div");

        playerBox = document.createElement("div");

        groupLabel = document.createElement("p");
        groupLabel.id = "groupLabel";
        groupLabel.innerText = "Groups";
        groupInfo = document.createElement("p");
        groupInfo.id = "groupInfo";
        playerLabel = document.createElement("p");
        playerLabel.id = "playerLabel";
        playerLabel.innerText = "Players";
        playerInfo = document.createElement("p");
        playerInfo.id = "playerInfo";
        groupBox.appendChild(groupLabel);
        groupBox.appendChild(groupInfo);

        playerBox.appendChild(playerLabel);
        playerBox.appendChild(playerInfo);

        excelDownload = document.createElement("button");
        downloadDiv = document.createElement("div");
        downloadDiv.id = "excel";
        downloadDiv.onclick = (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.downloadFile(session.sessionid, session.title);
        };
        downloadIcon = document.createElement("img");
        downloadIcon.src = downIcon;
        excelDownload.innerText = "download";
        excelDownload.appendChild(downloadIcon);
        excelDownload.style = "margin-left:50px;";
        deleteDiv = document.createElement("div");
        deleteDiv.id = "trash";
        deleteDiv.onclick = (event) => {
          event.stopImmediatePropagation();
          this.toggleDeletePromp(session.sessionid, session.title);
        };
        deleteSession = document.createElement("img");
        deleteSession.src = trash;
        deleteSession.id = "trash_icon";
        downloadDiv.appendChild(downloadIcon);
        deleteDiv.appendChild(deleteSession);
        infoDiv.appendChild(groupBox);
        infoDiv.appendChild(playerBox);
        infoDiv.appendChild(downloadDiv);
        infoDiv.appendChild(deleteDiv);
        card.appendChild(nameDiv);
        card.appendChild(infoDiv);

        name.innerText = session.title;
        groupInfo.innerText = session.groups;
        playerInfo.innerText = session.players;

        container.appendChild(card);
      }
    } else {
      let emptyDiv = document.createElement("div");
      emptyDiv.id = "emptySessionDiv";
      let illustration = document.createElement("img");
      illustration.src = empty_session;
      let p2 = document.createElement("p");
      p2.id = "emptySession2";
      p2.innerText = `No session yet, add new session by clicking the "create session" button.`;
      emptyDiv.appendChild(illustration);
      emptyDiv.appendChild(p2);
      container.appendChild(emptyDiv);
    }
  };
  toggleDeletePromp = (sessionid = 0, sessionName = "session name") => {
    let display = this.state.DeletePrompDisplay;
    display = !display;
    if (!display) this.fetchSessionsList();
    this.setState({
      DeletePrompDisplay: display,
      deleteSessionName: sessionName,
      deleteSessionId: sessionid,
    });
  };
  searchSession = (e) => {
    let list = this.state.sessionsList;
    if (e.currentTarget.value == "") {
      this.displaySessions(list);
    }
    let reg = new RegExp(e.currentTarget.value, "i");
    list = list.filter((session) => {
      return reg.test(session.title);
    });
    this.displaySessions(list);
  };
  fetchSessionsList = () => {
    fetch(import.meta.env.VITE_API_SERVER_URL + "sessions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (response.status == 403 || response.status == 401) {
          this.props.setItem({ isAuth: false });
          throw new Error("unAuth");
        }
        return response.json();
      })
      .then((data) => {
        this.displaySessions(data);
        this.props.setItem({ sessionsList: data });
        this.setState({ sessionsList: data });
      });
  };
  componentDidMount() {
    this.fetchSessionsList();
  }
  render() {
    return (
      <div id="sessionsViewer">
        {this.state.DeletePrompDisplay && (
          <DeletePrompt
            type="session"
            id={this.state.deleteSessionId}
            name={this.state.deleteSessionName}
            toggleDeletePromp={this.toggleDeletePromp}
          />
        )}
        <div id="top">
          <div id="searchDiv">
            <img src={search} alt="search icon" />
            <input type="text" id="searchBar" onInput={this.searchSession} />
          </div>
          <button
            id="create"
            onClick={this.props.toggleSession}
            value="createSessionPage"
          >
            <p>Session</p>
            <div id="add">
              <img src={add_round} alt="add" />
            </div>
          </button>
        </div>
        <div id="sessionList"></div>
      </div>
    );
  }
}
SessionsViewer.propTypes = {
  toggleSession: PropTypes.func.isRequired,
  setItem: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
};
