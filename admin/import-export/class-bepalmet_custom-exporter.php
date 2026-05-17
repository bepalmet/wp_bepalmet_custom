<?php

class Bepalmet_Custom_Exporter {

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

    function export_data() {
        global $wpdb;

        $tables = [];

        $get_local_tables = $wpdb->get_results( "SHOW TABLES LIKE '%bepalmet_custom%'", ARRAY_N );
        foreach ( $get_local_tables as $one ) {
            $tables[] = $one[0];
        }

        if ( is_multisite() && current_user_can( 'edit_pages' ) ) {
            $get_global_tables = $wpdb->get_results( "SHOW TABLES LIKE '%bepalmet_opening_hours%'", ARRAY_N );
            foreach ( $get_global_tables as $one ) {
                $tables[] = $one[0];
            }
        }

        $content = [];
        $view_def = [];
        foreach ( $tables as $table ) {
            $content[$table] = $wpdb->get_results( "SELECT * FROM $table", ARRAY_A );
            if( str_contains( $table, 'view' ) ) {
                $view_def[] = $wpdb->get_results( "SHOW CREATE VIEW $table" );
            }
        }
        $final_content = [
            'data' => $content,
            'viewDef' => $view_def
        ];
        return $final_content;
    }

    public function bepalmet_handle_export_download() {
        // 1. Berechtigung prüfen (Darf der User Einstellungen ändern?)
        $global = false;
        $local = false;
        if (current_user_can('edit_pages')) {
            $global = true;
        } elseif ( current_user_can('edit_posts') ) {
            $local = true;
        } else {
            wp_die(__('Sie haben keine Berechtigung für diese Aktion.', "bepalmet_custom" ) );
        }

        // 2. Sicherheits-Nonce validieren
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce($_GET['_wpnonce'], 'bepalmet_export_nonce')) {
            wp_die(__('Sicherheitsprüfung fehlgeschlagen.', "bepalmet_custom" ) );
        }

        // 3. Create content
        $content = $this->export_data();

        // 4. Ihr Export-Code
        if (isset($content)) {
            // Löscht alle bisherigen Ausgabe-Puffer, um korrupten Datei-Inhalt zu verhindern
            if (ob_get_length()) {
                ob_end_clean();
            }

            $date = date( 'Ymd');

            header("Content-type: text/plain; charset=utf-8");
            header("Content-Disposition: attachment; filename=$date-bepalmet_custom_export.json");
            header("Pragma: no-cache");
            header("Expires: 0");

            echo json_encode($content, JSON_PRETTY_PRINT);
            exit; // Zwingend erforderlich, damit WP keine Admin-Layouts anhängt
        }
    }
}