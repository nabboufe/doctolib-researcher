import React from 'react';
import '../style/style.css';

const Result = (props, {...rest}) => {
    console.log(props);
    return (
        <div className="wrapper research">
            <div className="metadata">
                <div className="bio">
                    
                    <div className="profilePhoto">
                        <img
                            className="photo"
                            src={props.profile.imgUrl}
                            alt="profile"
                        />
                    </div>

                    <div className="profileName">
                        <p>
                            <a
                                href={props.profile.url}
                            >
                                {props.profile.name}
                            </a>
                        </p>
                    </div>

                    <div className="keywords">
                        {(props.profile.keyword[0].length > 0) ?
                        <ul className="keys" key={props.profile.url}>
                            {props.profile.keyword.map((e) => 
                                <li
                                    key={`${e + Math.random()}`}
                                >
                                    {e}
                                </li>
                            )}
                        </ul> :
                        <ul className="keys" key="no-items">
                            <li key="no-item">Pas de mot clé</li>
                        </ul>}
                    </div>

                </div>

                <div className="practicals">
                    
                    <div className="cards">
                        <ul key="isAvailable">
                            <li key="vitale">Carte vitale :</li>
                            <li key="bank">Carte bancaire :</li>
                        </ul>
                    </div>

                    <div className="reachInfo">
                        <p>Adresse: {props.profile.address}</p>
                        {props.profile.number.length > 6 ?
                            <p>Numéro de téléphone: {props.profile.number}</p>
                            : <p>Numéro de téléphone: Pas de numéro renseigné</p>}
                    </div>

                </div>

            </div>

            <div className="description">
                <p>{props.profile.presText}</p>
            </div>

        </div>
    );
}

export default Result;
