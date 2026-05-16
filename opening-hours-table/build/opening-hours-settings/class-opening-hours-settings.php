<?php

require_once plugin_dir_path( dirname( __FILE__ ) ) . 'opening-hours-settings/backend/class-settings-object.php';
require_once plugin_dir_path( dirname( __FILE__ ) ) . 'opening-hours-settings/backend/class-rest-routes.php';

class Opening_Hours_Settings extends Settings_Object {

    /**
     * Functions to initialize the specific functions of the editor
     */

    /**
     * REST routes
     */

    public function api_init() {

        $routes = [
            "times",
            "infos",
            "locations",
            "settings",
            "contacts"
        ];

        foreach ( $routes as $route ) {
            Rest_Routes::register_rest_route_to_db( $this, $route );
            Rest_Routes::register_rest_route_to_db( $this, $route, false );
        }

    }

    /**
     * Functions for REST routes
     */

    /**
     * Function to retrieve the tables
     * 
     * @param   OBJECT      $request        The array of the request to be processed.
     * @param   STRING      $table_name     Name of the table to get infos from.
     * @return  OBJECT                      The result of the database as an Object.
     */


    function wpdb_get_opening_hours ( $request, $table_name ) {

        global $wpdb;

        // GET functionality
        if ( $request->is_method( "GET" ) ) {

            return $wpdb->get_results( "SELECT * FROM $table_name", OBJECT );

        } 

        // POST functionality
        if ( $request->is_method( "POST" ) ) {

            $request_params = $request->get_params();

            return parent::get_specific( $request_params['query'], $table_name );

        }

        return "Bad request";

    }

    /**
     * @param   OBJECT      $request
     * @param   STRING      $name
     * @param   STRING      $table_name
     */

    function wpdb_create_opening_hours ( $request, $name, $table_name ) {

        return call_user_func_array( [ get_parent_class(), "create_$name" ], [ $request->get_params()[ 'create' ], $table_name ] );

    }

    /**
     * @param   OBJECT      $request
     * @param   STRING      $table_name
     */

    function wpdb_update_opening_hours ( $request, $table_name ) {

        return call_user_func_array( [ get_parent_class(), "update" ], [ $request, $table_name ] );

    }

    /**
     * @param   OBJECT      $request
     * @param   STRING      $name
     * @param   STRING      $table_name
     */

    function wpdb_delete_opening_hours ( $request, $name, $table_name ) {

        return call_user_func_array( [ get_parent_class(), "delete_$name" ], [ $request->get_params()['delete'], $table_name ] );

    }

}