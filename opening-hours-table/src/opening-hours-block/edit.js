import { useBlockProps } from '@wordpress/block-editor';
import { OpeningHoursTable } from '../opening-hours-settings';

import './editor.scss'

function Edit() {

	const blockProps = useBlockProps();

	const tableObject = new OpeningHoursTable( {} );
	if ( typeof tableObject.finalTable === 'string' ) {

	}

	return (
		<div { ...blockProps }>
			{ tableObject.finalTable }
		</div>
	);

}

export default Edit;