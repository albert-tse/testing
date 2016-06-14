import React from 'react'
import { Link } from 'react-router'
import Config from '../../config'
import AuthStore from '../../stores/Auth.store'
import AuthActions from '../../actions/Auth.action'

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: AuthStore.getState()
        };
    }

    componentDidMount() {
        AuthStore.listen(this.onAuthChange.bind(this));
    }

    componentWillUnmount() {
        AuthStore.unlisten(this.onAuthChange.bind(this));
    }

    onAuthChange(authState) {
        var state = this.state;
        state.auth = authState;

        this.setState(state);
    }

    render() {
        return (
            <header id="header" className={"navbar navbar-fixed-top navbar-default " + (this.props.className ? this.props.className : '') }>
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link className="navbar-brand" to="/">
                            <strong>Contempo</strong>
                        </Link>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
