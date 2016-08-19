import React, { Component } from 'react';
import style, { widget, widgetWrapper } from './cards.style';

export default class Widget extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { label, value, caption } = this.props;

        return (
            <div className={widget}>
                <div className={widgetWrapper}>
                    <h1>{label}</h1>
                    { /string|number|boolean/.test(typeof value)
                        ? <strong>{value == false ? '-- --' : value}</strong>
                        : value 
                    }
                    <p className={style.caption}>{caption || ' '}</p>
                </div>
            </div>
        );
    }
}
