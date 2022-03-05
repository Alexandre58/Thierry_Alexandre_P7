import React from 'react';

//css
import "../style/footer.scss";



export const Footer = () => {
    return (
        <>
        <footer className="footer">
        <p className='p_footer'>&copy; 2022 groupomania.com</p>
            <div className='img_footer'>
       
                    <img src={require ("../images/icon.png") } alt="logo du site groupomania" />
            </div>
        </footer>

        </>
    );
};