import React from 'react'
import { findDOMNode } from 'react-dom'
import connect from 'alt-utils/lib/connect'
import includes from 'lodash/includes'
import {
    Button,
    IconButton
} from '../../index'
import {
    List,
    ListCheckbox
} from 'react-toolbox'
import {
    compose,
    withHandlers,
    withStateHandlers,
    withProps
} from 'recompose'

import ListStore from '../../../stores/List.store'
import ListActions from '../../../actions/List.action'

import SearchBox from '../../searchbox'
import SaveToListDialog from './SaveToListDialog.component'

class SaveToListButton extends React.Component {

    render() {
        const props = this.props

        return (
            <div>
                <props.buttonComponent
                    icon={props.icon}
                    label={props.label}
                    title={props.title}
                    onClick={evt => {
                        evt.stopPropagation()
                        props.toggleLists()
                    }}
                />
                <SaveToListDialog
                    active={props.showLists}
                    lists={props.lists}
                    onCreateList={props.createList}
                    onEscKeyDown={props.toggleLists}
                    onListSelected={props.saveToList}
                    onOverlayClick={props.toggleLists}
                />
            </div>
        )
    }
}

export default compose(
    connect({

        listenTo(props) {
            return [ListStore]
        },

        reduceProps(props) {
            const writeableLists = ListStore.getWriteableLists()
            // TODO I want to mark the lists it's saved to as checked
            return {
                ...props,
                lists: writeableLists
            }
        }

    }),
    withStateHandlers({
        showLists: false
    }, {
        toggleLists: props => evt => {
            return { showLists: !props.showLists }
        }
    }),
    withHandlers({

        saveToList: props => listId => {
            ListActions.addToList({ articles: [props.ucid], list: listId })
            props.toggleLists()
        },

        createList: props => listName => {
            ListActions.createAndSaveToList({ listName, articles: [props.ucid] })
            props.toggleLists()
        }

    }),
    withProps(props => ({
        icon: "playlist_add",
        label: "Save to List",
        title: "Save to List",
        buttonComponent: props.isOnCard ? IconButton : Button
    }))
)(SaveToListButton)
