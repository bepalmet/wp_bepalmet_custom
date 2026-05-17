/**
 * Import of backend
 */

import { GlobalContext } from '../backend';

import clsx from 'clsx';

import {
    Navigator,
    useNavigator
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import { useState, useContext, useEffect } from 'react';

import EditOpeningHours from './EditOpeningHours';
import OpeningHoursTable from './OpeningHoursTable';

function EditSettingsScreenHandler( { settings: EditorSettings, ...props } ) {

    const {
        createTime,
        createInfo,
        createLocation,
        createSetting,
        editTime,
        editInfo,
        editLocation,
        editSetting,
        editTimeById,
        deleteTimeById,
        editInfoById,
        deleteInfoById,
        editLocationById,
        deleteLocationById,
        editSettingById,
        deleteSettingById,
        editContact
    } = EditorSettings;

    props.className = clsx( props.className, "bepalmet-custom" );

    let table = new OpeningHoursTable( { ...props } );
    let times = table.finalTimes;
    let infos = table.finalInfos;
    let locs = table.finalLocations;
    let settings = table.finalSettings;
    let contacts = table.finalContacts;

    let editLocs = {
        states: {},
        setStates: {}
    };

    const globalStates = useContext( GlobalContext );

    const MainScreen = () => {

        return (
            <>
                <Navigator.Screen 
                    path="/"
                >
                    <Navigator.Button 
                        path="/Edit"
                        className = { clsx( props.className, "navigator screen-button" ) }
                    >
                        Edit
                    </Navigator.Button>
                </Navigator.Screen>
            </>
        );
    };

    const TableScreen = () => {

        if ( typeof table.finalLocations !== 'object' ) {
            return;
        }
        return (
        <>
            <Navigator.Screen 
                path="/Edit/Table"
            >
                <Navigator.BackButton
                    className = { clsx( props.className, "navigator back-button" ) }
                >
                    Go Back
                </Navigator.BackButton>
                { table.finalTable }
            </Navigator.Screen>
        </>
        );
    }

    const LocationEditScreen = ( { location: location, ...props } ) => {
        return (
        <Navigator.Screen 
            path={ "/Edit/" + location.LocationName }
        >
            <Navigator.BackButton
                className = { clsx( props.className, "navigator back-button" ) }
            >
                Go Back
            </Navigator.BackButton>
            <EditOpeningHours 
                times={ times } 
                infos={ infos }
                locations={ locs }
                settings={ settings }
                contacts={ contacts }
                currentLocation={ location }
                LocationName={ location.LocationName } 
                LocationID={ location.LocationID } 
                editTimeById={ editTimeById }
                editInfoById={ editInfoById }
                editLocationById={ editLocationById }
                deleteTimeById={ deleteTimeById }
                deleteInfoById={ deleteInfoById }
                deleteLocationById={ deleteLocationById }
                createTime={ createTime }
                createInfo={ createInfo }
                createLocation={ createLocation }
                editSettingById={ editSettingById }
                editContact={ editContact }
                { ...props }
            />
        </Navigator.Screen>
    )};

    const EditScreen = () => {

        let locButtons = [];

        if ( ! table.finalLocations ) {
            return;
        }

        for ( const location of table.finalLocations ) {
            const [ screenState, setScreenState ] = useState( <LocationEditScreen location={ location }/> );
            editLocs.states[location.LocationName] = screenState;
            editLocs.setStates[location.LocationName] = setScreenState;
            const locName = location.LocationName === 'all' ?
                "General Settings" :
                location.LocationName;
            locButtons.push(
                <Navigator.Button 
                    path={ "/Edit/" + location.LocationName }
                    className = { clsx( props.className, "navigator screen-button" ) }
                >
                    { locName }
                </Navigator.Button>
            );
        }
   
        return(
        <>
            { Object.values( editLocs.states ) }
            <Navigator.Screen 
                path="/Edit/NewLoc"
            >
                <EditOpeningHours 
                    create={ true } 
                    createLocation={ createLocation } 
                />
            </Navigator.Screen>
            <Navigator.Screen 
                path="/Edit"
            >
                <div
                    className={ clsx( props.className, "navigator edit-screen-wrap" ) }
                >
                    <Navigator.Button
                        path="/Edit/Table"
                        className = { clsx( props.className, "navigator screen-button" ) }
                    >
                        Show Table
                    </Navigator.Button>
                    <div
                        className={ clsx( props.className, "navigator location-button-wrap" ) }
                    >
                        { locButtons }
                    </div>
                    <Navigator.Button 
                        path="/Edit/NewLoc"
                        className = { clsx( props.className, "navigator screen-button" ) }
                    >
                        Add Location
                    </Navigator.Button>
                </div>
            </Navigator.Screen>
        </>
        );
    };

    const NavigationWatcher = ( { onChange } ) => {
        const { location } = useNavigator();
        
        // Immer wenn sich der Ort ändert, benachrichtigen wir die Außenwelt
        useEffect( () => {
            onChange( location );
        }, [ location, onChange ] );

        return null;
    };

    return (
        <div
            className={ "opening-hours-settings-places" + ( props.isLoading ? " is-loading" : "" ) }
            role="region"
            aria-label={ __( 'Opening Hours Settings Places' ) }
        >
            <Navigator initialPath={ '/Edit' }>
                <NavigationWatcher onChange={ ( loc ) => globalStates.screenData.setScreen( loc.path ) } />
                <MainScreen/>
                <TableScreen/>
                <EditScreen/>
            </Navigator>
        </div>
    );

}

export default EditSettingsScreenHandler;
export { default as EditOpeningHours } from './EditOpeningHours';
export { default as LocationOrderDraggable } from './LocationOrderDraggable';
export { default as GeneralSettings } from './GeneralSettings';
export { default as OpeningHoursTable } from './OpeningHoursTable';