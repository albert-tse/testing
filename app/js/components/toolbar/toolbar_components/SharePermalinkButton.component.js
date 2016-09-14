import React, { Component } from 'react';
import Container from 'alt-container';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { IconButton } from 'react-toolbox';
import Dialog from '../../shared/Dialog.component';
import Store from '../../../stores/Filter.store';
import Actions from '../../../actions/Filter.action';
import Style from './styles.share-permalink-button';

export default class SharePermalinkButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container
                component={Contained}
                store={Store}
                transform={ ({ permalink }) => ({permalink}) }
            />
        );
    }
}

class Contained extends Component {

    constructor(props) {
        super(props);

        this.actions = [
            {
                className: Style.primary,
                label: 'COPY THE PERMALINK',
                onClick: Actions.copyPermalink
            }
        ];
    }

    shouldComponentUpdate(nextProps) {
        return this.props.permalink !== nextProps.permalink;
    }

    render() {
        console.log(this.props.permalink);
        return (
        	<div title="Get Permalink">
            	<IconButton icon="share" onClick={Actions.sharePermalink} />
                <span className="toolbarLabel">Get Shareable Permalink</span>
                <Dialog 
                    active={this.props.permalink.stories > 0}
                    actions={this.actions}
                    content={
                        <div>
                            <p>Permalink successfully generated for {this.props.permalink.stories} posts</p>
                            <a className={Style.shortlink} href={this.props.permalink.shortened} target="_blank">{this.props.permalink.shortened}</a>
                        </div>
                    }
                    toggleHandler={Actions.copyPermalink}
                />
            </div>
        );
    }

}
