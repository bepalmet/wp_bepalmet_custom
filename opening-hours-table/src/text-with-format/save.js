import { useBlockProps, RichText } from '@wordpress/block-editor';

function save( { attributes } ) {
    const blockProps = useBlockProps.save();

    return (
        <RichText.Content 
            { ...blockProps } 
            value={ attributes.content } 
        />
    );
}

export default save;