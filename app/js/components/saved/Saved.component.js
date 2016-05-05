import React from 'react';
import Article from '../shared/Article.component';


class Saved extends React.Component {

    constructor(props) {
        super(props);
        console.log('Saved props are: ', this.props);
    }

    render() {
        return (
        <div className="container-fluid row">
            <h1>Hi I am the saved component</h1>
            <div id="articles-container">
            {this.props.articles.map(function (article, index) {
                return <Article key={index} data={article} />;
            })}
            </div>
        </div>
        );
    }
}

export default Saved;
