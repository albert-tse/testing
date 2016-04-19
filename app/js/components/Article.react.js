import React from 'react';

import ArticleAction from '../actions/Article.action';
import moment from 'moment';

class Article extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
        var article = this.props.data;
        console.log(article.fields);
        return (
            <li id={article.id} className="feed-item not-saved not-shared" data-client-id="34" data-site-id="637" data-link_type="2">
                <div className="content">
                    <div className="post">
                        <img className="th loaded" alt src={article.fields.image} />
                        <div className="network">
                            <i className="icon-facebook" data-id="2"></i>
                            <i className="icon-twitter" data-id="1"></i>
                            <i className="icon-googleplus" data-id="7"></i>
                            <i className="icon-pinterest" data-id="6"></i>
                            <i className="icon-tumblr" data-id="3"></i>
                        </div>
                    </div>
                    <div className="postText">
                        <h6 className="client">
                            <a className="info" data-ucid={article.fields.ucid}>
                                <i className="glyphicon glyphicon-info-sign"></i>
                            </a>
                            <span className="date" data-rawdate="2016-01-04T19:34:52Z"> {moment(new Date(article.fields.creation_date)).fromNow()} by </span>
                            <span className="sitename">The Verge</span>
                        </h6>
                        <h5 className="title highlight-on-hover">{`${article.fields.title} `}
                            <a className="url" target="blank" href={article.fields.url}>
                                <i className="glyphicon glyphicon-share highlight-on-hover"></i>
                            </a>
                        </h5>
                        <p className="desc">{!! article.fields.description ? `${article.fields.description[0].substr(0,180)}...` : 'No description'}</p>
                        <p className="social"></p>
                    </div>
                    <div className="utm-tags row collapse">
                        <div className="small-2 columns">
                            <label className="prefix">UTM</label>
                        </div>
                        <div className="small-10 columns">
                            <input placeholder="&amp;utm_article=abc" pattern="(\?|\&amp;)([^=]+)\=([^\&amp;]+)" data-ucid={article.fields.ucid} />
                        </div>
                    </div>
                    <div className="tags">
                        <div className="hidden performance tag"></div>
                        <div className="visibility toggle tag highlight-on-hover" data-id="200048">
                            <span className="toggle-disable">Disable</span>
                            <span className="toggle-enable">Enable</span>
                        </div>
                        <div className="edit-utm tag highlight-on-hover">
                            <span>Edit</span>
                        </div>
                    </div>
                    <div className="scrim not-saved"></div>
                </div>
            </li>
        );
	}
	
}

export default Article;
