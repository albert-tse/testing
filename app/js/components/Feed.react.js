import React from 'react';
import FeedStore from '../stores/Feed.store';
import Article from '../components/Article.react';

class Feed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        FeedStore.listen(this.onChange.bind(this));
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        var articles;

        if ('hits' in this.state && this.state.hits.hit.length > 0) {
            articles = this.state.hits.hit.map((article) => {
                return <Article key={article.id} data={article} />;
            });
        };

        return (
            <div id="feed-container">
                <div className="cover"></div>
                <ul id="feed">
                    {articles}
                </ul>
            </div>
        );
    }

}

export default Feed;
