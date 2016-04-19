import React from 'react';
import SignInButton from './components/SignInButton.react';


var Branding = React.createClass({
    render() {
        return (
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle Navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/#">
                    <img alt="Content Portal" src="favicon.ico" />
                </a>
            </div>
        );
    }
});

var Navigation = React.createClass({
    render() {
        return (
            <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav">
                    <li>
                        <a href="/#/explore">Explore</a>
                    </li>
                    <li>
                        <a href="/#/my-stats">My Stats</a>
                    </li>
                </ul>
                <form action className="navbar-form navbar-right">
                    <div className="btn-group">
                        <button className="btn btn-default active">
                            <span className="glyphicon glyphicon-th"></span>
                        </button>
                        <button className="btn btn-default">
                            <span className="glyphicon glyphicon-th-list"></span>
                        </button>
                    </div>
                    <div className="btn-group">
                        <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Mark All Articles
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-right">
                            <li>
                                <a href="/#?mark-articles=enabled">Enabled</a>
                            </li>
                            <li>
                                <a href="/#?mark-articles=disabled">Disabled</a>
                            </li>
                        </ul>
                    </div>
                    <div id="search" className="input-group">
                        <span className="input-group-addon" id="search-addon">
                            <span className="glyphicon glyphicon-search"></span>
                        </span>
                        <input type="text" className="form-control" placeholder="Search" aria-describedby="search-addon" />
                    </div>
                    <SignInButton />
                </form>
            </div>
        );
    }
});

export { Branding, Navigation };
