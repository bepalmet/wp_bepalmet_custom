<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Bepalmet-Custom
 * @subpackage Bepalmet-Custom/admin/partials
 */
// Generiert die Sicherheits-URL mit einer Nonce zur Absicherung gegen CSRF
$download_url = wp_nonce_url(
    admin_url('admin-post.php?action=bepalmet_download_export'),
    'bepalmet_export_nonce'
);
$upload_url = wp_nonce_url(
    admin_url('admin-post.php?action=bepalmet_upload_import'),
    'bepalmet_import_nonce'
);
$class = "bepalmet-custom"
?>

<div class="<?= $class ?> header wrap">
    <h1>
        General settings for the plugin
    </h1>
    <div class="<?= $class ?> import-export wrap">
        <div class="<?= $class ?> import-export header-wrap">
            <h3>
                Import/Export
            </h3>
        </div>
        <div class="<?= $class ?> import-export body-wrap">
            <div class="<?= $class ?> import-export export-header-wrap">
                <h4>
                    Export plugin data to file
                </h4>
            </div>
            <div class="<?= $class ?> import-export export-button-wrap">
                <a href="<?php echo esc_url($download_url); ?>" class="button button-primary">Download export file</a>
            </div>
            <div class="<?= $class ?> import-export import-header-wrap">
                <h4>
                    Import plugin data from file
                </h4>
            </div>
            <form action="<?php echo esc_attr('admin-post.php'); ?>" method="post" enctype="multipart/form-data" class="<?= $class ?> import-export upload-form">
                <input type="hidden" name="action" value="bepalmet_upload_import"/>
                <div class="<?= $class ?> import-export import-button-wrap">
                    <input type="file" accept=".json" name="import_file" id="import-file" class="<?= $class ?> import-export upload-file" required>
                    <input type="submit" value="Upload file" name="submit" class="<?= $class ?> import-export submit-file button is-secondary">
                </div>
            </form>
        </div>
    </div>
</div>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
