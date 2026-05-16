<?php

/**
 * The block-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Bepalmet_Custom
 * @subpackage Bepalmet_Custom/blocks
 */

/**
 * The block-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and a function to register
 * the block specific hooks
 *
 * @package    Bepalmet_Custom
 * @subpackage Bepalmet_Custom/blocks
 * @author     Your Name <email@example.com>
 */
class Bepalmet_Custom_Editor {

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
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      array    $this->editors    An array of names of editors.
	 */
	private $editor;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param   string  $plugin_name    The name of this plugin.
	 * @param   string  $version        The version of this plugin.
     * @param   object  $this->editor         An array of the names of editors to create
	 */
	public function __construct( $plugin_name, $version, $editor ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
        $this->editor = $editor;
        
	}

    /**
     * Init function for each editor
     * 
     * @param   string  $this->editor     Name/Path of the editor
     * @param   string  $hook       Name/Path of the editor
     */

	public function editor_init( $hook ) {

        /**
         * Editor Initializer
         *
         * Enqueue JS of all the editors.
         *
         * @since   1.0.0
         */

        // Exit if accessed directly.
        if ( ! defined( 'ABSPATH' ) ) {
            exit;
        }

        $hook_array = explode( '/', $hook );
        $hook_name = end( $hook_array );
        if ( $this->editor . '.php' !== $hook_name ) {
            return;
        }

        $script_handle = $this->editor . '-script';

        $script_path       = 'build/' . $this->editor . '/index.js';
        $script_asset_path = dirname( __FILE__ ) . '/build/' . $this->editor . '/index.asset.php';
        $script_asset      = file_exists( $script_asset_path )
            ? require $script_asset_path
            : array(
                'dependencies' => array('jquery'),
                'version'      => '0.1.0'
            );
        $script_url        = plugins_url( $script_path, __FILE__ );

        wp_enqueue_script( $script_handle, $script_url, $script_asset['dependencies'], $script_asset['version'] );

        $settings = $this->init_settings();
        wp_add_inline_script( $script_handle, 'window.initSettings = ' . wp_json_encode( $settings ) . ';' );

        wp_add_inline_script(
            'wp-blocks',
            'wp.blocks.unstable__bootstrapServerSideBlockDefinitions(' . wp_json_encode( get_block_editor_server_block_settings() ) . ');'
        );

        wp_enqueue_script( 'wp-format-library' );

        $global_vars = [
            'sites' => [],
        ];

        if( is_multisite() ) {
            
            $sites = get_sites();

            foreach( $sites as $site ) {
                $site_id = $site->blog_id;
                $site_details = get_blog_details( $site_id );
                $site_name = $site_details->blogname;
                $global_vars['sites'][$site_id] = $site_name;
            }

        } else {
            $global_vars['sites'] = false;
        }

        wp_localize_script( $script_handle, 'wpGlobalVars', $global_vars );

	}

    /**
     * Enqueue style function for each editor
     * 
     * @param   string  $this->editor     Name/Path of the editor
     * @param   string  $hook       Name/Path of the editor
     */

    public function enqueue_styles( $hook ) {

        /**
         * Editor Initializer
         *
         * Enqueue CSS of all the editors.
         *
         * @since   1.0.0
         */

        //EXIT if accesses directly
        $hook_array = explode( '/', $hook );
        $hook_name = end( $hook_array );
        if ( $this->editor . '.php' !== $hook_name ) {
            return;
        }

        wp_enqueue_style( 'wp-format-library' );

        $styles_path = 'build/' . $this->editor . '/index.css';
        $styles_handle = 'custom-editor-' . $this->editor . '-styles';
        wp_enqueue_style (
            $styles_handle,
            plugins_url( $styles_path, __FILE__ ),
            array( 'wp-edit-blocks' ),
            '0.1.0'
        );

    }

    /**
     * Function to initialize settings of the editors
     * 
     * @return      array      Key value pairs of strings for settings
     */

    private function init_settings() {
        $settings = array();
        list( $color_palette, ) = (array) get_theme_support( 'editor-color-palette' );
        list( $font_sizes, )    = (array) get_theme_support( 'editor-font-sizes' );
        if ( false !== $color_palette ) {
            $settings['colors'] = $color_palette;
        }
        if ( false !== $font_sizes ) {
            $settings['fontSizes'] = $font_sizes;
        }
        return $settings;
    }

	/**
	 * Create the custom editors to be used
     * 
     * Iterates through the editor names given on class creation
     * 
     * @param   string  $hook       Name/Path of the editor
	 *
	 * @since    1.0.0
	 */

    public function api_init() {

        $class_file_name = 'class-' . $this->editor . '.php';
        require_once( dirname( __FILE__ ) . '/build/' . $this->editor . '/' . $class_file_name );
        $words = explode( '-', $this->editor );
        foreach ( $words as $word ) {
            $class_name_list[] = ucfirst($word);
        }
        $class_name = implode('_', $class_name_list);
        $class = new $class_name();
        $class->api_init();

    }

}