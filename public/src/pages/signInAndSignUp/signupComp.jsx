import React from "react";
import PropTypes from "prop-types";
import coin from "@assets/images/coin.svg";
import Arrow_left from "@assets/images/backArrow.png";
import validator from "@utils/validator";
import { WithRouter } from "@components/routingWrapper";
class SignupComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPasswordError: "",
    };
  }
  // componentDidMount() {
  //   if (
  //     localStorage.getItem("userid") &&
  //     localStorage.getItem("groupid") == window.location.href.split("/").pop()
  //   )
  //     this.props.navigate("dashboard");

  //   let groupid = window.location.href.split("/").pop();
  //   localStorage.setItem("groupid", groupid);
  // }
  submit = () => {
    let formElements = document
      .querySelector(".form")
      .querySelectorAll("input");
    let obj = {};
    let error = {};
    let isError = false;
    formElements.forEach((element) => {
      obj[element.name] = element.value;
      error[`${element.name}Error`] = ``;
      if (element.value.trim() == "") {
        error[`${element.name}Error`] = `*This field is Required`;
        isError = true;
      }
    });
    console.log(error);
    let vali = validator({ name: "AAA", ...obj });
    for (let element in vali) {
      error[`${element}Error`] =
        vali[element] || error[`${element}Error`] != ""
          ? error[`${element}Error`]
          : `invalid ${element}`;
      isError = isError || !vali[element];
      if (element == "password") {
        error[`${element}Error`] = vali[element]
          ? ""
          : `*Password must contain a minimum of 8 characters including atleast an uppercase, a lowercase and a digit`;
      }
    }
    if (obj.password !== obj.confirmPassword) {
      error.confirmPasswordError = "Passwords don't match";
      isError = true;
    }
    this.setState(error);
    if (!isError) {
      delete obj.confirmPassword;
      fetch(
        import.meta.env.VITE_API_SERVER_URL + "signup/" + this.props.groupid,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(obj),
        }
      )
        .then(async (response) => {
          if (response.status == 200) {
            return response.json();
          } else {
            let data = await response.json();
            this.setState({ confirmPasswordError: data.msg });
            throw new Error();
          }
        })
        .then((data) => {
          localStorage.setItem("groupid", this.props.groupid);
          for (let i in data) {
            localStorage.setItem(i, data[i]);
          }
          if (!localStorage.getItem("minute"))
            localStorage.setItem("minute", 15);
          if (!localStorage.getItem("second"))
            localStorage.setItem("second", 0);
          this.props.navigate("../../");
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  };
  render() {
    return (
      <div id="login">
        <div id="portion1">
          <div id="description">
            <p>Sign Up</p>
            <p>to</p>
            <p>play</p>
          </div>
          <img src={coin} alt="coin" />
        </div>
        <div className="form">
          <input
            className="formInput"
            type="text"
            name="name"
            placeholder="Name"
          />
          <p className="error">{this.state.nameError}</p>
          <input
            className="formInput"
            type="text"
            name="mobile"
            placeholder="Mobile number"
          />
          <p className="error">{this.state.mobileError}</p>
          <input
            className="formInput"
            type="password"
            name="password"
            placeholder="Create Password"
          />
          <p className="error">{this.state.passwordError}</p>
          <input
            className="formInput"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
          />
          <p className="error">{this.state.confirmPasswordError}</p>
          <div>
            <button onClick={this.props.toggleInitPage}>
              <img src={Arrow_left} />
              Login
            </button>
            <button id="loginButton" onClick={this.submit}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }
}
SignupComp.propTypes = {
  toggleInitPage: PropTypes.func.isRequired,
  groupid: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
};
export default WithRouter(SignupComp);
