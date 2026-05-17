/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

function Header( { ...props } ) {
	return (

		<div
			className="opening-hours-settings-header"
			role="region"
			tabIndex="-1"
		>
			<div className={ "loader-wrap" + ( props.isLoading ? " is-loading" : "" ) }>
				<div className={ "loader" + ( props.isLoading ? " is-loading" : "" ) }/>
			</div>
			<h1 className="opening-hours-settings-header__title">
				{ __( 'Opening Hours Settings', 'bepalmet_custom') }
			</h1>
		</div>
	);
}

export default Header;