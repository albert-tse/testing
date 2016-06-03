import React from 'react';
import moment from 'moment';
import Styles from './styles';
// import PlaceholderImage from '../../../../images/logo.svg'; Browserify+svgify returns an error because get() is deprecated
import SaveButton from './SaveButton.component';
import MenuButton from './MenuButton.component';

/**
 * Article Component
 * @prop int key is going to be used by React to manage a collection of this component
 * @prop Object data describes one article
 * @return React.Component
 */
export default class Article extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSelected: false
        };
    }

    componentWillUnmount() {
        this.state.isSelected && this.props.deselected(this.props.data.ucid);
    }

    render() {
        var article = this.props.data;
        var classNames = [
            Styles.article,
            this.state.isSelected && Styles.selected
        ].filter(Boolean).join(' ');

        return (
            <div id={ 'article-' + article.ucid } className={classNames} data-ucid={article.ucid} onClick={::this.onClick}>
                <div className={Styles.articleContainer}>
                    <div className={Styles.thumbnail}>
                        <img src={article.image} onError={::this.showPlaceholder} />
                    </div>
                    <div className={Styles.metadata}>
                        <span className={Styles.site}>{article.site_name}{/*article.site_rating*/}</span>
                        <time className={Styles.timeAgo} datetime={moment(article.creation_date).format()}>{this.formatTimeAgo(article.creation_date)}</time>
                    </div>
                    <h1 className={Styles.headline}><a href={article.url} target="_blank">{article.title}</a></h1>
                    <p className={Styles.description}>{typeof article.description === 'string' && article.description.substr(0,200)}...</p>
                    <div className={Styles.actions}>
                        <SaveButton ucid={article.ucid} />
                        <MenuButton ucid={article.ucid} />
                    </div>
                </div>
            </div>
        );
    }

    showPlaceholder(evt) {
        // evt.currentTarget.src = PlaceholderImage;
        evt.currentTarget.className = Styles.noImage;
    }

    formatTimeAgo(date) {
        var differenceInDays = moment().diff(date, 'days');
        var timeAgo = moment(date).fromNow(true);

        if (7 < differenceInDays && differenceInDays < 365) {
            timeAgo = moment(date).format('MMM D');
        } else if (/years?/.test(timeAgo)) {
            timeAgo = moment(date).format('MMM D YYYY');
        }

        return timeAgo;
    }

    onClick() {
        this.state.isSelected ? this.props.deselected(this.props.data.ucid) : this.props.selected(this.props.data.ucid);
        this.setState({
            isSelected: !this.state.isSelected
        });
    }

}

export const Buttons = {
    RELATED: 'Related',
    SHARE: 'Share',
    MORE: 'More'
};
