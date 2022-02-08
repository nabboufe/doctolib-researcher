import React from 'react';
import Result from './Result';

class Research extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "htmlCode": '', 
        }
    }

    getResearch = async () => {
        const id = localStorage.getItem('uuid');

        console.log(id);
        var res = await fetch('/getResearch', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });

        var ret = await res.json();
        return ret;
    }

    componentDidMount = async () => {
        var tmp = await this.getResearch();

        tmp.forEach(async (elem) => {
            elem.keyword = elem.keyword.split('|');
            console.log(elem.keyword, elem.keyword[0].length);
            await this.setState({
                "htmlCode": [
                    ...this.state.htmlCode,
                    <div 
                        className="research-wrapper"
                        key={elem.imgUrl}
                    >
                        { <Result profile={elem} /> }
                    </div>
                ]
            })
        })
    }

    render() {
        return (
            <div id="result" className="researchCenter">
                {this.state.htmlCode}
            </div>
        );
    }
}

export default Research;
