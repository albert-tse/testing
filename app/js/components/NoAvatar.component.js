import React, { Component, PropTypes } from 'react';
import { FontIcon } from 'react-toolbox';

const NoAvatar = props => (
    <FontIcon 
        style={{
            margin: 0,
            fontSize: '2.4rem',
            width: '4rem',
            height: '4rem',
            lineHeight: '4rem',
            background: '#FFA000'
        }}
        value='check'
    />
);

export default NoAvatar;
