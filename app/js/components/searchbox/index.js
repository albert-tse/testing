import React from 'react'
import { findDOMNode } from 'react-dom'
import connect from 'alt-utils/lib/connect'
import delay from 'lodash/delay'
import {
    compose,
    pure,
    withHandlers,
    withProps,
    withStateHandlers
} from 'recompose'
import {
    Icon,
    Input
} from 'antd'

import { View } from '../../components'
import styles from './styles'

class SearchBox extends React.PureComponent {

    static propTypes = {
        onChange: React.PropTypes.func,
        onClear: React.PropTypes.func,
        placeholder: React.PropTypes.string
    }

    static defaultProps = {
        placeholder: '',
        searchBoxId: "saveToListDialog__searchBox"
    }

    componentDidMount() {
        const searchBoxElement = findDOMNode(this).querySelector(`#${this.props.searchBoxId}`)
        if (searchBoxElement instanceof HTMLInputElement) {
            delay(() => searchBoxElement.focus(), 500)
        }
    }

    render() {
        const { props } = this

        return (
            <View className={props.styles.searchbox}>
                <Input
                    id={this.props.searchBoxId}
                    className={props.styles.input}
                    onChange={props.onKeywordChange}
                    onPressEnter={props.onPressEnter}
                    placeholder={props.placeholder}
                    prefix={<Icon type="search" />}
                    suffix={props.keywords.length > 0 ? <Icon type="close-circle" onClick={props.onClearKeywords} /> : null}
                    value={props.keywords}
                />
            </View>
        )
    }
}

export default compose(
    withProps({
        styles
    }),
    withStateHandlers({
        keywords: ''
    }, {

        /**
         * Reset the search box by clearing the keywords
         * @param {object} props component props
         * @param {event} evt Click event that called this function
         * @return {object} new state with keywords blank
         */
        clearKeywords: (state, props) => evt => {
            if (props.onClear) {
                props.onClear(evt, {keywords: props.keywords})
            }

            return { keywords: '' }
        },

        /**
         * Updates the text stored in the keywords
         * and calls a callback function specified by the parent component if it exists
         * @param {object} props component props
         * @param {string} newKeywords content of the keywords box as user typed into it
         * @return {object} new state with keywords entered by the user
         */
        updateKeywords: (state, props) => newKeywords => {
            if (props.onChange) {
                props.onChange(newKeywords)
            }

            return { keywords: newKeywords }
        }
    }),
    withHandlers({

        onClearKeywords: props => evt => {
            props.clearKeywords()
        },

        onPressEnter: props => evt => {
            if (props.onPressEnter) {
                props.onPressEnter(props.keywords)
            }
        },

        onKeywordChange: props => evt => {
            props.updateKeywords(evt.target.value)

        }

    })
)(SearchBox)
