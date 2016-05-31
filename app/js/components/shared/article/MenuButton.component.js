import React, { Component } from 'react';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox';
import Styles from './styles';

export default class MenuButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <IconMenu className={Styles.primaryColor} icon="more_vert" position="bottom-right" menuRipple>
                <MenuItem value="share-google-plus" caption="Share on Google+" icon={<i className='fa fa-google-plus'></i>} />
                <MenuItem value="share-pinterest" caption="Share on Pinterest" icon={<i className='fa fa-pinterest'></i>} />
                <MenuItem value="share-tumblr" caption="Share on Tumblr" icon={<i className='fa fa-tumblr'></i>} />
                <MenuItem value="share-twitter" caption="Share on Twitter" icon={<i className='fa fa-twitter'></i>} />
                <MenuItem value="share-facebook" caption="Share on Facebook" icon={<i className='fa fa-facebook'></i>} />
                <MenuItem value="share-link" caption="Copy Link" icon="link" />
                <MenuDivider />
                <MenuItem value="related-stories" caption="Related Stories" icon="more" />
            </IconMenu>
        );
    }
}
