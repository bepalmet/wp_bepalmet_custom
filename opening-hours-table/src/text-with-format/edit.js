import { useBlockProps } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';

function Edit ( { attributes, setAttributes } ) {

    const blockProps = useBlockProps();

    return (
        <div { ...blockProps } className='bepalmet-rich-text'>
            <RichText
                value={ attributes.content }
                allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
                onChange={ ( content ) => setAttributes( { content } ) }
                placeholder='Edit Info'
            />
        </div>
    );

}

export default Edit;