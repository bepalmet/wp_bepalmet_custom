/**
 * Import of backend
 */

import { GlobalContext, RESTHandler as rh } from './backend';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';


/**
 * WordPress dependencies
 */
import {
	Popover,
	SlotFillProvider
} from '@wordpress/components';
import { FullscreenMode, InterfaceSkeleton } from '@wordpress/interface';
import { StrictMode } from '@wordpress/element';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import clsx from 'clsx';

/**
 * Internal dependencies
 */
import Sidebar from './Sidebar';
import Header from './Header';
import EditSettingsScreenHandler from './OpeningHoursTable';

import { useContext } from 'react';

/**
 * Default function to create the functionality of the custom editor
 * 
 * @param {} Object receives multiple paramateres as an Object that can be accessesed
 * @returns {Element} The element to render
 */

function Editor( { settings, ...props } ) {

    props.className = clsx( props.className, "bepalmet-opening-hours-settings-editor" );

    const globalStates = useContext( GlobalContext );
    const local = ! globalStates.showAllLocs.state;

    const EditorSettings = () => {

        //rh.set( { id, 'location', weekday, open, close } )
        //  .create() || .edit( { key: value } )
        //rh.post( { where: { key: value } } );

        /**
         * Function to create a new Settings in the DB
         * 
         * @param {Object} createObject { location, weekday, open, close }
         */

        const createTime = ( createObject ) => {
            return rh.setTimes( createObject ).create( local );
        };

        /**
         * 
         * @param {Object} filterObject { id, location, weekday, open, close }
         * @param {Object} editObject { keyToEdit: newValue }
         */

        const editTime = ( filterObject, editObject ) => {
            return rh.setTimes( filterObject ).edit( editObject, local );
        };

        /**
         * 
         * @param {int} id
         */

        const editTimeById = ( id, newSetting ) => {
            return rh.timesById( id, local ).then( ( result ) => {
                return rh.setTimes( result[0] ).edit( newSetting, local );
            });
        };

        /**
         * 
         * @param {int} id
         */

        const deleteTimeById = ( id ) => {
            return rh.timesById( id, local ).then( ( result ) => {
                return rh.setTimes( result[0] ).delete();
            });
        };

        /**
         * Function to create a new Settings in the DB
         * 
         * @param {Object} createObject { location, weekday, open, close }
         */

        const createInfo = ( createObject ) => {
            return rh.setInfos( createObject ).create( local );
        };

        /**
         * 
         * @param {Object} filterObject { id, location, weekday, open, close }
         * @param {Object} editObject { keyToEdit: newValue }
         */

        const editInfo = ( filterObject, editObject ) => {
            return rh.setInfos( filterObject ).edit( editObject, local );
        };

        /**
         * 
         * @param {int} id
         */

        const editInfoById = ( id, newInfo ) => {
            return rh.infosById( id, local ).then( ( result ) => {
                return rh.setInfos( result[0] ).edit( newInfo, local );
            });
        };

        /**
         * 
         * @param {int} id
         */

        const deleteInfoById = ( id ) => {
            return rh.infosById( id, local ).then( ( result ) => {
                return rh.setInfos( result[0] ).delete();
            });
        };

        /**
         * Function to create a new Settings in the DB
         * 
         * @param {Object} createObject { location, weekday, open, close }
         */

        const createLocation = ( createObject ) => {
            return rh.setLocations( createObject ).create( local );
        };

        /**
         * 
         * @param {Object} filterObject { id, location, weekday, open, close }
         * @param {Object} editObject { keyToEdit: newValue }
         */

        const editLocation = ( filterObject, editObject ) => {
            return rh.setLocations( filterObject ).edit( editObject, local );
        };

        /**
         * 
         * @param {int} id
         */

        const editLocationById = ( id, newLoc ) => {
            return rh.locationsById( id, local ).then( ( result ) => {
                return rh.setLocations( result[0] ).edit( newLoc, local );
            });
        };

        /**
         * 
         * @param {int} id
         */

        const deleteLocationById = ( id ) => {
            return rh.locationsById( id, local ).then( ( result ) => {
                return rh.setLocations( result[0] ).delete();
            });
        };

        /**
         * Function to create a new Settings in the DB
         * 
         * @param {Object} createObject { location, weekday, open, close }
         */

        const createSetting = ( createObject ) => {
            return rh.setSettings( createObject ).create( local );
        };

        /**
         * 
         * @param {Object} filterObject { id, location, weekday, open, close }
         * @param {Object} editObject { keyToEdit: newValue }
         */

        const editSetting = ( filterObject, editObject ) => {
            return rh.setSettings( filterObject ).edit( editObject, local );
        };

        /**
         * 
         * @param {int} id
         */

        const editSettingById = ( id, newSetting ) => {
            return rh.settingsById( id, local ).then( ( result ) => {
                return rh.setSettings( result[0] ).edit( newSetting, local );
            });
        };

        /**
         * 
         * @param {int} id
         */

        const deleteSettingById = ( id ) => {
            return rh.settingsById( id, local ).then( ( result ) => {
                return rh.setSettings( result[0] ).delete();
            });
        };

        /**
         * 
         * @param {Object} newContact
         */

        const editContact = ( newContact ) => {
            return rh.editContact( newContact, local );
        };

        return {
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
        }
    };

    return (
        <>
            <StrictMode>
                <ShortcutProvider>
                    <FullscreenMode 
                        isActive={false}
                    />
                    <SlotFillProvider>
                        <InterfaceSkeleton
                            header={ <Header { ...props }/> }
                            sidebar={ <Sidebar/> }
                            content={
                                <>
                                    <EditSettingsScreenHandler
                                        { ...props }
                                        settings={ EditorSettings() }
                                    />
                                </>
                            } 
                        />
						<Popover.Slot/>
					</SlotFillProvider>
				</ShortcutProvider>
			</StrictMode>
        </>
    );
}

export default Editor;