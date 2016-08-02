import React from 'react';
import AltContainer from 'alt-container';
import AppStore from '../../stores/App.store';
import { ProgressBar } from 'react-toolbox';
import { indicator, loading } from './styles';
import classnames from 'classnames';

export default class Loading extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={Component}
                store={AppStore}
                transform={props => ({show: props.showLoading})}
            />
        );
    }
}

class Component extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { show } = this.props;
        const className = classnames(
            indicator,
            show && loading
        );

        return <ProgressBar className={className} mode="indeterminate" />;
    }
}
