import React from 'react';
import InfoBarAction from '../../actions/InfoBar.action.js';

class InfoBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false
        };
    }

    componentDidMount() {
        setTimeout(function () {
            console.log('I got called');
            console.log(this);
            this.setState({ show: true });
        }.bind(this), 5000);
    }

    render() {
        var classNames = [
            this.state.show && 'slide-in'
        ].filter(Boolean).join(' ');

        return (
            <aside id="info-bar" className={classNames}>
                <i className="fa fa-times" onClick={this.hide.bind(this)}></i>
                { this.renderInfo(this.state.article) }
            </aside>
        );
    }

    renderInfo(article) {
        if (article) {
            return (
                <div>
                    <h3 className="title">{article.title}</h3>
                    <h4 className="source">{article.source}</h4>
                    <div id="feedStats">
                        <table id="statsTable">
                            <tbody id="statsBody"></tbody>
                        </table>
                    </div>
                </div>
            );
        }
        else {
            return;
        }
    }

    hide() {
        this.setState({ show: false });
    }
}

export default InfoBar;
