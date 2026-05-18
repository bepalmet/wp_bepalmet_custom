<?php

/**
 * The file that defines the plugin wide REST routes for admin
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Bepalmet-Custom
 * @subpackage Bepalmet-Custom/admin/partials
 */

/**
 * The class to register plugin wide REST routes for admin
 *
 * @since      1.0.0
 * @package    Bepalmet-Custom
 * @subpackage Bepalmet-Custom/admin/partials
 * @author     Benedikt Palmetshofer <plugins@bepalmet.de>
 */

class Bepalmet_Custom_Admin_Rest {


	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Bepalmet_Custom_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */

    public function enqueue_rest_route_registration() {
        
        register_rest_route( "bepalmet_custom/api", "/get-capability", array (

            "methods" => "POST",
            "callback" => array( $this, 'get_capability' ),
            "permission_callback" => array( $this, 'check_permission')

            )
        );

    }

    public function check_permission() {

        if ( ! current_user_can( 'edit_posts' ) ) {
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

    }

    public function get_capability ( $request ) {

        if ( $request->is_method( "POST" ) ) {

            if ( ! current_user_can( $request->get_params()['capability'] ) ) {
                return false;
            } else {
                return true;
            }

        } else {

            return "Only POST request allowed";

        }

    }

}