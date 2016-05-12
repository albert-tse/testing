import React from 'react';
//import { Article } from '../shared/Article.container';


class ArticleContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        //{JSON.stringify(this.props.article)}
        return (<pre>{JSON.stringify(this.props.article)}</pre>);
    }
}

/*Saved.defaultProps = {
    title: "Saved"
};*/

export default ArticleContainer;
