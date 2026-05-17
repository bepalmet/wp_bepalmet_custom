/**
 * Import of backend
 */

import { GlobalContext } from '../backend';

/**
 * react dependencies
 */

import { useState, useContext, useMemo } from 'react';

/**
 * Wordpress dependencies
 */

import { __ } from '@wordpress/i18n';
import { ToggleControl, Button, Panel, PanelBody, PanelRow } from '@wordpress/components';
import clsx from 'clsx';

/**
 * local dependencies
 */

import LocationOrderDraggable from './LocationOrderDraggable';

/**
 * Render general settings page
 * 
 * Defines how the general settings page for opening-hours-settings should be rendered
 */

export default function GeneralSettings( 
    {
        editSettingById: editSettingById,
        ...props
    } 
) {
    props.className = clsx( props.className, "opening-hours-settings-toggle-locs" );
        
    const globalStates = useContext( GlobalContext );

    const getLocs = globalStates.locData.locs;
    const getSettings = globalStates.settingData.settings;

    function initLocations() {
        let locations = [];
        for ( let element of getLocs ) {
            locations.push( element );
        }
        return locations;
    }

    function initSettings() {
        let finalSettings = {};
        for ( let element of getSettings ) {
            const { setting_name, on_off, setting_values } = element;
            finalSettings[setting_name] = element;
            try {
                finalSettings[setting_name].setting_values = JSON.parse( setting_values );
            } catch ( e ) {
                if ( ! e instanceof SyntaxError ) {
                    throw new Error( e );
                }
            }
        }
        return finalSettings;
    }

    if ( !getLocs, !getSettings ) return;
    const locs = useMemo( () => initLocations(), [ getLocs ] );
    const settings = useMemo( () => initSettings(), [ getSettings ] );
    if ( !locs, !settings ) return;

    const [ toggleStates, setToggleStates ] = useState();

    const setting_values = settings.show_locations.setting_values;

    const ToggleLocation = ( { 
        location: location, 
        initState: initState, 
        ...props 
    } ) => {

        const locName = location.LocationName;

        function handleChange ( state ) {
            setting_values ??= [];
            if ( state ) {
                setting_values.push(locName);
            } else {
                const index = setting_values.indexOf(locName);
                setting_values.splice(index, 1);
            }
            setToggleStates( {
                ...toggleStates,
                [locName]: state
            } );
            const newSettings = editSettingById( 1, { newSettingValues: setting_values } );
            globalStates.refreshOne( "settings", newSettings );
        }

        return (
            <>
                <ToggleControl
                    __nextHasNoMarginBottom
                    label={ locName }
                    checked={ toggleStates[locName] }
                    onChange={ handleChange }
                    className={ clsx( props.className, "toggle-control" ) }
                />
            </>
        );


    }

    const ToggleAll = ( { 
        isDeselect: state = false, 
        ...props 
    } ) => {

        let newSettings;

        function handleChangeAll() {
            if ( state ) {
                newSettings = editSettingById( 1, { newSettingValues: [] } );
            } else {
                newSettings = editSettingById( 1, { newSettingValues: Object.keys( toggleStates ) } );
            }
            setToggleStates(prevStates => 
                Object.fromEntries(
                    Object.keys(prevStates).map(key => [key, state])
                )
            );
            globalStates.refreshOne( "settings", newSettings)
        }

        const allLabel = state ? __( "Deselect all", "bepalmet_custom" ) : __( "Select all", "bepalmet_custom" );

        return (
            <Button
                label={ allLabel }
                onClick={ handleChangeAll }
                className={ clsx( props.className, "all-button" ) }
            >
                { allLabel }
            </Button>
        );
    }

    const LocRow = ( { loc, show } ) => (
        <PanelRow 
            locName={ loc.LocationName }
        >
            <ToggleLocation 
                location={ loc } 
                initState={ show } 
                className={ clsx( props.className, "toggle-location" ) }
            />
        </PanelRow>
    );

    let locsTrue = [];
    let locsFalse = [];
    let locStates = {};
    for ( let loc of locs ) {
        if ( loc.LocationName === 'all' ) continue;
        if ( setting_values.includes( loc.LocationName ) ) {
            locsTrue.push( <LocRow loc={ loc } show={ true }/> );
            locStates[loc.LocationName] = true;
        } else {
            locsFalse.push( <LocRow loc={ loc } show={ false }/> )
            locStates[loc.LocationName] = false;
        }
    }
    if ( !toggleStates ) setToggleStates( locStates );

    return (
        <div 
            className={ clsx( props.className, "show-location" ) }
        >
            <Panel>
                <PanelBody
                    title={ __( "Shown locations in order", "bepalmet_custom" ) }
                    initialOpen={ locsTrue.length > 0 }
                >
                    <div 
                        className={ clsx( props.className, "drag-hint" ) }
                        title={ __( "Drag by holding click on an element and moving the mouse", "bepalmet_custom" ) }
                    >
                        { __( "You can change the order of the shown locations by draging them", "bepalmet_custom" ) }
                    </div>
                    <LocationOrderDraggable
                        settingsData={ settings }
                        editSettingById={ editSettingById }
                    >
                        { locsTrue }
                    </LocationOrderDraggable>
                    <ToggleAll 
                        isDeselect 
                        className={ clsx( props.className, "toggle-all" ) }
                    />
                </PanelBody>
            </Panel>
            <Panel>
                <PanelBody
                    title={ __( "Hidden locations", "bepalmet_custom" ) }
                    initialOpen={ locsFalse.length > 0 }
                    className={ clsx( props.className, "panel-body" ) }
                >
                    { locsFalse }
                    <ToggleAll 
                        className={ clsx( props.className, "toggle-all" ) }
                    />
                </PanelBody>
            </Panel>
        </div>
    );

}