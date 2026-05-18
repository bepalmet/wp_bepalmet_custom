<?php

/**
 * Fired during plugin activation
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Bepalmet-Custom
 * @subpackage Bepalmet-Custom/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Bepalmet-Custom
 * @subpackage Bepalmet-Custom/includes
 * @author     Your Name <email@example.com>
 */

class Bepalmet_Custom_Activator {

	/**
	 * Activates the plugin.
	 *
	 * All functions needed to activate the plugin are referenced here.
	 *
	 * @param	BOOL	$network_wide	Automatically retrieved on activation.
	 * @since   1.0.0
	 */

	public static function activate( $network_wide ) {

		global $wpdb;
		if ( is_multisite() && $network_wide ) {
			$db_prefix = $wpdb->base_prefix;
		} else {
			$db_prefix = $wpdb->prefix;
		}

		self::create_locations_table( $db_prefix );
		self::create_time_table( $db_prefix );
		self::create_info_table( $db_prefix );
		self::create_settings_table( $db_prefix );
		self::create_contacts_table( $db_prefix );
		self::create_views( $db_prefix );

		if ( is_multisite() && $network_wide ) {
        	$site_ids = get_sites( array( 'fields' => 'ids', 'number' => 0 ) );
			self::create_locations_for_sites( $site_ids );
			self::create_local_tables( $site_ids );
		}

	}

	public static function create_locations_table( $db_prefix ) {

		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name =  $db_prefix . 'bepalmet_opening_hours_locations';

		if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {

			$sql = "CREATE TABLE $table_name (
				LocationID TINYINT PRIMARY KEY AUTO_INCREMENT,
				LocationName VARCHAR(50) UNIQUE NOT NULL,
				site_id TINYINT
			) $charset_collate ENGINE=InnoDB;";

			$wpdb->query($sql);

			self::populate_location( $db_prefix );

		}

		$table_name_lock =  $db_prefix . 'bepalmet_opening_hours_locked_rows';

		if($wpdb->get_var("SHOW TABLES LIKE '$table_name_lock'") != $table_name_lock) {

			$sql_lock = "CREATE TABLE $table_name_lock (
				LocationID TINYINT NOT NULL,
				LocationName TINYTEXT NOT NULL,
				FOREIGN KEY (LocationID)
				REFERENCES $table_name(LocationID)
				ON DELETE RESTRICT
			) $charset_collate ENGINE=InnoDB;";

			$wpdb->query($sql_lock);

			self::populate_lock( $db_prefix );


		}

	}

	private static function populate_location ( $db_prefix ) {
		global $wpdb;

		$table_name =  $db_prefix . 'bepalmet_opening_hours_locations';

		$wpdb->insert( $table_name, array(
			"LocationID" => 1,
			"LocationName" => "all"
		));
	
	}

	private static function populate_lock ( $db_prefix ) {
		global $wpdb;

		$table_name_lock =  $db_prefix . 'bepalmet_opening_hours_locked_rows';
		$wpdb->insert( $table_name_lock, array(
			"LocationID" => 1,
			"LocationName" => "all"
		));

	}

	public static function create_time_table ( $db_prefix ) {

		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name =  $db_prefix . 'bepalmet_opening_hours_times';
		$table_name_locations =  $db_prefix . 'bepalmet_opening_hours_locations';

		if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {

			$sql = "CREATE TABLE $table_name (
					id MEDIUMINT AUTO_INCREMENT PRIMARY KEY,
					LocationID TINYINT NOT NULL,
					FOREIGN KEY (LocationID)
					REFERENCES $table_name_locations(LocationID)
					ON DELETE CASCADE
					ON UPDATE CASCADE,
					site_id TINYINT,
					weekday TINYINT NOT NULL,
					open TIME NOT NULL,
					close TIME NOT NULL
				) $charset_collate ENGINE=InnoDB;";

			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql );

		}

	}

	public static function create_info_table ( $db_prefix ) {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name =  $db_prefix . 'bepalmet_opening_hours_infos';
		$table_name_locations =  $db_prefix . 'bepalmet_opening_hours_locations';

		if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {

			$sql = "CREATE TABLE $table_name (
					id mediumint AUTO_INCREMENT PRIMARY KEY,
					LocationID TINYINT NOT NULL,
					FOREIGN KEY (LocationID)
					REFERENCES $table_name_locations(LocationID)
					ON DELETE CASCADE
					ON UPDATE CASCADE,
					site_id TINYINT,
					info MEDIUMTEXT NOT NULL
				) $charset_collate ENGINE=InnoDB;";

			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql );

		}

	}

	public static function create_settings_table ( $db_prefix ) {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name =  $db_prefix . 'bepalmet_opening_hours_settings';
		$table_name_locations =  $db_prefix . 'bepalmet_opening_hours_locations';

		if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {

			$sql = "CREATE TABLE $table_name (
						id TINYINT PRIMARY KEY AUTO_INCREMENT,
						LocationID TINYINT,
						site_id TINYINT,
						setting_name VARCHAR(20) UNIQUE NOT NULL,
						on_off BOOLEAN DEFAULT 0,
						setting_values TEXT
					) $charset_collate ENGINE=InnoDB";

			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql );

			self::populate_settings( $db_prefix );

		}

	}

	private static function populate_settings ( $db_prefix ) {
		global $wpdb;

		$table_name =  $db_prefix . 'bepalmet_opening_hours_settings';

		$wpdb->insert( $table_name, array(
			"setting_name" => "show_locations",
			"on_off" => 1,
			"setting_values" => "[]"
		));
		$wpdb->insert( $table_name, array(
			"setting_name" => "locations_order",
			"on_off" => 1,
			"setting_values" => "[]"
		));
		$wpdb->insert( $table_name, array(
			"setting_name" => "short_weekday_names",
			"on_off" => 0,
			"setting_values" => "[]"
		));
	
	}

	public static function create_contacts_table ( $db_prefix ) {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$table_name =  $db_prefix . 'bepalmet_opening_hours_contacts';
		$table_name_locations =  $db_prefix . 'bepalmet_opening_hours_locations';

		if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {

			$sql = "CREATE TABLE $table_name (
					id mediumint AUTO_INCREMENT PRIMARY KEY,
					LocationID TINYINT NOT NULL,
					FOREIGN KEY (LocationID)
					REFERENCES $table_name_locations(LocationID)
					ON DELETE CASCADE
					ON UPDATE CASCADE,
					site_id TINYINT,
					contact_active BOOLEAN default 0,
					contact_label TINYTEXT NOT NULL,
					contact_value TEXT
				) $charset_collate ENGINE=InnoDB;";

			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql );

			self::populate_contacts( $db_prefix );

		}

	}

	private static function populate_contacts ( $db_prefix ) {
		global $wpdb;

		$table_name =  $db_prefix . 'bepalmet_opening_hours_contacts';

		$wpdb->insert( $table_name, array(
			"LocationID" => 1,
			"contact_active" => 0,
			"contact_label" => "phone",
			"contact_value" => null
		));
		$wpdb->insert( $table_name, array(
			"LocationID" => 1,
			"contact_active" => 0,
			"contact_label" => "fax",
			"contact_value" => null
		));
		$wpdb->insert( $table_name, array(
			"LocationID" => 1,
			"contact_active" => 0,
			"contact_label" => "mail",
			"contact_value" => null
		));
		$wpdb->insert( $table_name, array(
			"LocationID" => 1,
			"contact_active" => 0,
			"contact_label" => "address",
			"contact_value" => null
		));

	}

	public static function create_views ( $db_prefix ) {

		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$view_name_times =  $db_prefix . 'bepalmet_opening_hours_view_times';
		$view_name_infos=  $db_prefix . 'bepalmet_opening_hours_view_infos';
		$view_name_contacts =  $db_prefix . 'bepalmet_opening_hours_view_contacts';

		$table_name_locations =  $db_prefix . 'bepalmet_opening_hours_locations';
		$table_name_times =  $db_prefix . 'bepalmet_opening_hours_times';
		$table_name_infos =  $db_prefix . 'bepalmet_opening_hours_infos';
		$table_name_contacts =  $db_prefix . 'bepalmet_opening_hours_contacts';

		$sql = [];

		if($wpdb->get_var(
				"SELECT table_name FROM INFORMATION_SCHEMA.TABLES 
				WHERE TABLE_NAME = '$view_name_times'"
			) != $view_name_times) {

			$sql[] = "CREATE VIEW $view_name_times AS
				SELECT
					t.id,
					t.LocationID,
					l.LocationName,
					t.site_id,
					t.weekday,
					t.open,
					t.close
				FROM $table_name_times t
				JOIN $table_name_locations l 
				ON t.LocationID = l.LocationID";

			}

		if($wpdb->get_var(
				"SELECT table_name FROM INFORMATION_SCHEMA.TABLES 
				WHERE TABLE_NAME = '$view_name_infos'"
			) != $view_name_infos) {

			$sql[] = "CREATE VIEW $view_name_infos AS
				SELECT
					i.id,
					i.LocationID,
					l.LocationName,
					i.site_id,
					i.info
				FROM $table_name_infos i
				JOIN $table_name_locations l 
				ON i.LocationID = l.LocationID";

			}

		if($wpdb->get_var(
				"SELECT table_name FROM INFORMATION_SCHEMA.TABLES 
				WHERE TABLE_NAME = '$view_name_contacts'"
			) != $view_name_contacts) {

			$sql[] = "CREATE VIEW $view_name_contacts AS
				SELECT
					c.id,
					c.LocationID,
					l.LocationName,
					c.site_id,
					c.contact_active,
					c.contact_label,
					c.contact_value
				FROM $table_name_contacts c
				JOIN $table_name_locations l 
				ON c.LocationID = l.LocationID";

		}

		foreach ( $sql as $one_sql ) {

			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			$wpdb->query( $one_sql );

		}

	}

	/**
	 * @param array $site_ids
	 */

	public static function create_locations_for_sites( $site_ids ) {

		global $wpdb;

		$table_name = $wpdb->base_prefix . 'bepalmet_opening_hours_locations';

		if($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {

			foreach ( $site_ids as $id ) {
				switch_to_blog( $id );
				$wpdb->insert( $table_name, array(
					'LocationName'	=> get_bloginfo( 'name' ),
					'site_id'		=> $id
				) );
			}

		}

	}

	public static function create_local_tables( $site_ids ) {

		global $wpdb;

		$view_name_times =  $wpdb->base_prefix . 'bepalmet_opening_hours_view_times';
		$view_name_infos=  $wpdb->base_prefix . 'bepalmet_opening_hours_view_infos';
		$view_name_contacts =  $wpdb->base_prefix . 'bepalmet_opening_hours_view_contacts';

		$table_name_locations =  $wpdb->base_prefix . 'bepalmet_opening_hours_locations';
		$table_name_settings= $wpdb->base_prefix . 'bepalmet_opening_hours_settings';

		foreach ( $site_ids as $id ) {

			switch_to_blog( $id );

			$local_table_view_times = $wpdb->prefix . 'bepalmet_custom_local_view_times';
			$local_table_view_infos = $wpdb->prefix . 'bepalmet_custom_local_view_infos';
			$local_table_view_contacts = $wpdb->prefix . 'bepalmet_custom_local_view_contacts';
			$local_table_view_locations = $wpdb->prefix . 'bepalmet_custom_local_view_locations';
			$local_table_view_settings = $wpdb->prefix . 'bepalmet_custom_local_view_settings';

			$sql = [];

			if($wpdb->get_var(
					"SELECT table_name FROM INFORMATION_SCHEMA.TABLES 
					WHERE TABLE_NAME = '$local_table_view_times'"
				) != $local_table_view_times) {

				$sql[] = "CREATE VIEW $local_table_view_times AS
					SELECT *
					FROM $view_name_times
					WHERE site_id = $id OR site_id IS NULL
					";

			}

			if($wpdb->get_var(
					"SELECT table_name FROM INFORMATION_SCHEMA.TABLES 
					WHERE TABLE_NAME = '$local_table_view_infos'"
				) != $local_table_view_infos) {

				$sql[] = "CREATE VIEW $local_table_view_infos AS
					SELECT *
					FROM $view_name_infos
					WHERE site_id = $id OR site_id IS NULL
					";

			}

			if($wpdb->get_var(
					"SELECT table_name FROM INFORMATION_SCHEMA.TABLES 
					WHERE TABLE_NAME = '$local_table_view_contacts'"
				) != $local_table_view_contacts) {

				$sql[] = "CREATE VIEW $local_table_view_contacts AS
					SELECT *
					FROM $view_name_contacts
					WHERE site_id = $id OR site_id IS NULL
					";

				self::populate_contacts( $wpdb->base_prefix, $id );

			}

			if($wpdb->get_var(
					"SELECT table_name FROM INFORMATION_SCHEMA.TABLES 
					WHERE TABLE_NAME = '$local_table_view_locations'"
				) != $local_table_view_locations) {

				$sql[] = "CREATE VIEW $local_table_view_locations AS
					SELECT *
					FROM $table_name_locations
					WHERE site_id = $id OR site_id IS NULL
					";

			}

			if($wpdb->get_var(
					"SELECT table_name FROM INFORMATION_SCHEMA.TABLES 
					WHERE TABLE_NAME = '$local_table_view_settings'"
				) != $local_table_view_settings) {

				$sql[] = "CREATE VIEW $local_table_view_settings AS
					SELECT *
					FROM $table_name_settings
					WHERE site_id = $id OR site_id IS NULL
					";

			}

			foreach ( $sql as $one_sql ) {

				require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
				$wpdb->query( $one_sql );

			}

			restore_current_blog();

		}

	}

	public static function activate_on_site_init( $new_site, $args ) {

		require_once ABSPATH . 'wp-admin/includes/plugin.php';
			
		if ( is_plugin_active_for_network( 'wp-bepalmet-custom/wp-bepalmet-custom.php' ) ) {
			self::create_local_tables( [ $new_site->id ] );
		}

	}

}
