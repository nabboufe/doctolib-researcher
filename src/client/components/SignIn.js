import React from 'react';
import Button from './Button';
import Field from './Field';

import { Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';

var mappedFields = {
    "9": "username",
    "10": "password",
}

class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "redirect": null,
            "username": '',
            "password": '',
            "fail": '',
        }
    }

    redirectToRegister = () => {
        this.setState({
            redirect: "/register",
        });
    }
    redirectToHomepage = () => {
        this.setState({
            redirect: "/",
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        await fetch('/signin', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                username,
                password
            }),
        })
        .then(async (res) => {
            res = await res.json();
            console.log(res);
            if (res.connection === 'success') {
                this.redirectToHomepage();
            } else {
                console.log('fail');
                this.setState({
                    fail: "Wrong username or password, please try again"
                });
                console.log(this.state.fail);
            }
        })
        .catch((err) => console.log(err));
    }

    handleChange = (field, newValue) => {
        this.setState({
            [mappedFields[field]]: newValue,
        });
    }
        
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        return (
            <div className="center">
                <h1>Sign In</h1>

                <div className="left">
                    
                    <Button
                        onClick={this.redirectToRegister}
                        hide={!!Cookie.get('loggedIn')}
                    >
                        Register
                    </Button>
                    &nbsp;&nbsp;
                    
                    <Button
                        onClick={this.redirectToHomepage}
                        hide={!!Cookie.get('loggedIn')}
                    >
                        Homepage
                    </Button>

                </div>

                <br/><br/>
                <Field
                    fieldLabel="Username"
                    fieldType="text"
                    fieldName="username"
                    fieldValue={this.state.username}
                    handleChange={this.handleChange}
                    className=""
                    required
                />
                <Field
                    fieldLabel="Password"
                    fieldType="password"
                    fieldName="password"
                    fieldValue={this.state.hide}
                    handleChange={this.handleChange}
                    className=""
                    required
                />

                <button
                    onClick={this.handleSubmit}
                    id="search-button"
                >
                    Connection
                </button>

                <div className="center">{this.state.fail}</div>

            </div>
        );
    }
}

export default SignIn;
