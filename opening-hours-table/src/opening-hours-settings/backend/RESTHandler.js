/**
 * JS class file for RESTHandler
 *
 * This is the javascript implementation of the REST functions of the plugin
 *
 * @link       http://bepalmet.de/wp_custom
 * @since      1.0.0
 *
 * @package    Bepalmet_Custom
 * @subpackage Bepalmet_Custom/blocks/src/opening-hours-settings/backend
 */

/**
 * @description The plugin class describing the js functionality of REST
 * @class
 *
 * This file consists of the different functions used to interact with the REST routes.
 * It mainly includes the functions to get, set anc update the database entries of the plugin
 *
 * @since      1.0.0
 * @package    Bepalmet_Custom
 * @subpackage Bepalmet_Custom/blocks/src/opening-hours-settings/backend
 * @author     Benedikt Palmetshofer
 */
// Source - https://stackoverflow.com/a/70397147
// Posted by Rounin
// Retrieved 2026-04-17, License - CC BY-SA 4.0

/**
 * Define JSON
 * @typedef {string} JSON
 */

import apiFetch from '@wordpress/api-fetch';

export default class RESTHandler {

    static #pathBase = ( type = '', local = true ) => {
        if ( ! wpGlobalVars.sites ) local = true;
        return local 
        ? '/bepalmet_custom/api/' + type + '-opening-hours-'
        : '/bepalmet_custom/api/' + type + '-opening-hours-global-';
    }

    /**
	 * Function to get a capability of current user
	 *
	 * @since    1.0.0
     * @var {string} capability - Capability to check for
	 * @returns {Promise} - A promise of the result of the POST request
	 */

    static async getCapability( capability ) {

        return await apiFetch( {
            path: '/bepalmet_custom/api/get-capability',
            method: 'POST',
            data: {
                capability: capability
            }
        } );

    }

    /**
	 * The function to get settings with GET request
	 *
	 * @since    1.0.0
	 * @returns {Promise} - A promise of the result of the GET request
	 */

    static async getSettings( local ){

        return await apiFetch( { 
                path: this.#pathBase( 'get', local )+ 'settings',
                method: 'GET',
            } );

    }

    /**
	 * The function to get the required data with a REST/GET request
	 *
	 * @since    1.0.0
	 * @returns {Promise} - A promise of the result of the GET request
	 */

    static async getTimes( local ){
            return await apiFetch( { 
                path: this.#pathBase( 'get', local )+ 'times',
                method: 'GET',
            } );

    }

    /**
	 * The function to get infos with GET request
	 *
	 * @since    1.0.0
	 * @returns {Promise} - A promise of the result of the GET request
	 */

    static async getInfos( local ){

        return await apiFetch( { 
                path: this.#pathBase( 'get', local )+ 'infos',
                method: 'GET',
            } );

    }

    /**
	 * The function to get locations with GET request
	 *
	 * @since    1.0.0
	 * @returns {Promise} - A promise of the result of the GET request
	 */

    static async getLocations( local ){

        return await apiFetch( { 
                path: this.#pathBase( 'get', local )+ 'locations',
                method: 'GET',
            } );

    }

    /**
	 * The function to get contacts with GET request
	 *
	 * @since    1.0.0
	 * @returns {Promise} - A promise of the result of the GET request
	 */

    static async getContacts( local ){

        return await apiFetch( { 
                path: this.#pathBase( 'get', local )+ 'contacts',
                method: 'GET',
            } );

    }

    /**
	 * The function to query the data with a REST/POST request
	 *
	 * @since    1.0.0
     * @param {array} input - The query values in key=>value pairs, accepted query parameters are: location, weekday, open, close
	 * @returns {Promise<Object>}   - A promise that resolves to the response of the POST request
	 */

    static async postSettings( input, local ) {

        if ( typeof(input) === 'undefined' ) {
            return this.getSettings( local );
        } else {

            return await apiFetch( { 
                    path: this.#pathBase( 'get', local )+ 'settings',
                    method: 'POST',
                    data: {
                        query: input
                    }
                } );
        }

    }

    /**
	 * The function to query the data with a REST/POST request
	 *
	 * @since    1.0.0
     * @param {array} input - The query values in key=>value pairs, accepted query parameters are: location, weekday, open, close
	 * @returns {Promise<Object>}   - A promise that resolves to the response of the POST request
	 */

    static async postTimes( input, local ) {

        if ( typeof(input) === 'undefined' ) {
            return this.getTimes( local );
        } else {

            return await apiFetch( { 
                    path: this.#pathBase( 'get', local )+ 'times',
                    method: 'POST',
                    data: {
                        query: input
                    }
                } );
        }

    }

    /**
	 * The function to query info with a REST/POST request
	 *
	 * @since    1.0.0
     * @param {array} input - The query values in key=>value pairs, accepted query parameters are: location, weekday, open, close
	 * @returns {Promise<Object>}   - A promise that resolves to the response of the POST request
	 */

    static async postInfos( input, local ) {

        if ( typeof(input) === 'undefined' ) {
            return this.getInfos( local );
        } else {

            return await apiFetch( { 
                    path: this.#pathBase( 'get', local )+ 'infos',
                    method: 'POST',
                    data: {
                        query: input
                    }
                } );
        }

    }

    /**
	 * The function to query the data with a REST/POST request
	 *
	 * @since    1.0.0
     * @param {array} input - The query values in key=>value pairs, accepted query parameters are: location, weekday, open, close
	 * @returns {Promise<Object>}   - A promise that resolves to the response of the POST request
	 */

    static async postLocations( input, local ) {

        if ( typeof(input) === 'undefined' ) {
            return this.getLocations( local );
        } else {

            return await apiFetch( { 
                    path: this.#pathBase( 'get', local )+ 'locations',
                    method: 'POST',
                    data: {
                        query: input
                    }
                } );
        }

    }

    /**
	 * The function to query the data with a REST/POST request
	 *
	 * @since    1.0.0
     * @param {array} input - The query values in key=>value pairs, accepted query parameters are: location, weekday, open, close
	 * @returns {Promise<Object>}   - A promise that resolves to the response of the POST request
	 */

    static async postContacts( input, local ) {

        if ( typeof(input) === 'undefined' ) {
            return this.getContacts( local );
        } else {

            return await apiFetch( { 
                    path: this.#pathBase( 'get', local )+ 'locations',
                    method: 'POST',
                    data: {
                        query: input
                    }
                } );
        }

    }

    /**
	 * The constructor to create or edit an entry to the database
	 *
	 * @since    1.0.0
     * @param {Object} data
     * @param {string} data.setting_name - Setting Name
     * @param {boolean} data.on_off - Boolean if setting should be on or off
     * @param {JSON} data.setting_values - JSON Object of 
	 * @returns {this} - Returns the function itself to further manipulate the data
	 */

    static setSettings( data ) {

        const {
            id: id,
            site_id: site_id,
            setting_name: setting_name,
            on_off: on_off,
            setting_values: settingValuesString
        } = data;
        
        let settingsObject = {};
        if ( typeof settingValuesString === 'string' ) {
            settingsObject = JSON.parse( settingValuesString );
        } else {
            settingsObject = settingValuesString;
        }

        /**
         * RESTHandler.set( { setting_name, on_off, setting_values }).create()
         * Invoke the REST-route for creation of a new entry
         *
         * @since    1.0.0
         */

        this.create = async ( local )=> {
            
            return await apiFetch( {
                    path: this.#pathBase( 'create', local ) + 'settings',
                    method: 'POST',
                    data: {
                        create: {
                            setting_name: setting_name,
                            site_id: site_id,
                            on_off: on_off,
                            setting_values: JSON.stringify(settingsObject)
                        }
                    }
                } );

        }

        /**
         * RESTHandler.set(location, weekday, open, close).edit(newOpen, newClose)
         * Invoke the REST-route for updating an existing entry
         *
         * @since    1.0.0
         * @param {Object} newData
         */

        this.edit = async ( newData, local ) => {

            const {
                newOnOff: newOnOff = on_off,
                newSettingValues: newSettingValues = settingValuesString
            } = newData;

            return await apiFetch( {
                    path: this.#pathBase( 'update', local ) + 'settings',
                    method: 'POST',
                    data: {
                        old: {
                            id: id
                        },
                        new: {
                            setting_name: setting_name,
                            on_off: newOnOff,
                            setting_values: newSettingValues
                        }
                    }
                } );

        }

        this.delete = async ()=> {
            
            return await apiFetch( {
                    path: this.#pathBase( 'delete' ) + 'settings',
                    method: 'POST',
                    data: {
                        delete: {
                            id: id,
                            setting_name: setting_name,
                            on_off: on_off,
                            setting_values: JSON.stringify(settingsObject)
                        }
                    }
                } );

        }

        return this;

    }

    /**
	 * The constructor to create or edit an entry to the database
	 *
	 * @since    1.0.0
     * @param {Object} data
     * @param {string} data.location - Location of the opening hours to be set
     * @param {int} data.weekday - Must be between 1 and 7
     * @param {int} data.open - Opening time
     * @param {int} data.close - Closing time
	 * @returns {this} - Returns the function itself to further manipulate the data
	 */

    static setTimes( data ) {

        const {
            id: id,
            LocationID: LocationID,
            site_id: site_id,
            LocationName: LocationName, 
            weekday: weekday, 
            open: open, 
            close: close
         } = data;

        /**
         * RESTHandler.set(location, weekday, open, close).create()
         * Invoke the REST-route for creation of a new entry
         *
         * @since    1.0.0
         */

        this.create = async ( local )=> {
            
            return await apiFetch( {
                    path: this.#pathBase( 'create', local ) + 'times',
                    method: 'POST',
                    data: {
                        create: {
                            LocationID: LocationID,
                            site_id: site_id,
                            weekday: weekday,
                            open: open,
                            close: close,
                        }
                    }
                } );

        }

        /**
         * RESTHandler.set(location, weekday, open, close).edit(newOpen, newClose)
         * Invoke the REST-route for updating an existing entry
         *
         * @since    1.0.0
         * @param {Object} newData
         * @param {string} newData.newLocation - Updated value for the location
         * @param {int} newData.newWeekday - Updated value for the weekday
         * @param {int} newData.newOpen - Updated value for the opening time
         * @param {int} newData.newClose - Updated value for the closing time
         */

        this.edit = async ( newData, local ) => {

            const {
                newLocation: newLocation = LocationName,
                newWeekday: newWeekday = weekday,
                newOpen: newOpen = open,
                newClose: newClose = close,
            } = newData;
            
            return await apiFetch( {
                    path: this.#pathBase( 'update', local ) + 'times',
                    method: 'POST',
                    data: {
                        old: {
                            id: id
                        },
                        new: {
                            weekday: newWeekday,
                            open: newOpen, 
                            close: newClose,
                        }
                    }
                } );

        }

        this.delete = async ()=> {
            
            return await apiFetch( {
                    path: this.#pathBase( 'delete' ) + 'times',
                    method: 'POST',
                    data: {
                        delete: {
                            id: id,
                            LocationID: LocationID,
                            weekday: weekday,
                            open: open,
                            close: close,
                        }
                    }
                } );

        }

        return this;

    }

    /**
	 * The constructor to create or edit an entry to the info database
	 *
	 * @since    1.0.0
     * @param {Object} infoData
     * @param {string} infoData.location - Location of the opening hours to be set
     * @param {string} infoData.info - Must be between 1 and 7
	 * @returns {this} - Returns the function itself to further manipulate the data
	 */

    static setInfos( infoData ) {

        const {
            id: id,
            LocationID: LocationID,
            site_id: site_id,
            LocationName: LocationName, 
            info: info
         } = infoData;

        /**
         * RESTHandler.set(location, info).create()
         * Invoke the REST-route for creation of a new entry
         *
         * @since    1.0.0
         */

        this.create = async ( local )=> {
            
            return await apiFetch( {
                    path: this.#pathBase( 'create', local ) + 'infos',
                    method: 'POST',
                    data: {
                        create: {
                            LocationID: LocationID,
                            site_id: site_id,
                            info: info
                        }
                    }
                } );

        }

        /**
         * RESTHandler.set(location, info).edit(newLocation, newInfo)
         * Invoke the REST-route for updating an existing entry
         *
         * @since    1.0.0
         * @param {Object} newData
         * @param {string} newData.newLocation - Updated value for the location
         * @param {string} newData.newInfo - Updated value for the info
         */

        this.edit = async ( newData, local ) => {

            const {
                newLocation: newLocation = LocationName,
                newInfo: newInfo
            } = newData;
            
            return await apiFetch( {
                    path: this.#pathBase( 'update', local ) + 'infos',
                    method: 'POST',
                    data: {
                        old: {
                            id: id
                        },
                        new: {
                            info: newInfo
                        }
                    }
                } );

        }

        this.delete = async ()=> {
            
            return await apiFetch( {
                    path: this.#pathBase( 'delete' ) + 'infos',
                    method: 'POST',
                    data: {
                        delete: {
                            id: id,
                            LocationID: LocationID,
                            info: info
                        }
                    }
                } );

        }

        return this;

    }

    /**
	 * The constructor to create or edit an entry to the info database
	 *
	 * @since    1.0.0
     * @param {Object} infoData
     * @param {string} infoData.location - Location of the opening hours to be set
     * @param {string} infoData.info - Must be between 1 and 7
	 * @returns {this} - Returns the function itself to further manipulate the data
	 */

    static setLocations( locData ) {

        const {
            LocationID: LocationID,
            LocationName: LocationName,
            site_id: site_id
        } = locData;

        /**
         * RESTHandler.set(location, info).create()
         * Invoke the REST-route for creation of a new entry
         *
         * @since    1.0.0
         */

        this.create = async ( local )=> {
            
            return await apiFetch( {
                    path: this.#pathBase( 'create', local ) + 'locations',
                    method: 'POST',
                    data: {
                        create: {
                            LocationName: LocationName,
                            site_id: site_id
                        }
                    }
                } );

        }

        /**
         * RESTHandler.set(location, info).edit(newLocation, newInfo)
         * Invoke the REST-route for updating an existing entry
         *
         * @since    1.0.0
         * @param {Object} newData
         * @param {string} newData.newLocation - Updated value for the location
         * @param {string} newData.newInfo - Updated value for the info
         */

        this.edit = async ( newData, local ) => {

            const {
                newLocation: newLocation = LocationName
            } = newData;
            
            return await apiFetch( {
                    path: this.#pathBase( 'update', local ) + 'locations',
                    method: 'POST',
                    data: {
                        old: {
                            LocationID: LocationID
                        },
                        new: {
                            LocationID: LocationID,
                            LocationName: newLocation
                        }
                    }
                } );

        }

        this.delete = async ()=> {
            
            return await apiFetch( {
                    path: this.#pathBase( 'delete' ) + 'locations',
                    method: 'POST',
                    data: {
                        delete: {
                            LocationID: LocationID,
                            LocationName: LocationName
                        }
                    }
                } );

        }

        return this;

    }
    
    static async editContact( 
        {
            LocationID: LocationID,
            site_id: site_id,
            LocationName: LocationName,
            contact_active: contact_active,
            contact_label: contact_label,
            contact_value: contact_value 
        }, local
    ) {

        return await apiFetch( {
                path: this.#pathBase( 'update', local ) + 'contacts',
                method: 'POST',
                data: {
                    old: {
                        LocationID: LocationID,
                        site_id: site_id,
                        LocationName: LocationName,
                        contact_label: contact_label
                    },
                    new: {
                        contact_active: contact_active,
                        contact_value: contact_value
                    }
                }
            } );

    }

    static async deleteContact(
        {
            LocationName: LocationName,
            site_id: site_id,
            contact_label: contact_label
        }
    ) {

        return await apiFetch( {
                path: '/bepalmet_custom/api/edit-opening-hours-contacts',
                method: 'POST',
                data: {
                    old: {
                        LocationName: LocationName,
                        site_id: site_id,
                        contact_label: contact_label
                    },
                    new: {
                        contact_value: null
                    }
                }
            } );

    }

    static async editSetting( filterObj, newSetting ) {
		return this.postSettings( { where: filterObj } ).then( ( result ) => {
			return this.setSettings( result[0] ).edit( newSetting );
		});
	};

    static get settings(){
        return this.getSettings();
    }

    static get times(){
        return this.getTimes();
    }

    static get infos(){
        return this.getInfos();
    }

    static get locations(){
        return this.getLocations();
    }

    static async settingsById( id,local ) {
        return this.postSettings( { where: { id: id } }, local );
    }

    static async timesById( id, local ) {
        return this.postTimes( { where: { id: id } }, local );
    }

    static async infosById( id,local ) {
        return this.postInfos( { where: { id: id } }, local );
    }

    static async locationsById( id, local ) {
        return this.postLocations( { where: { LocationID: id } }, local );
    }

}