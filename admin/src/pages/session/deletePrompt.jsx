import React from "react";
import PropTypes from "prop-types";
import deleteIcon from "@assets/images/delete.png";
import close from "@assets/images/cross.svg";
export default class DeletePrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.type == "session" ? "deleteSession" : "deleteGroup",
    };
  }
  deleteSession = () => {
    let obj = {};
    this.props.type == "session"
      ? (obj.sessionid = this.props.id)
      : (obj.groupid = this.props.id);
    let target = document.querySelector("#deletePrompt").querySelector("input");
    if (target.value == this.props.name) {
      target.style.borderColor = "black";
      fetch(
        import.meta.env.VITE_API_SERVER_URL +
          (this.props.type == "session" ? "deleteSession" : "deleteGroup"),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(obj),
        }
      ).then((response) => {
        if (response.status == 403 || response.status == 401) {
          this.props.setItem({ isAuth: false });
          throw new Error("unAuth");
        }
        if (response.status == 200) {
          this.props.toggleDeletePromp(false);
        }
      });
    } else {
      target.style.borderColor = "red";
    }
  };
  componentDidMount() {
    document.querySelector("#deletePrompt").querySelector("input").focus();
  }
  render() {
    return (
      <div id="deletePrompt">
        <div id="deleteBox">
          <div id="first">
            <p>Delete {this.props.type + " " + this.props.name}</p>
            <button
              id="closeButton"
              onClick={() => this.props.toggleDeletePromp(true)}
            >
              <img src={close} alt="" />
            </button>
          </div>
          <hr />
          <div id="second">
            <img src={deleteIcon} alt="" id="deleteIcon" />
            <p>
              The excel sheet cannot be recovered once the session is deleted
            </p>
          </div>
          <hr />
          <div id="third">
            <p>
              To confirm, type {'"' + this.props.name + '"'} in the box below
            </p>
            <input type="text" />
            <button id="deleteButton" onClick={this.deleteSession}>
              <p>Delete this Session</p>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

DeletePrompt.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  toggleDeletePromp: PropTypes.func.isRequired,
  setItem: PropTypes.func.isRequired,
  getItem: PropTypes.func.isRequired,
};
