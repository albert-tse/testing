import React from 'react';
import { Container, Header, Drawer, Main } from '../shared';
import { Article, Buttons } from '../shared/Article.component';
import HeaderActions from '../../actions/Header.action';


class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        HeaderActions.setTitle('Saved');
    }

    render() {
        return (
            <div id="articles-container" className="container">
                <div className="row">
                    {this.props.articles.map(::this.renderArticle)}
                </div>
            </div>
        );
    }

    renderArticle(article, index) {
        return (
            <Article key={index} data={article} 
                buttons={[ 
                    {
                        type: Buttons.RELATED
                    }, 
                    {
                        type: Buttons.SHARE,
                        action: this.props.share
                    }
                ]} />
        );
    }
}

Saved.defaultProps = {
    title: "Saved"
};

export default Saved;
