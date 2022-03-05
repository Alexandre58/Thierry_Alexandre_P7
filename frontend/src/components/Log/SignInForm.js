import React from "react";
import { useState } from "react";
import { Typography } from "@material-ui/core";
import "../../style/SignInForm.scss";
import axios from "axios";

const SignInForm = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = e => {
    e.preventDefault();
    const email_regex = /^(?!\s*$).+/;
    //*******************  REGEX PASSWORD
    const password_regex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{4,}$/;
    
  

    const testEmail = email_regex.test(email);
    const testPassword = password_regex.test(password);

    const passwordError = document.getElementById("passwordError");
    const emailError = document.getElementById("emailError");
    
    if(testEmail === false || testPassword === false) {
            if(testEmail === false){
              emailError.innerHTML = "Email incorrect";
            }
            if(testPassword === false) {
              passwordError.innerHTML = "Le mot de passe doit contenir une majuscule , un caractére spécial";
            }


    }else {

           emailError.innerHTML = "";
           passwordError.innerHTML = "";
                  /*`http://localhost:4000/api/user/login`*/
          axios({
            url: `${process.env.REACT_APP_API_URL}/api/user/login`,
            method: "post",
            withCredentials: true,
            data: {
              password: password,
              email: email,
            },
          })
            .then(res => {
              console.log(res);
              if (res.data.errors) {
                passwordError.innerHTML = res.data.errors.password;
                emailError.innerHTML = res.data.errors.email;
              } else {
                window.location = "/profil";
              }
            })
            .catch(err => {
              console.log(err);
            });
        };


    }


  return (
    <>
      <div className="login_components">
        <Typography variant="h2" className="h2login">
          Se connecter
        </Typography>

        <form action="" onSubmit={handleLogin} className="form_login">
          <label htmlFor="password">Password</label>
          <input
            className="btnType"
            type="password"
            name="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            placeholder="mot de passe"
            required
          />
          <div id="passwordError"></div>

          <label htmlFor="email">Email</label>
          <input
            className="btnType"
            type="email"
            name="email"
            id="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            placeholder="exemple@groupomania.com"
            required
          />
          <div id="emailError"></div>

          <input type="submit" className="btnLogin" value="Se connecter" />
        </form>
      </div>
    </>
  );
};

export default SignInForm;
