import React, { Component, PropTypes } from 'react';
import { linkComponent } from './table.style';

const LinkComponent = props => (
    <div className={linkComponent}>
        <small>{props.site} &bull; <a href={props.shortlink} target="_blank">{'qklnk.co/' + props.hash}</a></small>
        <header>{props.title}</header>
        <footer>
            {props.fromNow} by {props.influencer} on {props.platform}
        </footer>
    </div>
);

export default LinkComponent;
