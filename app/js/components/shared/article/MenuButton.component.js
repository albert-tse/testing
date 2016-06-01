import React, { Component } from 'react';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox';
import Styles from './styles';

export default class MenuButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <IconMenu className={Styles.primaryColor} icon="more_vert" position="bottom-right">
                <MenuItem value="related-stories" caption="Related Stories" icon="more" />
                <MenuItem value="share-link" caption="Copy Link" icon="link" />
            </IconMenu>
        );
    }
}
