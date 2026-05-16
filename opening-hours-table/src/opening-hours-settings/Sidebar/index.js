/**
 * Import of backend
 */

import { GlobalContext, RESTHandler as rh } from '../backend';

/**
 * WordPress dependencies
 */
import { 
	createSlotFill, 
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

/**
 * React dependencies
 */

import { useState, useRef, useEffect } from 'react';

/**
 * Internal dependencies
 */

import SidebarPanel from './SidebarPanel';

const { Slot: InspectorSlot, Fill: InspectorFill } = createSlotFill(
	'OpeningHoursSettingsSidebarInspector'
);

function Sidebar( { ...props } ) {
	
    props.className = clsx( props.className, "bepalmet-custom-sidebar" );

	const useShort = useState();
	if ( typeof useShort[0] === 'undefined' ) {
		rh.postSettings( { where: { setting_name: "short_weekday_names" } } ).then( (resolve) => {
			useShort[1](Boolean(parseInt(resolve[0].on_off)));
		} );
	}

	const useSettings={
		useShort: useShort,
		useVisible: useState( false )
	}

	const [ isVisible, setIsVisible ] = useSettings.useVisible;
	function toggleVisible() {
		setIsVisible( ( state ) => ! state );
	}

	const useOutsideClick = ( callback ) => {
		const ref = useRef();

		useEffect( () => {
			const handleClick = ( event ) => {
				if ( ref.current && !ref.current.contains( event.target ) ) {
					callback();
				}
			};

			document.addEventListener( 'mousedown', handleClick );
			return () => {
				document.removeEventListener( 'mousedown', handleClick );
			};
		}, [ callback ] );

		return ref;
	};

    const containerRef = useOutsideClick( () => setIsVisible( false ) );

	return (
		<div
			className={ clsx( props.className, "toggle-button wrap" ) }
			ref={ containerRef }
		>
			<Button
				className={ clsx( props.className, "toggle-button" ) }
				onClick={ toggleVisible }
				variant="tertiary"
			>
				<span class="dashicons dashicons-menu"></span>
			</Button>
			{ isVisible && <SidebarPanel useSettings={ useSettings } { ...props }/> }
		</div>
	)
}

Sidebar.InspectorFill = InspectorFill;

export default Sidebar;
export { default as SidebarPanel } from './SidebarPanel';