/**
 * Import of backend
 */

import { GlobalContext, RESTHandler as rh, GlobalVars as GV } from '../backend';

/**
 * Wordpress dependencies
 */
import { TabPanel, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useContext } from 'react';

/**
 * External dependencies
 */

import clsx from 'clsx';

/**
 * 
 * @param {Object} props 
 * @returns {React.Component}
 */

function SidebarPanel( { 
    useSettings: useSettings,
    ...props 
} ) {
    const {
        useShort: useShort
    } = useSettings;

    props.className = clsx( props.className, "sidebar-panel" );

    const globalStates = useContext( GlobalContext );

    const ShortWeekdaysToggle = () => {
        function handleChange() {
            useShort[1]( ( state ) => {
                const newSettings = rh.editSetting( { setting_name: "short_weekday_names" }, { newOnOff: ! state } );
                globalStates.refreshOne( "settings", newSettings );
                return ! state;
            } );
        }
        return (
            <ToggleControl
                __nextHasNoMarginBottom
                label="Use shortened weekday names"
                checked={ useShort[0] }
                onChange={ () => handleChange() }
            />
        );
    }

    const ToggleShowAllSites = () => {

        const { state: showAll, set: setShowAll } = globalStates.showAllLocs;

        function handleChange() {
            setShowAll( state => !state )
            globalStates.refreshAll();
        }

        return (
            <div
                className={ clsx( props.className, "show-all-sites" ) }
            >
                <ToggleControl
                    __nextHasNoMarginBottom
                    label="Show locations of all sites"
                    checked={ showAll }
                    onChange={ handleChange }
                />
            </div>
        )
    }

    const MainTabPanel = () => {
        return (
            <div className={ clsx( props.className, "one-panel-wrap" ) }>
                <div
                    className={ clsx( props.className, "header" ) }
                >
                    { __( "Additional settings", "wp-bepalmet-custom" ) }
                </div>
                <div
                    className={ clsx( props.className, "one-panel" ) }
                >
                    <ShortWeekdaysToggle { ...props }/>
                </div>
            </div>
        );
    }

    const GlobalTabPanel = () => {
        return (
            <div className={ clsx( props.className, "one-panel-wrap" ) }>
                <div
                    className={ clsx( props.className, "header" ) }
                >
                    { __( "Multisite Settings", "wp-bepalmet-custom" ) }
                </div>
                <div
                    className={ clsx( props.className, "one-panel" ) }
                >
                    <ToggleShowAllSites/>
                </div>
            </div>
        );
    }

    const tabArray = [
        {
            name: 'settings',
            title: 'Settings',
            className: clsx( props.className, "tab-panel-main" ),
            children: <MainTabPanel/>
        },
        wpGlobalVars.sites && {
            name: 'globalSettings',
            title: 'Multisite',
            className: clsx( props.className, "tab-panel-main" ),
            children: <GlobalTabPanel/>,
            disabled: ! globalStates.hasEditorCapability
        }
    ]

    const onSelectTab = ( tabName ) => {
        return;
    }

    return (
        <TabPanel
            className={ clsx( props.className, "tab-panel-wrap" ) }
            activeClass="tab-active"
            //onSelect={ onSelectTab }
            tabs={ tabArray }
        >
            { ( tab ) => tab.children }
        </TabPanel>
    );

}

export default SidebarPanel;