import Field from './Field';
import React from 'react';
import { Redirect } from 'react-router-dom';
import Button from './Button';
import Cookie from 'js-cookie';

var mappedFields = {
    "6": "firstName",
    "7": "lastName",
    "8": "email",
    "9": "username",
    "10": "password",
    "11": "passwordCheck",
}

class Register extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            "fail": '',

            "firstName": '',
            "lastName": '',
            "email": '',
            "username": '',
            "password": '',
            "passwordCheck": '',

            "passCheckEqual": false,
            "passLength": false,
            "passIncNumber": false,
            "passIncLowLetter": false,
            "passIncUpLetter" : false,
            "usernameAvailable": false,
            "emailAvailable": false,
            "redirect": null,
        }
    }
    
    isLowerCase = (str) => str === str.toLowerCase() && str !== str.toUpperCase();
    isUpperCase = (str) => str === str.toUpperCase() && str !== str.toLowerCase();
    isNumber    = (str) => str >= '0' && str <= '9';

    checkForPassword = (pass, check) => {
        var number = false;
        var minLetter = false;
        var capLetter = false;
        
        if (pass !== check) {
            return -1;
        }

        for (var char of pass) {
            if (this.isLowerCase(char)) minLetter = true;
            if (this.isUpperCase(char)) capLetter = true;
            if (this.isNumber(char)) number = true;
        }

        return [number, minLetter, capLetter];
    }

    handleChange = async (field, newValue) => {
        this.setState({
            [mappedFields[field]]: newValue,
        });
        if (mappedFields[field] === 'username') {
            const username = document.getElementById('username').value;

            await fetch('/userExistence', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            })
            .then(async res => {
                try {
                    res = await res.json();
                    this.setState({ usernameAvailable: false });
                    console.log(res);
                } catch {
                    this.setState({ usernameAvailable: true });
                }
            })
            .catch((e) => {
                console.log(e);
            })
        } else if (mappedFields[field] === 'email') {
            const email = document.getElementById('email').value;

            await fetch('/checkEmail', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            .then(async res => {
                try {
                    res = await res.json();
                    this.setState({ emailAvailable: false });
                } catch {
                    this.setState({ emailAvailable: true });
                }
            })
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const passwordCheck = document.getElementById('passwordCheck').value;

        if (!firstName || !lastName || !email || !username
                || !password || !passwordCheck) {
            console.log("Missing element in form, can't submit.");
            return ;
        } const checkPass = this.checkForPassword(password, passwordCheck);
        
        if (checkPass === -1) {
            return ;
        } else if (checkPass.filter((e) => e === false).length > 0) {
            return ;
        } if (password.length < 8) {
            return ;
        } if (this.state.usernameAvailable === true
                && this.state.emailAvailable === true) {
            await fetch('/register', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    username,
                    password
                }),
            })
            .then(async (res) => {
                res = await res.json();
                console.log(res);
                if (res.userCreated === 'yes') {
                    this.redirectToSignIn();
                } else if (res.userCreated === 'no') {
                    this.setState({
                        fail: "An error occured, please try again, "
                        + "if this happen again, please contact the dev."
                    });
                } else if (res.userCreated === 'alreadyExists') {
                    this.setState({
                        fail: "Email or username already used,"
                        + "please change and try again."
                    });
                }
            })
            .catch(async (res) => {
                await res.json();
                console.log(res);
            })
        }
    }
    
    redirectToHomepage = () => {
        this.setState({
            redirect: '/',
        });
    }
    redirectToSignIn = () => {
        this.setState({
            redirect: '/signIn',
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        return (
            <div className="center">
                <h1>Sign-up</h1>
                
                <div className="left">

                    <Button 
                        onClick={this.redirectToHomepage}
                        hide={!!Cookie.get('loggedIn')}
                    >
                        Homepage
                    </Button>
                    &nbsp;&nbsp;

                    <Button
                        onClick={this.redirectToSignIn}
                        hide={!!Cookie.get('loggedIn')}
                    >
                        Sign-in
                    </Button>

                </div>

                <br/><br/>
                <Field
                    fieldLabel="First name: "
                    fieldType="text"
                    fieldName="firstName"
                    fieldValue={this.state.firstName}
                    handleChange={this.handleChange}
                    className=""
                    required
                />
                <Field
                    fieldLabel="Last name: "
                    fieldType="text"
                    fieldName="lastName"
                    fieldValue={this.state.lastName}
                    handleChange={this.handleChange}
                    className=""
                    required
                />
                <Field
                    fieldLabel="Email: "
                    fieldType="text"
                    fieldName="email"
                    fieldValue={this.state.email}
                    handleChange={this.handleChange}
                    className=""
                    pattern=".+\@.+\.com"
                    required
                />
                <Field
                    fieldLabel="Username: "
                    fieldType="text"
                    fieldName="username"
                    fieldValue={this.state.username}
                    handleChange={this.handleChange}
                    className=""
                    required
                />
                <Field
                    fieldLabel="Password: "
                    fieldType="password"
                    fieldName="password"
                    fieldValue={this.state.password}
                    handleChange={this.handleChange}
                    className=""
                    minlength="8"
                    required
                />
                <Field
                    fieldLabel="Confirm password: "
                    fieldType="password"
                    fieldName="passwordCheck"
                    fieldValue={this.state.passwordCheck}
                    handleChange={this.handleChange}
                    className=""
                    minlength="8"
                    required
                />

                <button
                    onClick={this.handleSubmit}
                    id="search-button"
                >
                    Send
                </button>

                <div className="center">{this.state.fail}</div>

            </div>
        );
    }
}

export default Register;
