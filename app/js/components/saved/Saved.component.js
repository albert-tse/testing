import React from 'react';
import { Container, Header, Drawer, Main } from '../shared';
import { Article, Buttons } from '../shared/Article.component';


class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Header title={this.props.title} />
                <Drawer />
                <Main>
                    <div id="articles-container" className="container">
                        <div className="row">
                            {this.props.articles.map(::this.renderArticle)}
                        </div>
                    </div>
                </Main>
            </Container>
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
