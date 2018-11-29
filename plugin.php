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
