<?php
/**
 * Plugin Name: Gutenberg ProgressBar Block
 * Description: A block to create animated progress bars, in a block!
 * Author: Shane Thompson
 * Author URI: https://www.aeontech.com.au/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';

/**
 * The following ensures that the plugin will not be activated unless
 * properly built.
 */
function progressbar_gcb_activation_notices() {
	$errors = array();
	$distdir = plugin_dir_path( __FILE__ ) . 'dist/';
	$modsdir = plugin_dir_path( __FILE__ ) . 'node_modules/';
	$blockjs = $distdir . 'blocks.build.js';
	$frontendjs = $distdir . 'frontend.build.js';

	if ( !is_dir( $distdir ) || !is_dir( $modsdir ) ) {
		$errors[] = __(
			'The plugin build process has not been completed. Please read ' .
			'the README.md file for deployment instructions.', 'aeontech'
		);
	} else if ( !file_exists( $blockjs ) || !file_exists( $frontendjs ) ) {
		$errors[] = __(
			'One or more of the compiled JS files is missing. Please read ' .
			'the README.md file for deployment instructions.', 'aeontech'
		);
	}

	if ( !$errors ) {
		return;
	}

	// Suppress "Plugin activated" notice.
	unset( $_GET['activate'] );

	$name = get_file_data( __FILE__, array( 'Plugin Name' ), 'plugin' );
	$name = $name[0];

	printf(
		'<div class="error"><p>%1$s</p><p>%2$s</p></div>',
		join( '</p><p>', $errors ),
		sprintf( __( '<i>%s</i> has been deactivated.', 'aeontech' ), $name)
	);

	deactivate_plugins( plugin_basename( __FILE__ ) );
}
add_action( 'admin_notices', 'progressbar_gcb_activation_notices', 0 );
