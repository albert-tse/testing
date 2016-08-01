import React from 'react';
import { overlay, active, loading } from './styles';
import classnames from 'classnames';

export default class Loading extends React.Component {

    constructor(props) {
        super(props);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.state = {
            isActive: false,
            isShowing: false
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.show !== nextProps.show ||
           (this.props.show && this.state.isActive !== nextState.isActive)) {
            nextProps.show ? this.show() : this.hide();
        }
    }

    render() {
        const { isActive, isShowing } = this.state;
        const className = classnames(
            overlay,
            isActive && active,
            isShowing && loading
        );

        return (
            <div className={className}>
                <span>
                    <i className="material-icons">refresh</i>
                </span>
            </div>
        );
    }

    show() {
        this.setState({ isActive: true }, () => setTimeout(() => {
            this.setState({ isShowing: true });
        }, oneFrame));
    }

    hide() {
        this.setState({ isShowing: false }, () => setTimeout(() => {
            this.setState({ isActive: false })
        }, animationDuration));
    }
}

// TODO Set these as proptypes with default settings
const oneFrame = 17; // milliseconds
const animationDuration = 200; // milliseconds
