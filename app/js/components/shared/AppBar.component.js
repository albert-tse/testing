import React from 'react';

class AppBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header id="header" className={::this.getClassName()}>
                <div className="mdl-layout-icon"></div>
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title">{this.props.title}</span>
                    <div className="mdl-layout-spacer"></div>
                </div>
            </header>
        );
    }

    getClassName() {
        return [
            'mdl-layout__header',
            'className' in this.props && this.props.className
        ].filter(Boolean).join(' ');
    }
}

AppBar.propTypes = {
    title: React.PropTypes.string
};

var createAppBar = function (props) {
    return React.createClass({
        render: function () {
            return <AppBar {...props} />
        }
    });
};

// This is where you can specify which components get loaded for each AppBar
const AppBars = {
    Explore: createAppBar({ title: 'Explore' }),
    Saved: createAppBar({ title: 'Saved' }),
    Settings: createAppBar({ title: 'Settings' }),
    Shared: createAppBar({ title: 'Shared' })
};

export default AppBars;
