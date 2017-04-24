import React, { Component, PropTypes } from 'react';
import { linkComponent } from './table.style';

const LinkComponent = ({rowData}) => (
        <div className={linkComponent}>
            <small>{rowData.site} &bull; <a href={rowData.shortlink} target="_blank">{'qklnk.co/' + rowData.hash}</a></small>
            <header>{rowData.title}</header>
            <footer>
                {rowData.fromNow} by {rowData.influencer} on {rowData.platform}
            </footer>
        </div>
);

export default LinkComponent;
