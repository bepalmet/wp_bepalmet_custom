<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Bepalmet_Custom
 * @subpackage Bepalmet_Custom/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Bepalmet_Custom
 * @subpackage Bepalmet_Custom/includes
 * @author     Benedikt Palmetshofer <plugins@bepalmet.de>
 */
class Bepalmet_Custom {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Bepalmet_Custom_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'PLUGIN_NAME_VERSION' ) ) {
			$this->version = PLUGIN_NAME_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'bepalmet_custom';

		$this->define_global_static_hooks();
		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->register_blocks();

	}

	private function define_global_static_hooks() {

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-bepalmet_custom-activator.php';
		add_action( 'wp_initialize_site', array( 'Bepalmet_Custom_Activator', 'activate_on_site_init' ), 10, 2 );
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Bepalmet_Custom_Loader. Orchestrates the hooks of the plugin.
	 * - Bepalmet_Custom_i18n. Defines internationalization functionality.
	 * - Bepalmet_Custom_Admin. Defines all hooks for the admin area.
	 * - Bepalmet_Custom_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-bepalmet_custom-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-bepalmet_custom-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-bepalmet_custom-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-bepalmet_custom-public.php';

		/**
		 * The class responsible for defining all block specific actions of the plugin
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'opening-hours-table/class-bepalmet_custom-blocks.php';

		/**
		 * The class responsible for initializing the custom editors
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'opening-hours-table/class-bepalmet_custom-editor.php';

		/**
		 * The class responsible for the export function
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/import-export/class-bepalmet_custom-exporter.php';

		/**
		 * The class responsible for the export function
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/import-export/class-bepalmet_custom-importer.php';

		$this->loader = new Bepalmet_Custom_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Bepalmet_Custom_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Bepalmet_Custom_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Bepalmet_Custom_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'create_options_page' );
		$this->loader->add_action( 'rest_api_init', $plugin_admin, 'enqueue_rest_route_registration' );

		//Init the custom editors
		$custom_editors = new Bepalmet_Custom_Editor( $this->get_plugin_name(), $this->get_version(), 'opening-hours-settings' );
		$this->loader->add_action( 'admin_enqueue_scripts', $custom_editors, 'editor_init' );
		$this->loader->add_action( 'admin_enqueue_scripts', $custom_editors, 'enqueue_styles' );
		$this->loader->add_action( 'rest_api_init', $custom_editors, 'api_init' );

		$exporter = new Bepalmet_Custom_Exporter( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'admin_post_bepalmet_download_export', $exporter, 'bepalmet_handle_export_download' );

		$importer = new Bepalmet_Custom_Importer( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'admin_post_bepalmet_upload_import', $importer, 'bepalmet_handle_upload_import' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Bepalmet_Custom_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

		//$this->loader->add_shortcode( 'bepalmet_opening', $plugin_public, 'get_opening_hours' );

	}

	/**
	 * Register all of the blocks this plugin uses in the Gutenberg editor
	 *
	 * @since    1.0.0
	 * @access   private
	 */

	 private function register_blocks() {

		$plugin_blocks = new Bepalmet_Custom_Blocks( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'init', $plugin_blocks, 'register_blocks' );
		$this->loader->add_action( 'enqueue_block_assets', $plugin_blocks, 'enqueue_styles', PHP_INT_MAX );
		$this->loader->add_action( 'init', $plugin_blocks, 'register_shortcodes', 20 );


	 }

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Bepalmet_Custom_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
