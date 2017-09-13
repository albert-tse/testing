import React from 'react'
import map from 'lodash/map'
import filter from 'lodash/filter'
import {
    compose,
    withHandlers,
    withProps,
    withStateHandlers
} from 'recompose'
import {
    Button,
    Dialog,
    List,
    ListItem
} from 'react-toolbox'

import SearchBox from '../../searchbox'
import styles from './styles.save-to-list-button'

class SaveToListDialog extends React.Component {

    static propTypes = {
        active: React.PropTypes.bool.isRequired,
        lists: React.PropTypes.array.isRequired,
        onCreateList: React.PropTypes.func.isRequired,
        onEscKeyDown: React.PropTypes.func,
        onListSelected: React.PropTypes.func.isRequired,
        onOverlayClick: React.PropTypes.func
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.lists !== nextProps.lists) {
            this.props.updateLists(nextProps.lists)
        }
    }

    render() {
        const { props } = this

        return (
            <Dialog
                theme={props.styles}
                title={null}
                active={props.active}
                onOverlayClick={props.onOverlayClick}
                onEscKeyDown={props.onEscKeyDown}
            >
                <header className={props.styles.searchBox}>
                    <SearchBox
                        onChange={props.filterLists}
                        onClear={props.filterLists}
                        onPressEnter={props.onPressEnter}
                    />
                </header>
                <List theme={props.styles} ripple selectable>
                    {props.filteredLists.length > 0 ? map(props.filteredLists, list => (
                        <ListItem
                            key={list.list_id}
                            caption={list.list_name}
                            theme={props.styles}
                            rightIcon="playlist_add"
                            onClick={props.onListSelected(list.list_id)}
                        />
                    )) : (
                        <p className={props.styles.ctaToCreateNewList}>Hit <strong>Enter</strong> to create a new list</p>
                    )}
                </List>
            </Dialog>
        )
    }
}

export default compose(
    withProps({styles}),
    withStateHandlers(props => ({
        filteredLists: props.lists
    }), {

        filterLists: (state, props) => keywords => {
            const filteredLists = filter(props.lists, list => list.list_name.toLowerCase().includes(keywords))
            return { filteredLists }
        },

        updateLists: (state, props) => updatedLists => {
            return { filteredLists: props.lists }
        }

    }),
    withHandlers(props => ({

        onListSelected: props => listId => evt => {
            evt.stopPropagation()
            props.filterLists('')
            props.onListSelected(listId)
        },

        onPressEnter: props => listName => {
            if (props.filteredLists.length > 0) {
                props.onListSelected(props.filteredLists[0].list_id)
            } else {
                props.onCreateList(listName)
            }
            props.filterLists('')
        }

    }))
)(SaveToListDialog)
