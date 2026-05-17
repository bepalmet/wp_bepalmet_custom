import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';

function Edit() {

	const blockProps = useBlockProps();

	return (
		<div
			{ ...blockProps }
			className="wp-block-bepalmet-custom-opening-hours-block-wrapper"
		>
				<ServerSideRender block="bepalmet-custom/opening-hours-block" />
			</div>
	);

}

export default Edit;