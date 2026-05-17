/**
 * Import of backend
 */

import { GlobalContext } from '../backend';

import { __ } from '@wordpress/i18n';
import { Button, Draggable } from '@wordpress/components';

import { useState, useRef, useContext } from 'react';
import clsx from 'clsx';

const LocationOrderDraggable = ( {
    settingsData: settingsData,
    editSettingById: editSettingById,
    ...props
} ) => {
    if ( ! settingsData ) return;
    props.className = clsx( props.className, "locations-order" );
    const globalStates = useContext( GlobalContext );

    const [ locOrder, setLocOrder ] = useState( settingsData.locations_order.setting_values );

    const transferIdRef = useRef();
    let dragRef = useRef( new Map );
    const drag = dragRef.current;
    function setDrag( newValue ) {
        dragRef.current = newValue;
    }

    const createFinalLocs = () => {
        let orderedLocs = new Array( props.children.length );
        for ( let child of props.children ) {
            const index = locOrder.indexOf( child.props.loc.LocationName );
            if ( index >= 0 ) {
                orderedLocs[index] = child;
            } else {
                orderedLocs.push( child );
            }
        }
        return orderedLocs.filter( function() { return true } );
    }

    function dragOver(event) {
        const targetId = event.currentTarget.id;
        const sourceId = transferIdRef.current;
        if (targetId === sourceId) return;

        const keys = [...drag.keys()];
        const sourceIndex = keys.indexOf(sourceId);
        const targetIndex = keys.indexOf(targetId);
        if (sourceIndex < 0 || targetIndex < 0) return;

        const nextKeys = [...keys];
        if ( isBefore( targetId, transferIdRef.current, keys ) ) {
            nextKeys.splice( sourceIndex, 1 );
            nextKeys.splice( targetIndex, 0, transferIdRef.current );
        } else {
            nextKeys.splice( targetIndex, 1 );
            nextKeys.splice( sourceIndex, 0, targetId );
        }

        const newMap = new Map();
        nextKeys.forEach(key => newMap.set(key, drag.get(key)));
        setDrag(newMap);
        setLocOrder( [ ...newMap.keys() ] );
    }

    function dragStart(event) {
        const targetId = event.currentTarget.id;
        transferIdRef.current = targetId;
    }

    function dragEnd() {
        setLocOrder( [ ...drag.keys() ] );
        transferIdRef.current = undefined;
    }

    function isBefore( eventTarget, source, keys ) {
        if ( keys.indexOf( eventTarget ) < keys.indexOf( source ) ) {
            return true;
        } else {
            return false;
        }
    }

    let newDraggable = new Map();
    for ( let loc of createFinalLocs() ) {
        newDraggable.set( loc.props.loc.LocationName,
            <Draggable
                elementId={ loc.props.loc.LocationName }
                transferData={ {} }
                onDragStart={ dragStart }
                onDragEnd={ dragEnd }
            >
                { ( { onDraggableStart, onDraggableEnd } ) => (
                    <div
                        draggable
                        onDragStart={ onDraggableStart }
                        onDragOver={ dragOver }
                        onDragEnd={ onDraggableEnd }
                        className={ "draggable-container" }
                        id={ loc.props.loc.LocationName }
                    >
                        { loc }
                    </div>
                ) }
            </Draggable>
        );
    }
    setDrag( newDraggable );

    if( locOrder.length === 0 ){
        setLocOrder( [ ...newDraggable.keys() ] );
    }

    function saveClick() {
        const newSettings = editSettingById( 2, { newSettingValues: locOrder } );
        globalStates.refreshOne( "settings", newSettings );
    }

    return (
        <div
            className={ clsx( props.className, "order-wrap" ) }
        >
            <div
                className={ clsx( props.className, "draggables" ) }
            >
                { [ ...newDraggable.values() ] }
            </div>
            <Button
                variant='secondary'
                className={ clsx( props.className, "save-order" ) }
                onClick={ saveClick }
            >
                { __( "Save order", "bepalmet_custom" ) }
            </Button>
        </div>
    )
}

export default LocationOrderDraggable;