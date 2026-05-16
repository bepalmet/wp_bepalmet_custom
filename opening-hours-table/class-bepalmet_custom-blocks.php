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
class Bepalmet_Custom_Blocks {

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
	 * Register all blocks
	 *
	 * @since    1.0.0
	 */
	public function register_blocks() {

		/**
		 * Add all blocks to register below.
		 */

		register_block_type( plugin_dir_path( __FILE__ ) . 'build/opening-hours-block' );
		register_block_type( plugin_dir_path( __FILE__ ) . 'build/text-with-format' );

	}

	/**
	 * Register the stylesheets for the blocks.
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

		wp_enqueue_style( "$this->plugin_name-block-style", plugin_dir_url( __FILE__ ) . 'build/opening-hours-block/index.css', array(), $this->version, 'all' );
		wp_enqueue_style( "$this->plugin_name-block-style", plugin_dir_url( __FILE__ ) . 'build/text-with-format/index.css', array(), $this->version, 'all' );

	}

	public function register_shortcodes() {

		/**
		 * This function is to register the different shortcodes.
		 * 
		 * It should only be called within the loader of the plugin.
		 * 
		 * With the function render_block() the block's output is rendered when
		 * the shortcode is used.
		 * 
		 * Syntax:
		 * add_shortcode( string $tag, callable $callback( $atts, $content, $shortcode_tag ) )
		 * function callback( $atts, $content, $shortcode_tag ) {
		 * 	render_block( array $parsed_block );
		 * }
		 * $parsed_block = array(
		 * 	'blockName' => string|null,
		 * 	'attrs' => array,
		 * 	'innerBlocks => array[],
		 *  'innerHtml' => string,
		 *  'innerContent' => array
		 * );
		 */

		add_shortcode( "$this->plugin_name-opening-hours-table", 'render_opening_hours_table');
		function render_opening_hours_table( $atts, $content, $shortcode_tag ) {
			$block = array(
				'blockName' => 'bepalmet-custom/opening-hours-block'
			);
			return render_block( $block );
		}

	}

}
