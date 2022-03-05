import React, { useState } from "react";
import "../../style/SignupForm.scss";
import axios from "axios";
import { Typography } from "@material-ui/core";
const SignUpForm = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const bio = "";
  const handleRegister = async (e) => {
    e.preventDefault();
    const email_regex =
    /^(?!\s*$).+/;
    //*******************  REGEX PASSWORD
    const password_regex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{4,}$/;


    const testPassword = password_regex.test(password);
    const testEmail = email_regex.test(email);
    const passwordError = document.getElementById("passwordError");
    const emailError = document.getElementById("emailError");

    // const firstnameError = document.querySelector(".firstname.error");
    // const lastnameError = document.querySelector(".lastname.error");
    //   const passwordError = document.querySelector(".password.error");
    //  const confirmPasswordError = document.querySelector(
    //    ".confirmPassword.error"
    //  );
    //  const emailError = document.querySelector(".email.error");

    // confirmPassword.innerHTML = "";

    let data = {
      firstname,
      lastname,
      password,
      confirmPassword,
      email,
      bio,
    };
    if (testEmail === false || testPassword === false) {
      if (testEmail === false) {
        emailError.innerHTML = "Email incorrect";
      }
      if (testPassword === false) {
        passwordError.innerHTML = "Le mot de passe doit contenir une majuscule , un caractére spécial";
      }
    } else {
      axios({
        method: "post",
        url: `http://localhost:4000/api/user/sign-up`,
        data: {
          firstname,
          lastname,
          password,
          confirmPassword,
          email,
          bio,
        },
      })
        .then((res) => {
          //  console.log(data);

          axios({
            url: `${process.env.REACT_APP_API_URL}/api/user/login`,
            method: "post",
            withCredentials: true,
            data: {
              password: password,
              email: email,
            },
          })
            .then((res) => {
       
                window.location = "/profil";
              
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="signup_components">
      <Typography variant="h2" className="h2signup">
        S'inscrire
      </Typography>

      <form action="" onSubmit={handleRegister} className="form_signup">
        <label htmlFor="firstname">Prenom</label>
        <input
          className="btnType"
          type="text"
          name="firstname"
          id="firstname"
          placeholder="Votre prenom"
          required
          onChange={(e) => setFirstname(e.target.value)}
          value={firstname}
        />
        <div className="firstname error"></div>

        <label htmlFor="lastname">Nom</label>
        <input
          className="btnType"
          type="text"
          name="lastname"
          id="lastname"
          placeholder="Votre nom"
          required
          onChange={(e) => setLastname(e.target.value)}
          value={lastname}
        />
        <div className="lastname error"></div>
        
        <label htmlFor="email">Email</label>
        <input
          className="btnType"
          type="email"
          name="email"
          id="email"
          placeholder="exemple@groupomania.com"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div id="emailError"></div>

        <label htmlFor="password">Password</label>
        <input
          className="btnType"
          type="password"
          name="password"
          id="password"
          placeholder="mot de passe"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div id="passwordError"></div>

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          className="btnType"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          placeholder="confirmer le mot de passe"
          required
        />
        <div className="passwordError"></div>

      

        <button type="submit" className="btnSignup">
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
