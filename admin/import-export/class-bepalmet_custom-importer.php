<?php

class Bepalmet_Custom_Importer {

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

    function bepalmet_handle_upload_import () {

        $global = false;
        $local = false;
        if (current_user_can('edit_pages')) {
            $global = true;
        } elseif ( current_user_can('edit_posts') ) {
            $local = true;
        } else {
            wp_die(__('Sie haben keine Berechtigung für diese Aktion.', "wp-bepalmet-custom" ) );
        }

        // 2. Sicherheits-Nonce validieren
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce($_GET['_wpnonce'], 'bepalmet_import_nonce')) {
            wp_die(__('Sicherheitsprüfung fehlgeschlagen.', "wp-bepalmet-custom" ) );
        }

        $file_type = strtolower(pathinfo($_FILES["import_file"]["name"],PATHINFO_EXTENSION));

        if ($_FILES["import_file"]["size"] > 1000000) {
        echo __( "Your file is too large.", "wp-bepalmet-custom" );
        $uploadOk = 0;
        }

        if($file_type != 'json') {
        echo __( "Only JSON files allowed", "wp-bepalmet-custom" );
        $uploadOk = 0;
        }

        if ( isset( $uploadOk ) && $uploadOk == 0) {
        echo __( "An Error occured and the file was not uploaded", "wp-bepalmet-custom" );
        }

        if (
            $_FILES['import_file']['error'] == UPLOAD_ERR_OK 
            && is_uploaded_file($_FILES['import_file']['tmp_name'])
        ) {
            $contents =  file_get_contents($_FILES['import_file']['tmp_name']); 
            $this->import_file( $contents );
        }
    }

    function import_file( $file_content ) {

        global $wpdb;

        $content = json_decode( $file_content );
        $data = $content->data;
        $view_def = $content->viewDef;

        foreach ( $view_def as $view ) {
            $view_name = $view[0]->View;
            $create_view = $view[0]->{ 'Create View' };
		    if( $wpdb->get_var("SHOW TABLES LIKE '$view_name'") != $view_name ) {
                $wpdb->query( $create_view );
            }
        }

        foreach ( $data as $table_name => $table_entries ) {
            foreach ( $table_entries as $entry ) {
                $insert_array =  get_object_vars( $entry );
                $LocName_index = array_search( 'LocationName', array_keys( $insert_array ) );
                if ( $LocName_index ) {
                    array_splice( $insert_array, $LocName_index, 1 );
                }
                $wpdb->insert( $table_name, $insert_array );
            }
        }
        
    }

}