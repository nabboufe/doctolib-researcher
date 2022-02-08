import React from 'react';
import Cookie from 'js-cookie';
import { Redirect, Link } from 'react-router-dom';

import logOut from './logOut';
import Button from './Button';
import '../style/style.css';


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "htmlCode": '',
            "username": Cookie.get('loggedIn'),
            "redirect": '',
        };
    }

    componentDidMount = async () => {
        this.getUserProfile();
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    
    handleLink(uuid) {
        localStorage.clear('uuid');
        localStorage.setItem('uuid', uuid);
    }

    getUserProfile = async () => {
        await fetch('/userProfile', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(async res => {
            res = await res.json();
            var researchIDs = res.map((e) => e.researchID);
            var uniqueResearch = researchIDs.filter(
                this.onlyUnique
            );

            res.sort((e) => e.researchID);
            uniqueResearch.forEach((e) => {
                var value = res.find(res => res.researchID === e);
                var html = 
                    <div className="research" key={e}>
                        <Link
                            to={{
                                pathname: "/research",
                                query: { id: e }
                            }}
                            onClick={this.handleLink(e)}
                        >
                            Activité: {value.activity}&nbsp;
                            | Lieux: {value.location}&nbsp;
                            | Nombre de profiles:&nbsp;
                            {(res.filter(elem => 
                                (elem.researchID === e))).length}
                        </Link>
                    </div>;
                this.setState({
                    "htmlCode": [...this.state.htmlCode, html]
                });
            });
        });

        return null;
    }

    redirectToHomepage = () => {
        this.setState({
            "redirect": '/',
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        return (
            <div className="mainContainer">
                <div className="center">
                    <h1>Profile page of {this.state.username}</h1>
                    
                    <div className="left">

                        <Button
                            onClick={this.redirectToHomepage}
                            hide={!Cookie.get('loggedIn')}
                        >
                            Homepage
                        </Button>

                        <Button
                            onClick={logOut}
                            hide={!Cookie.get('loggedIn')}
                            className="profile-button"
                        >
                            Log-Out
                        </Button>

                    </div><br/><br/>
                    
                    <div>
                        { this.state.htmlCode }
                    </div>

                </div>
            </div>
        );
    }
}

export default Profile;
