<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Bepalmet-Custom
 * @subpackage Bepalmet-Custom/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Bepalmet-Custom
 * @subpackage Bepalmet-Custom/admin
 * @author     Your Name <email@example.com>
 */
class Bepalmet_Custom_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Bepalmet_Custom_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Bepalmet_Custom_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/bepalmet_custom-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Bepalmet_Custom_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Bepalmet_Custom_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/bepalmet_custom-admin.js', array( 'jquery' ), $this->version, false );

	}

	/**
	 * Create the options page for the plugin
	 * 
	 * @since 1.0.0
	 */

	public function create_options_page() {

		$parent_menu_slug = plugin_dir_path(__FILE__) . 'partials/bepalmet_custom-admin-display.php';

		/**
		 * Function to create options page. 
		 * 
		 * Uses $parent_menu_slug 
		 */

		add_menu_page( 
			__( 'Settings for bepalmet-custom', "wp-bepalmet-custom" ),
			"bepalmet custom",
			'edit_posts',
			$parent_menu_slug,
			null,
			'',
			0
		);

		add_submenu_page( 
			$parent_menu_slug, 
			'Opening hours', 
			'Opening hours', 
			'edit_posts', 
			plugin_dir_path(__FILE__) . 'partials/opening-hours-settings.php',
			''
		);

	}

	/**
	 * Link to class-bepalmet_custom-admin-rest
	 * 
	 * @since 1.0.0
	 */

    public function enqueue_rest_route_registration() {

		require_once( plugin_dir_path( __FILE__ ) . "partials/class-bepalmet_custom-admin-rest.php");
		$rest = new Bepalmet_Custom_Admin_Rest();
		$rest->enqueue_rest_route_registration();
		
	}

}
