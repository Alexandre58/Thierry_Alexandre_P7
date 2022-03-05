
import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const Log = (props) => {
    const [signUpModal, setSignUpModal] = useState(props.signup);
    const [signInModal, setSignInModal] = useState(props.signin);
    const handleModals = (e) => {
           if(e.target.id === "sign-up-form") {
               setSignInModal(false);
               setSignUpModal(true);
           } else if (e.target.id === "login") {
               setSignUpModal(false);
               setSignInModal(true);
           }

    }
    return (
        <div>
            <div>
                 <ul className='ul_liSignUpForm'>
                   <li onClick={handleModals} id="sign-up-form" className={signUpModal ? "active-btn" : null}>S'inscrire</li>
                   <li onClick={handleModals} id ="login" className={signInModal ? "active-btn" : null}>Se connecter</li>
                 </ul>
                 {signUpModal && <SignUpForm />}
                 {signInModal && <SignInForm />}
            </div>
        </div>
    );
};

export default Log;