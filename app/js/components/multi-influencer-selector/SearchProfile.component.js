import React from 'react';
import { compose, pure, withHandlers } from 'recompose';
import { Icon, Input } from 'antd';

/**
 * Allows user to filter out profiles that doesn't match the set of keywords
 * entered in the search box
 * @param {object} props
 * @param {string} keywords to match profiles against
 * @param {function} onChange is called to update the value of input
 * @param {function} onClearKeywords is used to reset keywords state
 * @return {JSX}
 */
function SearchProfile({
    keywords,
    onChange,
    onClearKeywords
}) {
    return (
        <div className="extra-padding">
            <Input
                onChange={onChange}
                placeholder="Search profiles"
                prefix={<Icon type="search" />}
                suffix={keywords.length > 0 ? <Icon type="close-circle" onClick={onClearKeywords} /> : null}
                value={keywords}
            />
        </div>
    );
}

/**
 * Update value of keywords search term
 * @param {object} props the Input component's properties
 * @param {Event} evt emitted from input field
 * @param {HTMLElement} evt.target the Element the user typed in
 * @param {string} evt.target.value the search keywords/name of profile the user typed
 * @return {function}
 */
function onChange (props) {
    return function (evt) {
        const { value } = evt.target;
        props.searchProfiles(value);
    };
}

/**
 * Clear value in keywords attribute
 * @param {object} props the Input component's properties
 * @param {object} props
 * @param {function} props.setKeywords function to change state of keywords
 * @return {function}
 */
function onClearKeywords(props) {
    return function (evt) {
        props.searchProfiles('');
    };
}

export default compose(
    withHandlers({ onChange, onClearKeywords }),
    pure
)(SearchProfile);
