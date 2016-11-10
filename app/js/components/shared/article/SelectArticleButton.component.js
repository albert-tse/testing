import React, { Component, PropTypes } from 'react';
import { IconButton } from 'react-toolbox';
import { selectArticleButton } from './styles';

export default class SelectArticleButton extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.onClick = this.props.onClick;
    }

    render() {
        return (
            <IconButton 
                className={selectArticleButton}
                icon={this.props.checked ? 'check_circle' : 'radio_button_unchecked'}
                onClick={this.onClick}
            />
        );
    }
}

SelectArticleButton.propTypes = {
    checked: PropTypes.bool,
    onClick: PropTypes.func
};
