import React, { useState } from "react";
import PropTypes from "prop-types";

import "@assets/styles/signupForm.scss";
import validator from "@utils/validator";

const FormLogin = ({ toggleMainDisplay }) => {
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
    passwordError: "",
    mobileError: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validator(Object.values(formData).slice(0, 3));
    if (formData.name.trim() === "") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        nameError: "*This field is required",
      }));
    } else {
      if (!isValid.name) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          nameError: "*Invalid name",
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          nameError: "",
        }));
      }
    }
    if (formData.password.trim() === "") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        passwordError: "*This field is required",
      }));
    } else {
      if (!isValid.password) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          passwordError:
            "*Password must contain a minimum of 8 characters including atleast an uppercase, a lowercase and a digit",
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          passwordError: "",
        }));
      }
    }

    if (formData.mobile.trim() === "") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        mobileError: "*This field is required",
      }));
    } else {
      if (!isValid.mobile) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          mobileError: "*Enter a valid mobile number",
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          mobileError: "",
        }));
      }
    }
    try {
      if (isValid.name && isValid.mobile && isValid.password) {
        console.log(window.location.href.split("/").pop());
        const response = await fetch(
          import.meta.env.VITE_API_SERVER_URL +
            "login/" +
            localStorage.getItem("groupid"),
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(
              Object.fromEntries(Object.entries(formData).slice(0, 3))
            ),
          }
        );
        console.log(response);
        if (response.ok) {
          const data = await response.json().then((data) => {
            console.log(data);
            for (let i in data) {
              localStorage.setItem(i, data[i]);
            }
          });
          toggleMainDisplay("dashboard", data);
        } else {
          setFormData((prevFormData) => ({
            ...prevFormData,
            passwordError: "*Incorrect Password or username",
          }));
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="error">{formData.nameError}</p>
      <input
        className="formInput"
        type="text"
        name="mobile"
        placeholder="Mobile number"
        value={formData.mobile}
        onChange={handleInputChange}
      />
      <p className="error">{formData.mobileError}</p>
      <input
        className="formInput"
        type="password"
        name="password"
        placeholder="Create Password"
        value={formData.password}
        onChange={handleInputChange}
      />
      <p className="error">{formData.passwordError}</p>
      <div>
        <button id="loginButton" type="submit">
          Login
        </button>
        <button id="loginButton" type="submit">
          Sign Up
        </button>
      </div>
    </form>
  );
};

FormLogin.propTypes = {
  toggleMainDisplay: PropTypes.func.isRequired,
};
export default FormLogin;