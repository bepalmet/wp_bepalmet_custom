<?php

set_time_limit(5);

/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes "array": The block attributes.
 *     $content "string": The block default content.
 *     $block "WP_Block": The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 * @package block-developer-examples
 */

$class_name = "bepalmet-custom opening-hours-table render public";

global $wpdb;

if ( is_multisite() ) {
    $table_name_settings = $wpdb->prefix . 'bepalmet_custom_local_view_settings';
    $table_name_times = $wpdb->prefix . 'bepalmet_custom_local_view_times';
    $table_name_infos = $wpdb->prefix . 'bepalmet_custom_local_view_infos';
    $table_name_locations = $wpdb->prefix . 'bepalmet_custom_local_view_locations';
    $table_name_contacts = $wpdb->prefix . 'bepalmet_opening_hours_view_contacts';
} else {
    $table_name_settings = $wpdb->prefix . 'bepalmet_opening_hours_settings';
    $table_name_times = $wpdb->prefix . 'bepalmet_opening_hours_view_times';
    $table_name_infos = $wpdb->prefix . 'bepalmet_opening_hours_view_infos';
    $table_name_locations = $wpdb->prefix . 'bepalmet_opening_hours_locations';
    $table_name_contacts = $wpdb->prefix . 'bepalmet_opening_hours_view_contacts';
}

$contact_labels = array(
    'phone' => __( "Phone", "wp-bepalmet-custom" ),
    'fax' => __( "Fax", "wp-bepalmet-custom" ),
    'mail' => __( "E-Mail", "wp-bepalmet-custom" ),
    'address' => __( "Address", "wp-bepalmet-custom" )
);

if (!function_exists('value_link')){
    function value_link( string $label, ?string $value ) {
        $link_base = array(
            'phone' => "tel:",
            'fax' => "fax:",
            'mail' => "mailto:",
            //'address' => 'geo:0,0?='
        );
        $link = urlencode($value);
        if ( $label != 'address' ) {
            return "<a href=\"$link_base[$label]$link\">$value</a>";
        } else {
            return $value;
        }
    }
}

$get_settings = $wpdb->get_results( "SELECT * FROM $table_name_settings", ARRAY_A );

$settings = array_column( $get_settings, null, "setting_name" );
$locations = $wpdb->get_results( "SELECT * FROM $table_name_locations" );

$show_locations = explode( ',', str_replace( [ '[' , ']', '"', ' ' ] , '', $settings["show_locations"]["setting_values"] ) );
$locations_order = array_flip( explode( ',', str_replace( [ '[' , ']', '"', ' ' ] , '', $settings["locations_order"]["setting_values"] ) ) );
$short_weekday_names = [
    'on_off' => $settings['short_weekday_names']['on_off'],
    'setting_values' => explode( ',', str_replace( [ '[' , ']', '"', ' ' ] , '', $settings["short_weekday_names"]["setting_values"] ) )
];
$ordered_locations = [];
foreach ( $locations as $loc ) {
    if ( $loc->LocationName === 'all' ) continue;
    if ( in_array( $loc->LocationName, $show_locations ) ) {
        if ( in_array( $loc->LocationName, $locations_order ) ) {
            $ordered_locations[$locations_order[$loc->LocationName]] = $loc;
        } else {
            $ordered_locations[] = $loc;
        }
    }
}
ksort( $ordered_locations );

$table_header_text = "Opening Hours and Contact"; //$wpdb->get_results( "SELECT setting_values FROM $table_name_settings WHERE setting_name = 'table_header_text' " );
$final_data = [];

foreach ( $ordered_locations as $loc ) {
    $loc_name = $loc->LocationName;
    $final_data[$loc_name] = [
        'times' => [],
        'infos' => [],
        'opening_label' => "",
        'short_weekday_names' => ('1' === $short_weekday_names['on_off']) !== in_array( $loc_name, $short_weekday_names['setting_values']),

    ];
    $final_data[$loc_name]['opening_label'] = "Opening Hours"; //$settings['opening_label']['setting_values']
    $final_data[$loc_name]['contact_label'] = "Contact"; //$settings['opening_label']['setting_values']
    $final_data[$loc_name]['closed_message'] = "Closed";
    
    for ( $n=1; $n<=7; $n++ ) {
        $one_day = $wpdb->get_results( "SELECT open, close FROM $table_name_times WHERE LocationName = '$loc_name' AND weekday='$n'", ARRAY_A );
        $final_data[$loc_name]['times'][$n] = [
            'weekday_name' => $final_data[$loc_name]['short_weekday_names']
                ? substr(date('D', strtotime("Sunday +{$n} days")), 0, -1)
                : date('l', strtotime("Sunday +{$n} days")),
            'is_open' => !!$one_day,
            'content' =>
                !$one_day
                    ? $final_data[$loc_name]['closed_message']
                    : $one_day,
        ];
    }
    $final_data[$loc_name]['infos'] = $wpdb->get_results( "SELECT info FROM $table_name_infos WHERE LocationName = '$loc_name'", ARRAY_A );
    $final_data[$loc_name]['setsize'] = !$final_data[$loc_name]['infos'] ? 2 : 3;
    $final_data[$loc_name]['contacts'] = $wpdb->get_results( "SELECT contact_label, contact_value FROM $table_name_contacts WHERE LocationName = '$loc_name' AND contact_active = 1", ARRAY_A );
    $final_data[$loc_name]['contacts'] = array_column($final_data[$loc_name]['contacts'], 'contact_value', 'contact_label');
}

$infos_all = $wpdb->get_results( "SELECT info FROM $table_name_infos WHERE LocationName = 'all' ", ARRAY_A );

$setsize = !$infos_all ? 2 : 3;

$wrapper_attributes = substr_replace( get_block_wrapper_attributes(), " alignfull", -1, 0 );
?>

<?php 
   function rmspace($buffer){ 
        return preg_replace('/(>)\s+|\s+(<)/', '$1$2', $buffer);
   };
?>
<?php ob_start("rmspace");  ?>
<div 
    <?= $wrapper_attributes; ?>
>
    <div 
        class="<?= $class_name ?>"
        id="opening-hours-table-wrap"
    >
        <div 
            class="<?= $class_name ?>"
            id="opening-hours-table-header"
        >
            <?= $table_header_text ?>
        </div>
        <table 
            role="treegrid" 
            class="<?= $class_name ?> outer-table"
            id="opening-hours-outer-table"
        >
            <tr
                role="row"
                aria-level=1
                ariaposinset=1
                aria-setsize=<?= $setsize ?>
                class="<?= $class_name ?> outer-table locations-label"
                id="outer-table-locations-label"
            >
                <?php foreach(array_keys($final_data) as $loc_name): ?>
                    <td
                        class="<?= $class_name ?> outer-table location-header"
                        id="outer-table-location-header-cell"
                    >
                        <div
                            class="<?= $class_name ?> outer-table location-header"
                            id="outer-table-location-header"
                        >
                            <?= $loc_name ?>
                </div>
                    </td>
                <?php endforeach; ?>
            </tr>
            <tr
                role="row"
                aria-level=2
                ariaposinset=2
                aria-setsize=<?= $setsize ?>
                class="<?= $class_name ?> outer-table locations-body"
                id="outer-table-locations-body"
            >
                <?php foreach($ordered_locations as $loc): ?>
                    <td
                        class="<?= $class_name ?> outer-table locations-inner"
                        id="outer-table-locations-inner"
                    >
                        <table 
                            role="treegrid" 
                            class="<?= $class_name ?> inner-table"
                            id="inner-table"
                        >
                            <tr
                                role="row"
                                aria-level=1
                                ariaposinset=1
                                aria-setsize=<?= $final_data[$loc->LocationName]['setsize'] ?>
                                class="<?= $class_name ?> inner-table headers"
                                id="inner-table-row-headers"
                            >
                                <td
                                    class="<?= $class_name ?> inner-table headers openings"
                                    id="inner-table-header-openings"
                                >
                                    <?= $final_data[$loc->LocationName]['opening_label'] ?>
                                </td>
                                <td
                                    class="<?= $class_name ?> inner-table headers contacts"
                                    id="inner-table-header-contacts"
                                >
                                    <?= $final_data[$loc->LocationName]['contact_label'] ?>
                                </td>
                            </tr>
                            <tr
                                role="row"
                                aria-level=2
                                ariaposinset=2
                                aria-setsize=<?= $setsize ?>
                                class="<?= $class_name ?> inner-table body"
                                id="inner-table-body"
                            >
                                <td
                                    class="<?= $class_name ?> inner-table body openings"
                                    id="inner-table-opening"
                                >
                                    <div
                                        class="<?= $class_name ?> inner-table body openings"
                                        id="inner-table-openings"
                                    >
                                        <?php foreach($final_data[$loc->LocationName]['times'] as $one_day): ?>
                                            <div 
                                                class="<?= $class_name ?> inner-table body openings one-day"
                                                id="inner-table-openings-one-day"
                                            >
                                                <span
                                                    class="<?= $class_name ?> inner-table body openings one-day weekday-name"
                                                    id="inner-table-openings-one-day-weekday-name"
                                                >
                                                    <?= $one_day['weekday_name'] ?>:
                                                </span>
                                                <span
                                                    class="<?= $class_name ?> inner-table body openings one-day times"
                                                    id="inner-table-openings-one-day-times"
                                                >
                                                    <?php if($one_day['is_open']): ?>
                                                        <?php foreach($one_day['content'] as $one_time): ?>
                                                            <span
                                                                id="open-close"
                                                            >
                                                                <?= substr($one_time['open'], 0, -3) ?>
                                                                <span id="minus"></span>
                                                                <?= substr($one_time['close'], 0, -3) ?>
                                                            </span>
                                                         <?php endforeach ?>
                                                    <?php else: ?>
                                                        <span
                                                            class="<?= $class_name ?> closed-message";
                                                            id="inner-table-openings-one-day-times-closed-message"
                                                        >
                                                            <?= $one_day['content'] ?>
                                                        </span>
                                                    <?php endif ?>
                                                </span>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </td>
                                <td
                                    class="<?= $class_name ?> inner-table body contacts"
                                    id="inner-table-contacts"
                                >
                                    <?php foreach($final_data[$loc->LocationName]['contacts'] as $label => $value): ?>
                                        <div
                                            class="<?= $class_name ?> inner-table body contacts label <?= $label ?>"
                                            id="inner-table-label-<?=  $label ?>"
                                        >
                                            <?= $contact_labels[$label] ?>: 
                                        </div>
                                        <div
                                            class="<?= $class_name ?> inner-table body contacts value <?= $label ?>"
                                            id="inner-table-contacts-value-<?= $label ?>"
                                        >
                                            <?=  value_link($label, $value) ?>
                                        </div>
                                    <?php endforeach ?>
                                </td>
                            </tr>
                            <tr
                                role="row"
                                aria-level=3
                                ariaposinset=3
                                aria-setsize=3
                                class="<?= $class_name ?> inner-table location-infos"
                                id="inner-table-location-infos"
                            >
                                <td
                                    class="<?= $class_name ?> inner-table location-infos"
                                    id="inner-table-location-infos"
                                    colspan=2
                                >
                                    <?php foreach($final_data[$loc->LocationName]['infos'] as $one_info): ?>
                                        <div
                                            class="<?= $class_name ?> location-infos one-info"
                                            id="inner-table-one-info"
                                        >
                                            <?= $one_info['info'] ?>
                                        </div>
                                    <?php endforeach ?>
                                </td>
                            </tr>
                        </table>
                    </td>
                <?php endforeach; ?>
            </tr>
            <tr
                role="row"
                aria-level=3
                ariaposinset=3
                aria-setsize=3
                class="<?= $class_name ?> outer-table info-all"
                id="outer-table-info-all"
            >
                <td 
                class="<?= $class_name ?> outer-table info-all inner"
                id="outer-table-info-all-inner"
                colspan=<?= count( $final_data ) ?>
                >
                    <?php foreach($infos_all as $info): ?>
                        <div
                            class="<?= $class_name ?> outer-table info-all inner"
                            id="outer-table-info-all"
                        >
                            <?= $info['info'] ?>
                        </div>
                    <?php endforeach ?>
                </td>
            </tr>
        </table>
    </div>
</div>
<?php ob_end_flush(); ?>