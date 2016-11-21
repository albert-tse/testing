import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Button, IconButton } from 'react-toolbox';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';
import { pick } from 'lodash';

import ListStore from '../../../stores/List.store';
import ListActions from '../../../actions/List.action';

import Styles from './styles.action-buttons';

class Contained extends Component {
    constructor(props) {
        super(props);
        this.toggleSaved = toggleSaved.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        const props = {
            icon: this.props.isSaved ? 'bookmark' : 'bookmark_border',
            label: this.props.isSaved ? 'Saved' : 'save',
            onClick: this.toggleSaved
        };

        return (
            <div >
                <Button className={Styles.normal} {...props} />
                <IconButton className={Styles.icon} {...props} />
            </div>
        );
    }
}

class ButtonOnCard extends Component {
    constructor(props) {
        super(props);
        this.toggleSaved = toggleSaved.bind(this);
    }

    render() {
        const className = classnames("onboardStep save-button", Styles.mini);
        return (
            <Button 
                className={className}
                label={this.props.isSaved ? 'Saved' : 'Save'}
                onClick={this.toggleSaved}
                primary
            />
        );
    }
}

export default class SaveButton extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                actions={ ListActions }
                stores={{
                    isSaved: props => ({
                        store: ListStore,
                        value: ListStore.isSaved(this.props.ucid)
                    }),
                    isRecentlySaved: props => ({
                        store: ListStore,
                        value: ListStore.isRecentlySaved(this.props.ucid)
                    })
                }}
            >
                {this.props.isOnCard ? <ButtonOnCard {...this.props} /> : <Contained { ...this.props } />}
            </AltContainer>
        );
    }
}

const toggleSaved = function (evt) {
    var { ucid, isSaved, removeFromSavedList, addToSavedList } = this.props;
    isSaved ? removeFromSavedList([ucid]) : addToSavedList([ucid]);
    return evt.stopPropagation();
}
