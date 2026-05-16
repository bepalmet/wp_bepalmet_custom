/**
 * Import of backend
 */

// import { GlobalContext, GCProvider, RESTHandler as rh, GlobalVars as GV } from './backend';

/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { registerCoreBlocks } from '@wordpress/block-library';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './styles.scss';

/**
 * Internal dependencies
 */
import Editor from './editor';
import { useState } from 'react';

function LoadingWrap( { settings } ) {
    const [ isLoading, setIsLoading ] = useState( true );
    
    return (
        <GCProvider
            setIsLoading={ setIsLoading }
        >
            <Editor 
                settings={ settings }
                isLoading={ isLoading }
            />
        </GCProvider>
    );
}

domReady( () => {
    registerCoreBlocks();
    const settings = window.initSettings || {};
    const root = createRoot(
        document.getElementById( 'opening-hours-settings-block-editor' )
    );
    root.render( <LoadingWrap settings={ settings } /> );
});

export { default as OpeningHoursSettingsEditor } from './editor';
export * from './backend';
export * from './OpeningHoursTable';
export { default as Header } from './Header';
export { default as Sidebar } from './Sidebar';