import React from 'react';
import AltContainer from 'alt-container';
import Article from '../shared/article/Article.container';
import ListStore from '../../stores/List.store';
import ListActions from '../../actions/List.action';


export default class List extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ListActions.getSavedList();
    }

    render() {
        return (
            <AltContainer store={ListStore}
                render={ props => <h1>{props.specialLists.saved}</h1> }
                />
        );
    }

    /*
    render() {
        if (this.props.list.isLoading) {
            return (
                <div id="articles-container" className="container">
                    <div className="row">
                        Loading....
                    </div>
                </div>
            );
        } else {
            return (
                <div id="articles-container" className="container">
                    <div className="row">
                        { _.map(this.props.list.articles, ::this.renderArticle)}
                    </div>
                </div>
            );
        }
    }

    renderArticle(article, index) {
        return (<Article key = { index } article={ article } />);
    }
    */
}
