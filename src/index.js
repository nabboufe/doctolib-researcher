import ReactDOM from 'react-dom';
import React from 'react';
import Cookie from 'js-cookie';
import uuid from 'react-uuid';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Research from './client/components/Research';
import Field from './client/components/Field';
import Result from './client/components/Result';
import Button from './client/components/Button';
import Register from './client/components/Register';
import SignIn from './client/components/SignIn';
import ProtectedRoute from './client/components/ProtectedRoute';
import Profile from './client/components/Profile';
import logOut from './client/components/logOut';
import './client/style/style.css';

var mappedFields = {
    "1": "locationValue",
    "2": "activityValue",
    "5": "howManyProfiles",
};

var activityList = [
    'Psychologue',
    'Cardiologue',
];

var locationList = [
    'Lyon',
    'Paris',
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "locationValue": 'lyon',
            "activityValue": 'psychologue',
            "howManyProfiles": '1',

            "apiReturn": [],
            "Result": [],

            "redirect": null,
        }
    }
    
    redirectToRegister = () => {
        this.setState({
            redirect: "/register"
        });
    }
    redirectToSignIn = () => {
        this.setState({
            redirect: '/signIn',
        });
    }

    redirectToProfile = () => {
        this.setState({
            redirect: '/profile'
        });
    }

    handleChange = (field, newValue) => {
        this.setState({
            [mappedFields[field]]: newValue,
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        var index = 0;
        var queryNumber = Number(document.getElementById('profileNumber').value);
        const location = document.getElementById('location').value;
        const activity = document.getElementById('activity').value;
        const researchID = uuid();

        if (queryNumber > 5) {
            queryNumber = 5;
        }
        while (index < queryNumber) {

            await fetch('/doct', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location,
                    activity,
                    index,
                    researchID,
                })
            })
            .then(async res => {
                await res.json()
                .then(async (tmp) => {
                    console.log("AH:", tmp);
                    await this.setState({
                        "apiReturn": [...this.state.apiReturn, tmp],
                        "Result": [...this.state.Result,
                            <div className="result-wrapper">
                                {<Result profile={tmp} />}
                            </div>],
                    })
                })
            })
            .catch(err => console.log(err));

            index = index + 1;
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        return (
            <div className="mainContainer">
                <div className="center">

                    <h1>Doctolib Researcher</h1>

                    <div className="left">

                        <Button
                            onClick={this.redirectToRegister}
                            hide={!!Cookie.get('loggedIn')}
                        >
                            Register
                        </Button>
                        {!Cookie.get('loggedIn') ? <span>&nbsp;&nbsp;</span> : ''}
                        <Button
                            onClick={this.redirectToSignIn}
                            hide={!!Cookie.get('loggedIn')}
                        >
                            Sign-in
                        </Button>

                        <Button
                            onClick={this.redirectToProfile}
                            hide={!Cookie.get('loggedIn')}
                            className="profile-button"
                        >
                            Profile
                        </Button>
                        {!!Cookie.get('loggedIn') ? <span>&nbsp;&nbsp;</span> : ''}
                        <Button
                            onClick={logOut}
                            hide={!Cookie.get('loggedIn')}
                            className="profile-button"
                        >
                            Log-Out
                        </Button>

                    </div>

                    <form>
                        <br/><br/>
                        <Field.List
                            listLabel="Domaine d'activité: "
                            fieldName="activity"
                            fieldValue={this.state.activityValue}
                            handleChange={this.handleChange}
                            className="one"
                            itemList={activityList}
                        />
                        <Field.List
                            listLabel="Lieux d'exercice: "
                            fieldName="location"
                            fieldValue={this.state.locationValue}
                            handleChange={this.handleChange}
                            className="two"
                            itemList={locationList}
                        />
                        <Field
                            fieldLabel="Nombre de profils à chercher: "
                            fieldType="text"
                            fieldName="profileNumber"
                            fieldValue={this.state.howManyProfiles}
                            handleChange={this.handleChange}
                            className="five"
                            defaultValue="1"
                        />
                        <button
                            onClick={this.handleSubmit}
                            id="search-button"
                        >
                            Submit
                        </button>
                    </form>
                    <br/>

                    <div id="results">
                        {this.state.Result}
                    </div>

                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Route exact path="/">
                <App />
            </Route>
            <ProtectedRoute
                exact path="/register"
                hideToUser={true}
                hideToVisitor={false}
                component={(props) => <Register />}
                url="/"
            />
            <ProtectedRoute
                exact path="/signIn"
                hideToUser={true}
                hideToVisitor={false}
                component={(props) => <SignIn />}
                url="/"
            />
            <ProtectedRoute
                exact path="/profile"
                hideToUser={false}
                hideToVisitor={true}
                component={(props) => <Profile />}
                url="/"
            />
            <ProtectedRoute
                exact path="/research"
                hideToUser={false}
                hideToVisitor={true}
                component={(props) => <Research />}
                url="/"
            />
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
