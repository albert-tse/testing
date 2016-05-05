import React from 'react'

class Article extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var article = this.props.article;
        if (!article) {
            return <div />
        }

        return (
            <div id="proto">
                <div className={this.getClassName()} data-id="{article.ucid}" data-client-id="{article.client_id}">
                    <div className="edit-article">
                        <h2>Edit Article</h2>
                        <form onsubmit="return false">
                            <div className="utm-tags input-group">
                                <label className="input-group-addon">UTM Tag</label>
                                <input className="small-12 columns form-control" name="utm" placeholder="&utm_article=abc" pattern="(\?|\&)([^=]+)\=([^\&]+)" />
                            </div>
                        </form>
                        <div className="tags">
                            <a className="update-article highlight-on-hover tag">Done</a>
                        </div>
                    </div>
                    <div className="article content radius">
                        <div className="post">
                            <img className="th" src="" data-src="{article.image}" onError="this.onerror=null;this.src='images/logo.svg';">
                            <div className="ctr-group" style="width: 100%; height: 3px; position: relative; margin-top: 5px; background: transparent;">
                                <div className="ctr_60_min_mean" style="height: 100%; left:0; background-color: #B2DFDB; bottom:0; position:absolute;"></div>
                                <div className="ctr_60_min" style="height: 100%; left:0; background-color: #26A69A; bottom:0; position:absolute;"></div>
                            </div>
                        </div>
                        <div className="postText" data-equalizer-watch>
                            <h6 className="client">
                                {this.showStatsIcon()}
                                <a className="info highlight-on-hover" ucid="{article.ucid}">
                                        <i className="fa fa-info-circle fa-lg"></i>
                                    </a>
                                    <span className="date" rawDate="{article.timestamp}">{article.timeAgo} by </span>
                                    <span className="sitename">{article.site} {article.score && 'rated ' + article.score}</span>
                                </h6>
                            <h5 className="title highlight-on-hover">
                                    {article.title}
                                    <a className="url" target="_blank" href="{article.url}">
                                        <i className="fa fa-external-link highlight-on-hover"></i>
                                    </a>
                                </h5>
                            <p className="desc">{article.description}</p>
                            <p className="social">{this.showShared()}</p>
                        </div>
                        <div className="tags">
                            <div className="related left-tag tag">
                                <a className="highlight-on-hover">Related</a>
                            </div>
                            {this.showPerformance()}
                            <div className="edit-utm tag highlight-on-hover hide-internal_influencer-role hide-external_influencer-role">
                                <a className="highlight-on-hover">Edit</a>
                            </div>
                            <div className="share tag highlight-on-hover">
                                <div className="btn-group">
                                    <a type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="highlight-on-hover">Share</a>
                                    <ul className="dropdown-menu">
                                        <li><a className="social-btn" data-platform="Facebook" data-url data-ucid><i className="fa fa-facebook"></i> Facebook</a></li>
                                        <li><a className="social-btn" data-platform="Twitter" data-url data-ucid><i className="fa fa-twitter"></i> Twitter</a></li>
                                        <li><a className="social-btn" data-platform="Tumblr" data-url data-description data-title data-ucid><i className="fa fa-tumblr"></i> Tumblr</a></li>
                                        <li><a className="social-btn" data-platform="Pinterest" data-url data-image data-description data-ucid><i className="fa fa-pinterest"></i> Pinterest</a></li>
                                        <li><a className="social-btn" data-platform="Google +" data-url data-ucid><i className="fa fa-google-plus"></i> Google+</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    getClassName() {
        var default = "grid-item article";
        var article = this.props.article;
        
        return default.concat([
            'saved' in article ? 'saved' : 'not-saved',
            'shared' in article ? 'shared' : 'not-shared',
            'enabled' in article ? 'enabled' : 'disabled'
        ].filter(Boolean)).join(' ');
        // post.toggleClass('disabled', ('enabled' in elem && 'length' in elem.enabled && elem.enabled[0] === '0') || !('enabled' in elem)); // disable article if '0' or is not set
    }

    showStatsIcon() {
        var article = this.props.article;

        if ('stats' in article) {
            return <div />;
        }

        return;
    }

    showShared() {
        var article = this.props.article;

        if (article.shared && article.length > 0) {
            return <div />;
        }
        
        return;
    }
    
    showPerformance() {
        var article = this.props.article;

        if ('performance' in article) {
            return <div className="performance tag"></div>;
        }

        return;
        // Show performance stats
        /*
        var performance = posts[i].fields.stat_type_95 * 100;
        if (performance > 0) {
            var label = 'bad';
            if (performance < 6) {
                label = 'average';
            } else if (performance < 13) {
                label = 'good';
            } else if (performance >= 13) {
                label = 'very good';
            }
            post.find('.performance').text(label).addClass(label.replace(' ', '-'));
            post.find('.performance').removeClass('hidden');
        }
        */
    }
}

export default Article;
