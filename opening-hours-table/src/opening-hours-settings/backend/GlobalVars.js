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
            1: short ? __( "Mo", "wp_bepalmet_custom" ) : __( "Monday", "wp_bepalmet_custom" ),
            2: short ? __( "Tu", "wp_bepalmet_custom" ) : __( "Tuesday", "wp_bepalmet_custom" ),
            3: short ? __( "We", "wp_bepalmet_custom" ) : __( "Wednesday", "wp_bepalmet_custom" ),
            4: short ? __( "Th", "wp_bepalmet_custom" ) : __( "Thursday", "wp_bepalmet_custom" ),
            5: short ? __( "Fr", "wp_bepalmet_custom" ) : __( "Friday", "wp_bepalmet_custom" ),
            6: short ? __( "Sa", "wp_bepalmet_custom" ) : __( "Saturday", "wp_bepalmet_custom" ),
            7: short ? __( "So", "wp_bepalmet_custom" ) : __( "Sunday", "wp_bepalmet_custom" )
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