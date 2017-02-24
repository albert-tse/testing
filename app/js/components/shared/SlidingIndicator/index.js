import React from 'react';
import Style from './styles';

const SlidingIndicator = props => {
    let percentage = parseFloat(props.percentage.toFixed(2)) * 100;
    
    return (
        <div className={Style.background}>
            <div
                className={Style.bar}
                style={{
                    width: percentage > 100 ? 100+'%' : percentage+'%'
                }}>
                <span className={Style.label}>{percentage+'%'}</span>
            </div>
        </div>
    );
}

export default SlidingIndicator;
