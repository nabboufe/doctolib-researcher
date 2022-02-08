import React from 'react';
import './Button.css';

const Button = (props) => {
    if (props.hide === true)
        return ('');
    return (
        <button
            className={props.className ? props.className : "Button" }
            id="sign-in-button"
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}


Button.Link = (props) => {
    if (props.hide === true)
        return ('');
    return ( 
        <button
            className="Button link"
            id="sign-up-button"
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}


export default Button;
