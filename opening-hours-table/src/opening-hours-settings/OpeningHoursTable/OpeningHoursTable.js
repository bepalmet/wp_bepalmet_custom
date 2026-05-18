/**
 * Import of backend
 */

import { GlobalContext, GlobalVars as GV } from '../backend';

import { useContext, useMemo } from 'react';

import {
    Button,
    __experimentalTreeGrid as TreeGrid,
    __experimentalTreeGridCell as TreeGridCell,
    __experimentalTreeGridRow as TreeGridRow
} from '@wordpress/components';
import { 
    Panel, 
    PanelBody,
    PanelRow, 
} from '@wordpress/components'
import { RawHTML } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import clsx from 'clsx';

class OpeningHoursTable {

    constructor ( { ...props } ) {

        const globalStates = useContext( GlobalContext );
        this.refreshAll = globalStates.refreshAll;
        this.showAllLocs = ! globalStates.showAllLocs.state;

        if ( globalStates !== null ) {
            this.getTimes = globalStates.timeData.times;
            this.setTimes = globalStates.timeData.setTimes;
            this.getInfos = globalStates.infoData.infos;
            this.setInfos = globalStates.infoData.setInfos;
            this.getLocs = globalStates.locData.locs;
            this.setLocs = globalStates.locData.setLocs;
            this.getSettings = globalStates.settingData.settings;
            this.setSettings = globalStates.settingData.setSettings;
            this.getContacts = globalStates.contactData.contacts;
            this.setContacts = globalStates.contactData.setContacts;
        }

        if ( !this.getTimes, !this.getInfos, !this.getLocs, !this.getSettings, !this.getContacts ) return;
        this.times = useMemo( () => {
            return this.#initTimes();
        }, [ this.getTimes ] );
        this.infos = useMemo( () => {
            return this.#initInfos();
        }, [ this.getInfos ] );
        this.locs = useMemo( () => {
            return this.#initLocations();
        }, [ this.getLocs ] );
        this.settings = useMemo( () => {
            return this.#initSettings();
        }, [ this.getSettings ] );
        this.contacts = useMemo( () => {
            return this.#initContacts();
        }, [ this.getContacts ] );
        this.renderFinalTable = useMemo( () => {
            if ( !this.times, !this.infos, !this.locs, !this.settings, !this.contacts ) return;
            return this.renderTable( { ...props } );
        }, [ this.times, this.infos, this.locs, this.settings, this.contacts ] );

    }

    #initTimes() {

        let finalTimes = {};
        for ( let element of this.getTimes ) {
            const { id, LocationID, LocationName, weekday, open, close } = element;
            finalTimes[LocationName] ??= { LocationID: LocationID };
            finalTimes[LocationName].weekdays ??= {};
            finalTimes[LocationName].weekdays[weekday] ??= [];
            finalTimes[LocationName].weekdays[weekday].push( element );
        }

        return finalTimes;

    }

    #initInfos() {

        let finalInfos = {};

        for ( let element of this.getInfos ) {
            const { id, LocationID, LocationName, info } = element;
            finalInfos[LocationName] ??= [];
            finalInfos[LocationName].push( element );
        }

        return finalInfos;

    }

    #initLocations() {

        let locations = [];

        for ( let element of this.getLocs ) {
            locations.push( element );
        }

        return locations;

    }

    #initSettings() {

        let finalSettings = {};
        for ( let element of this.getSettings ) {
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

    #initContacts() {

        let finalContacts = {};
        for ( let element of this.getContacts ) {
            const { id, LocationID, LocationName, contact_active, contact_label, contact_value } = element;
            finalContacts[LocationName] ??= {
                LocationID: LocationID
            };
            finalContacts[LocationName][contact_label] = {
                id: id,
                active: '1' === contact_active,
                value: contact_value
            }
        }

        return finalContacts;

    }

    #closedMessage = __( "Closed", "wp_bepalmet_custom" );
    #openingsText = __( "Openings", "wp_bepalmet_custom" );
    #contactsLabel = __( "Contact", "wp_bepalmet_custom" );
    #contactsText = __( "Contact", "wp_bepalmet_custom" );

    renderTable( { ...props } ) {

        if ( typeof props.className === 'undefined' ) {
            props.className = "";
        }
        props.className += " render-table";

        let renderLocations = [];
        let innerLocation = [];
        const locAmount = this.settings.show_locations.setting_values.length;

        const createOrderedLocs = () => {
            let orderedLocs = new Array();
            for ( let loc of this.locs ) {
                const locName = loc.LocationName;
                if ( locName !== 'all' ) {
                    if ( this.settings.show_locations.setting_values.includes( locName ) ) {
                        const index = this.settings.locations_order.setting_values.indexOf( locName );
                        if( index >= 0 ) {
                            orderedLocs[index] = loc;
                        } else {
                            orderedLocs.push(loc);
                        }
                    }
                }
            }
            return orderedLocs.filter( function() { return true } );
        }

        const orderedLocs = createOrderedLocs();

        for ( const location of orderedLocs ) {
            const locName = location.LocationName;
            renderLocations.push(
                <TreeGridCell
                    className={ clsx( props.className, "outer-table location-header" ) }
                >
                    { (_props) => ( <h2>{ locName }</h2>) }
                </TreeGridCell>
            );

            let renderTimes = new Array(7);
            if ( typeof this.times[locName] === 'undefined' ) {
                this.times[locName] = {};
            }
            renderTimes[0] = '';
            if ( Object.values( this.times[locName] ).length > 0 ) {
                for ( const [weekday, openings] of Object.entries( this.times[locName]['weekdays'] ) ) {
                    let oneDay = [];
                    for ( let time of openings ) {
                        const open = time['open'].substring(0, time['open'].length - 3);
                        const close = time['close'].substring(0, time['close'].length - 3);
                        oneDay.push(
                            <div
                                className={ clsx( props.className, "opening-time" ) }
                            >
                                { open } - { close }
                            </div>
                        );
                    }
                    renderTimes[weekday] = 
                        <div className={ clsx( props.className, "one-day outer" ) }>
                            <div
                                className={ clsx( props.className, "one-day weekday-name" ) }
                            >
                                { GV.weekdays( weekday, this.settings.short_weekday_names.on_off ) + ": " }
                            </div>
                            <div
                                className={ clsx( props.className, "one-day times" ) }
                            >
                                { oneDay }
                            </div>
                        </div>
                    ;
                }
            }
            for ( let day = 0; day < (renderTimes.length); day++ ) {
                if ( typeof renderTimes[day] === 'undefined' ) {
                    renderTimes[day] = 
                        <div className={ clsx( props.className, "one-day outer" ) }>
                            <div
                                className={ clsx( props.className, "weekday-name" ) }
                            >
                                { GV.weekdays( day, this.settings.short_weekday_names.on_off ) + ": " }
                            </div>
                            <div
                                className={ clsx( props.className, "closed-message" ) }
                            >
                                { this.closedMessage }
                            </div>
                        </div>
                }
            }

            let infos = [];
            if ( typeof this.infos[locName] === 'undefined' ) {
                this.infos[locName] = {};
            }
            let setSize = 2;
            let infoRow = <></>;
            if ( Object.values( this.infos[locName] ).length > 0 ) {
                for ( const info of Object.values( this.infos[locName] ) ) {
                    infos.push(
                        <p
                            className={ clsx( props.className, "location-info" ) }
                        >
                            <RawHTML>
                                { info.info }
                            </RawHTML>
                        </p>
                    );
                }
                setSize = 3;
                infoRow = (
                    <TreeGridRow
                        level={ 3 } 
                        positionInSet={ 3 } 
                        setSize={ setSize }
                        className={ clsx( props.className, "inner-table location-infos" ) }
                    >
                        <TreeGridCell
                            className={ clsx( props.className, "inner-table location-infos" ) }
                            colSpan={ 2 }
                        >
                            { (_props) => infos }
                        </TreeGridCell>
                    </TreeGridRow>
                );
            }

            let contactLabels = {
                phone: __( "Phone Number:", "wp_bepalmet_custom" ),
                fax: __( "Fax Number:", "wp_bepalmet_custom" ),
                mail: __( "E-Mail Address:", "wp_bepalmet_custom" ),
                address: __( "Address:", "wp_bepalmet_custom" )
            }
            let renderContact = [];
            for ( let [ contact, { active: active, value: value } ] of Object.entries( this.contacts[locName] ) ) {
                if ( active ) {
                    renderContact.push(
                        <>
                            <div
                                className={ ` ${props.className} contact ${contact} label` }
                            >
                                { contactLabels[contact] }
                            </div>
                            <div
                                className={ ` ${props.className} contact ${contact} value` }
                            >
                                { value }
                            </div>
                        </>
                    );
                }
            }

            innerLocation.push(
                <TreeGrid className={ clsx( props.className, "inner-table" ) }>
                    <TreeGridRow 
                        level={ 1 } 
                        positionInSet={ 1 } 
                        setSize={ setSize }
                        className={ clsx( props.className, "inner-table headers" ) }
                    >
                        <TreeGridCell
                            className={ clsx( props.className, "inner-table headers openings" ) }
                        >
                            { (_props) => this.openingsText }
                        </TreeGridCell>
                        <TreeGridCell
                            className={ clsx( props.className, "inner-table headers contacts" ) }
                        >
                            { (_props) => this.contactsLabel }
                        </TreeGridCell>
                    </TreeGridRow>
                    <TreeGridRow 
                        level={ 2 } 
                        positionInSet={ 2 } 
                        setSize={ setSize }
                        className={ clsx( props.className, "inner-table body" ) }
                    >
                        <TreeGridCell
                            className={ clsx( props.className, "inner-table body openings" ) }
                        >
                            { (_props) => 
                                <div
                                    className={ clsx( props.className, "times" ) }
                                >
                                    { renderTimes }
                                </div> }
                        </TreeGridCell>
                        <TreeGridCell
                            className={ clsx( props.className, "inner-table body contacts" ) }
                        >
                            { (_props) => 
                                <div
                                    className={ clsx( props.className, "contact" ) }
                                >
                                    { renderContact }
                                </div>
                            }
                        </TreeGridCell>
                    </TreeGridRow>
                    { infoRow }
                </TreeGrid>
            );
        }

        if ( typeof this.infos['all'] === 'undefined' ) {
             this.infos['all'] = [];
        }
        let renderAllInfos = [];
        for ( const info of this.infos['all'] ) {
            renderAllInfos.push(<RawHTML>{ info.info }</RawHTML>);
        }

        let allInfo = <></>;
        let setSize = 2;

        if ( renderAllInfos.length > 0 ) {
            allInfo = 
            <>
                <TreeGridRow 
                    level={ 3 } 
                    positionInSet={ 3 } 
                    setSize={ 3 }
                    className={ clsx( props.className, "outer-table info-all" ) }
                >
                    <TreeGridCell 
                    className={ clsx( props.className, "outer-table info-all inner" ) }
                    colSpan={ locAmount }
                    >
                        { (_props) => ( renderAllInfos ) }
                    </TreeGridCell>
                </TreeGridRow>
            </>;
            setSize = 3;
        } else {
            allInfo = <></>;
        }

        const tableHeader = (
            <div 
                className={ clsx( props.className, "opening-hours-table-header" ) }
            >
                { __( "Opening hours and contact", "wp_bepalmet_custom" ) }
            </div>
        );

        const smallScreen = () => {
            let panelBodies = [];
            for ( let locIndex in innerLocation ) {
                panelBodies.push(
                    <Panel>
                        <PanelBody
                            title={ orderedLocs[locIndex].LocationName }
                            initialOpen={ false }
                        >
                            <PanelRow className='small-panel'>
                                { innerLocation[locIndex] }
                            </PanelRow>
                        </PanelBody>
                    </Panel>
                );
            }
            return (
                <div className={ clsx( props.className, "opening-hours-table-small" ) }>
                    { tableHeader }
                    { panelBodies }
                </div>
            );
        }

        const bigScreen = () => {
            let innerLocationCells = [];
            for ( let loc of innerLocation ) {
                innerLocationCells.push(
                    <TreeGridCell
                        className={ clsx( props.className, "outer-table locations-inner" ) }
                    >
                        { (_props) => (
                            loc
                        ) }
                    </TreeGridCell>
                );
            }

            return (
                <>
                <Button
                    onClick={ this.refreshAll }
                    variant='secondary'
                    className={ clsx( props.className, "refresh-all" ) }
                >
                    Refresh
                </Button>
                <div className={ clsx( props.className, "opening-hours-table-wrap" ) }>
                    { tableHeader }
                    <TreeGrid className={ clsx( props.className, "outer-table" ) }>
                        <TreeGridRow 
                            level={ 1 } 
                            positionInSet={ 1 }
                            setSize={ setSize }
                            className={ clsx( props.className, "outer-table locations-label" ) }
                        >
                            { renderLocations }
                        </TreeGridRow>
                        <TreeGridRow 
                            level={ 2 } 
                            positionInSet={ 2 } 
                            setSize={ setSize }
                            className={ clsx( props.className, "outer-table locations-body" ) }
                        >
                            { innerLocationCells }
                        </TreeGridRow>
                        { allInfo }
                    </TreeGrid>
                </div>
                </>
            );
        }

        const screenSizeHandler = () => {
            const screenWidth = window.innerWidth;
            if ( screenWidth < GV.convertRemToPixels( 18 * locAmount, document ) ) {
                return smallScreen();
            } else {
                return bigScreen();
            }
        }

        return screenSizeHandler();
    }

    /**
     * getters and setters
     */

    get closedMessage() {
        return this.#closedMessage;
    }
    
    set closedMessage( newMsg ) {
        this.#closedMessage = newMsg;
    }

    get openingsText() {
        return this.#openingsText;
    }
    
    set openingsText( newText ) {
        this.#openingsText = newText;
    }

    get contactsLabel() {
        return this.#contactsLabel;
    }
    
    set contactsLabel( newLabel ) {
        this.#contactsLabel = newLabel;
    }

    get contactsText() {
        return this.#contactsText;
    }
    
    set contactsText( newText ) {
        newText;
    }

    get finalTable() {
        return this.renderFinalTable;
    }

    get finalTimes() {
        return this.times;
    }

    get finalInfos() {
        return this.infos;
    }

    get finalLocations() {
        return this.locs;
    }

    get finalSettings() {
        return this.settings;
    }

    get finalContacts() {
        return this.contacts;
    }

}

export default OpeningHoursTable;