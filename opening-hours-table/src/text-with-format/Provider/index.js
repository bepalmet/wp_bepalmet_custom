import { useState } from '@wordpress/element';
import { BlockEditorProvider, BlockList, BlockFormatControls } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { SlotFillProvider } from '@wordpress/components';
import clsx from 'clsx';

export default function Provider( { value, blockRef, ...props } ) {
    
    props.className = clsx( props.className, "bepalmet-text-with-format" );

    const [ blocks, setBlocks ] = useState( [ 
        createBlock( 
            'bepalmet-custom/text-with-format',
            { content: value }
        ) 
    ] );

    function handleChange( newValue ) {
        setBlocks( newValue )
        blockRef.current = newValue[0];
    }

    function handleInput( newValue ) {
        blockRef.current = newValue[0];
    }

    return (
        <SlotFillProvider>
            <BlockEditorProvider
                value={ blocks }
                onChange={ handleChange }
                onInput={ handleInput }
                settings={ {} }
            >
                <div
                    className={ props.className }
                >
                    <div 
                        className={ clsx( props.className, "format-controls-wrap" ) }
                    >
                        <BlockFormatControls.Slot 
                            className={ clsx( props.className, "format-controls" ) }
                        />
                    </div>
                    <div
                        className={ clsx( props.className, "block-list-wrap" ) }
                    >
                        <BlockList />
                    </div>
                </div>
            </BlockEditorProvider>
        </SlotFillProvider>
    );
}