<?php

/**
 * Fired when the plugin is uninstalled.
 *
 * When populating this file, consider the following flow
 * of control:
 *
 * - This method should be static
 * - Check if the $_REQUEST content actually is the plugin name
 * - Run an admin referrer check to make sure it goes through authentication
 * - Verify the output of $_GET makes sense
 * - Repeat with other user roles. Best directly by using the links/query string parameters.
 * - Repeat things for multisite. Once for a single site in the network, once sitewide.
 *
 * This file may be updated more in future version of the Boilerplate; however, this is the
 * general skeleton and outline for how the file should work.
 *
 * For more information, see the following discussion:
 * https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate/pull/123#issuecomment-28541913
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

if ( ! current_user_can( 'manage_options' ) ) {
	wp_die( "You are not allowed to uninstall this plugin. Please contact an administrator.", "Missing permission" );
}

$delete_all = true;

if ( $delete_all ) {
	
	global $wpdb;

	$tables = $wpdb->get_results("SHOW TABLES LIKE \"wp_%bepalmet%\"", ARRAY_A);
	$last_index = count($tables);
	$tables = array_map( function($n) {
		return array_values($n)[0];
	}, $tables);
	$lock = array_splice($tables, array_search('wp_bepalmet_opening_hours_lock', $tables), 1);
	array_splice($tables, 0, 0, $lock);
	$locations = array_splice($tables, array_search('wp_bepalmet_opening_hours_locations', $tables), 1);
	array_splice($tables, $last_index, 0, $locations);

	foreach ( $tables as $one_table ) {
		if ( str_contains( $one_table, "_view_") ) {
			$wpdb->query( "DROP VIEW $one_table" );
		} else {
			$wpdb->query( "DROP TABLE $one_table" );
		}
	}

	error_log(print_r($wpdb->get_results("SHOW TABLES LIKE \"wp_bepalmet%\""), true));

}
