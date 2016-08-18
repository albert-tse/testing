import React, { Component } from 'react';
import { widget, widgetWrapper } from './cards.style';

export default class Widget extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { label, value } = this.props;

        return (
            <div className={widget}>
                <div className={widgetWrapper}>
                    <h1>{label}</h1>
                    { /string|number|boolean/.test(typeof value)
                        ? <strong>{value == false ? '-- --' : value}</strong>
                        : value 
                    }
                </div>
            </div>
        );
    }
}
