import { format, parse } from 'date-fns';

import { useMemo } from '@wordpress/element';

import { __ } from '@wordpress/i18n';

/**
 * Abstract class GlobalVars
 * 
 * Used to save global variables and enums
 * 
 * @class GlobalVars
 */

class GlobalVars {
    
    /**
     * Restricts instantiation of class
     */

    constructor() {
        if ( this.constructor == GlobalVars ) {
            throw new Error("Instantiation of GlobalVars is not allowed");
        }
    }

    /**
     * 
     * @param {int} weekday The weekday to get the name to
     * @param {bool} short Should short format be used, default false
     * @returns {string} Name of the weekday translated
     */

    static weekdays = ( weekday, short = false ) => {
        if ( typeof short === 'string' ) {
            short = parseInt(short);
        }
        return {
            1: short ? __( "Mo", "wp-bepalmet-custom" ) : __( "Monday", "wp-bepalmet-custom" ),
            2: short ? __( "Tu", "wp-bepalmet-custom" ) : __( "Tuesday", "wp-bepalmet-custom" ),
            3: short ? __( "We", "wp-bepalmet-custom" ) : __( "Wednesday", "wp-bepalmet-custom" ),
            4: short ? __( "Th", "wp-bepalmet-custom" ) : __( "Thursday", "wp-bepalmet-custom" ),
            5: short ? __( "Fr", "wp-bepalmet-custom" ) : __( "Friday", "wp-bepalmet-custom" ),
            6: short ? __( "Sa", "wp-bepalmet-custom" ) : __( "Saturday", "wp-bepalmet-custom" ),
            7: short ? __( "So", "wp-bepalmet-custom" ) : __( "Sunday", "wp-bepalmet-custom" )
        }[weekday] };

    /**
     * 
     * @param {Object||string} time can be Object{hours: HH, minutes: mm, am: a} or string "HH:mm:00"
     * @param {boolean} toDB convert to string to save in db?
     * @returns 
     */

    static convertTime( time, toDB = false ) {
        
        if ( toDB ) {

            const {
                minutes: minutes,
                hours: hours,
                am: am
            } = time;
            return `${hours}:${minutes}:00`;

        } else {

            const dateTime = parse( time, "HH:mm:ss", new Date() );
            const _time = useMemo(
                () => ( {
                    minutes: format( dateTime, 'mm' ),
                    hours: format( dateTime, 'HH' ),
                    am: format( dateTime, 'a' ),
                } ),
                [ dateTime ]
            );
            return _time;

        }

    }

    static convertRemToPixels( rem, document ) {    
        return rem * parseFloat( getComputedStyle( document.documentElement ).fontSize );
    }
    
}

export default GlobalVars;