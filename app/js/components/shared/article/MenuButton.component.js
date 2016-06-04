import React, { Component } from 'react';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox';
import Styles from './styles';
import History from '../../../history'
import Config from '../../../config'
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';

export default class MenuButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <IconMenu className={Styles.primaryColor} icon="more_vert" position="bottom-right" onClick={::this.stopPropagation}>
                <MenuItem value="related-stories" caption="Related Stories" icon="more" onClick={::this.onRelated} />
                <MenuItem value="share-link" caption="Copy Link" icon="link" onClick={::this.onCopy} />
            </IconMenu>
        );
    }

    onRelated() {
        History.push(Config.routes.related.replace(':id',this.props.ucid));
    }

    onCopy() {
        LinkActions.generateLink(this.props.ucid);
    }

    stopPropagation(evt) {
        console.log(evt);
        evt.stopPropagation();
    }
}
