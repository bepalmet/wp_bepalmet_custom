<?php

class Settings_Object {

    /**
     * Class of callbacks for rest routes
     * 
     * Defines the general and specific callbacks used in the rest routes.
     * 
     * @var     STRING      $charset_collate        Currently unused
     */

    protected $charset_collate;

    public function __construct() {
        global $wpdb;
        $this->charset_collate = $wpdb->get_charset_collate();
    }

    /**
     * Functions without specific pattern
     */

    /**
     * @param   OBJECT      $request
     * @param   STRING      $table_name
     */

    public function update( $request, $table_name ) {
        global $wpdb;

        if ( !($request instanceof WP_REST_Request) ) {
            return 'An Error has occured';
        }

        [ 
            'old' => $old,
            'new' => $new
        ] = $request->get_params();
        foreach ( array_keys($new) as $param ) {
            if ( !isset($param) ) {
                $new[$param] = $old[$param];
            }
            if ( is_array( $new[$param] ) ) {
                $new[$param] = json_encode( $new[$param], JSON_UNESCAPED_UNICODE );
            }
        }

        $wpdb->update( $table_name, $new, $old );

        return $wpdb->get_results( "SELECT * FROM $table_name" );

    }

    /**
     * @param   MIXED       $query
     * @param   STRING      $table_name
     */

    public function get_specific( $query, $table_name ) {
        global $wpdb;

        @[ 'select' => $select, 'where' => $where] = $query;

        $sql_select = '*';
        $sql_where = '';

        if ( is_array( $select ) ) {
            $sql_select = implode( ', ', $select );
        }

        if ( is_array( $where ) ) {
            $sql_where = "WHERE ";
            $where_array = [];
            foreach ( array_keys($where) as $param ) {
                array_push($where_array, "$param='$where[$param]'");
            }
            $sql_where = "WHERE " . implode( ' AND ', $where_array );
        }

        return $wpdb->get_results( "SELECT $sql_select from $table_name $sql_where" );
    }

    /**
     * Functions with specific patterns
     */

    public function create_settings( $request ) {
        return "You can't create settings";
    }

    public function delete_settings( $request ) {
        return "You can't delete settings";
    }

    public function create_contacts( $request ) {
        return "You can't create contact types. This is planned in a future release.";
    }

    public function delete_contacts( $request ) {
        return "You can't delete contact types. This is planned in a future release.";
    }

    /**
     * @param   OBJECT      $request
     * @param   STRING      $table_name
     */

    public function create_locations( $request, $table_name ) {
        global $wpdb;

        [
            'LocationName' => $location,
            'site_id'   => $site_id
        ] = $request;
        $wpdb->insert($table_name, array(
            "LocationName"  => $location,
            'site_id'   => $site_id
        ));
        $location_id = $wpdb->insert_id;
        $table_name_contacts = str_replace( 'locations', 'contacts', $table_name );
        foreach ( [ "phone", "fax", "mail", "address" ] as $label ) {
            $wpdb->insert($table_name_contacts, array(
                "LocationID" => $location_id,
                "site_id"   => $site_id,
                "contact_label" => $label,
                "contact_value" => null
            ));
        }

        return $wpdb->get_results( "SELECT * FROM $table_name" );

    }

    /**
     * @param   OBJECT      $request
     * @param   STRING      $table_name
     */

    public function delete_locations( $request, $table_name ) {

        [
            'LocationID' => $id,
            'LocationName' => $location
        ] = $request;

        if ( !isset( $id, $location ) ) {
            return "One or more properties of deleteLocation have not been set";
        }

        global $wpdb;
        $table_name_locations = $wpdb->base_prefix . 'bepalmet_opening_hours_locations';
        $wpdb->delete( $table_name_locations, array(
            "LocationID"    => $id,
            "LocationName"  => $location
        ));

        return $wpdb->get_results( "SELECT * FROM $table_name" );

    }

    /**
     * @param   OBJECT      $request
     * @param   STRING      $table_name
     */

    public function create_times( $request, $table_name ) {
        global $wpdb;

        [
            'LocationID' => $LocationID,
            'site_id'   => $site_id,
            'weekday' => $weekday, 
            'open' => $open, 
            'close' => $close 
        ] = $request;

        /**
         * @param   STRING      $LocationID
         * @param   INTEGER     $weekday
         * @param   INTEGER     $open
         * @param   INTEGER     $close
         */

        function validate( $LocationID, $weekday, $open, $close ) {

            if ( !isset( $LocationID, $weekday, $open, $close ) ) {
                throw new Exception('Settings Object was not created properly');
            }
            if ( !is_int( $weekday ) ) {
                throw new Exception( 'weekday is not an int' );
            } elseif ($weekday <= 0 || $weekday > 7) {
                throw new Exception( 'weekday is not between 1 and 7' );
            }
            if ( !is_int( $LocationID ) ) {
                throw new Exception( 'LocationID is not an int' );
            }

            return true;

        }

        if ( validate( $LocationID, $weekday, $open, $close ) ) {
            $wpdb->insert( $table_name, array(
                "LocationID" => $LocationID,
                "site_id"   => $site_id,
                "weekday"   => $weekday,
                "open"      => $open,
                "close"     => $close,
            ) );
            return $request;
        } else {
            throw new Error( "Error in validation of inputs" );
        }

    }

    /**
     * @param   OBJECT      $request
     * @param   STRING      $table_name
     */

    public function delete_times( $request, $table_name ) {

        [
            'id'        => $id,
            'LocationID' => $LocationID,
            'weekday' => $weekday, 
            'open' => $open, 
            'close' => $close 
        ] = $request;

        if ( !isset( $id, $weekday, $open, $close ) ) {
            return "One or more properties of delete have not been set";
        }

        global $wpdb;
        $table_name_times = $wpdb->base_prefix . 'bepalmet_opening_hours_times';
        $wpdb->delete( $table_name_times, array(
            "id"        => $id,
            "LocationID"    => $LocationID,
            "weekday"   => $weekday,
            "open"      => $open,
            "close"     => $close,
        ));

        return $wpdb->get_results( "SELECT * FROM $table_name" );

    }

    /**
     * @param   OBJECT      $request
     * @param   STRING      $table_name
     */

    public function create_infos( $request, $table_name ) {
        global $wpdb;

        [
            'LocationID'    => $id,
            'site_id'   => $site_id,
            'info'      => $info
        ] = $request;

        $wpdb->insert($table_name, array(
            "LocationID"        => $id,
            "site_id"   => $site_id,
            "info"      => $info
        ));
        return $request;

    }

    /**
     * @param   OBJECT      $request
     * @param   STRING      $table_name
     */

    public function delete_infos( $request, $table_name ) {

        [
            'id'        => $id,
            'info'      => $info
        ] = $request;

        if ( !isset( $id, $info ) ) {
            return "One or more properties of deleteInfo have not been set";
        }

        global $wpdb;
        $table_name_infos = $wpdb->base_prefix . 'bepalmet_opening_hours_infos';
        $wpdb->delete($table_name_infos, array(
            "id"        => $id,
            "info"      => $info
        ));

        return $wpdb->get_results( "SELECT * FROM $table_name" );

    }

}