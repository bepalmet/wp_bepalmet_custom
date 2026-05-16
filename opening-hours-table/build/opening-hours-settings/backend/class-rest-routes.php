<?php

final class Rest_Routes {

    private function __construct() {} //blocks instantiation

    /**
     * registers the rest routes of the plugin to the database
     * 
     * @param       OBJECT      $that           Class that includes the callable.
     * @param       STRING      $table_suffix   Table suffix of table to use.
     * @param       BOOL        $local          Optional. Use site specific tables in
     *                                          multisite setup. Defaults to "true".
     */

    public static function register_rest_route_to_db( $that, $table_suffix, $local = true ) {
        global $wpdb;

        if ( $local ) {
            $table_name = $wpdb->prefix . 'bepalmet_custom_local_view_' . $table_suffix;
            $permission = 'edit_posts';
            $rest_route_name = "opening-hours-$table_suffix/";
        } else {
            $permission = 'edit_pages';
            if ( in_array( $table_suffix, [ "contacts", "times", "infos" ] ) ) {
                $table_name = $wpdb->base_prefix . 'bepalmet_opening_hours_view_' . $table_suffix;
            } else {
                $table_name = $wpdb->base_prefix . 'bepalmet_opening_hours_' . $table_suffix;
            }
            $rest_route_name = "opening-hours-global-$table_suffix/";
        }

        $wrapper = function( $request ) use( $that, $table_name ) {
            return $that->wpdb_get_opening_hours( $request, $table_name );
        };
        $permission_callback = function() use( $permission ) {
            if ( ! current_user_can( $permission ) ) {
                return new WP_Error( 
                    'rest_forbidden', 
                    esc_html__( 
                        "You dont have access to this"
                    ),
                    array( 'status' => 401 ) 
                );
            } else {
                return true;
            }
        };

        register_rest_route( "bepalmet_custom/api", "/get-$rest_route_name", array (

            "methods" => "GET",
            "callback" => $wrapper,
            "permission_callback" => $permission_callback

            )
        );

        register_rest_route( "bepalmet_custom/api", "/get-$rest_route_name", array (

            "methods" => "POST",
            "callback" => $wrapper,
            "permission_callback" => $permission_callback

            )
        );

        $create_wrapper = function( $request ) use( $that, $table_suffix, $table_name ) {
            return $that->wpdb_create_opening_hours( $request, $table_suffix, $table_name );
        };

        register_rest_route( "bepalmet_custom/api", "/create-$rest_route_name", array (

            "methods" => "POST",
            "callback" => $create_wrapper,
            "permission_callback" => $permission_callback

            )
        );

        $update_wrapper = function( $request ) use( $that, $table_name ) {
            return $that->wpdb_update_opening_hours( $request, $table_name );
        };

        register_rest_route( "bepalmet_custom/api", "/update-$rest_route_name", array (

            "methods" => "POST",
            "callback" => $update_wrapper,
            "permission_callback" => $permission_callback

            )
        );

        $delete_wrapper = function( $request ) use( $that, $table_suffix, $table_name ) {
            return $that->wpdb_delete_opening_hours( $request, $table_suffix, $table_name );
        };

        register_rest_route( "bepalmet_custom/api", "/delete-$rest_route_name", array (

            "methods" => "POST",
            "callback" => $delete_wrapper,
            "permission_callback" => $permission_callback

            )
        );

    }

}