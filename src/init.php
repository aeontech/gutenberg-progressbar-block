<?php
/**
 * Enqueue JS for all the blocks.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for frontend.
 */
function progressbar_cgb_block_assets() {
	// We will not enqueue our frontend script in the admin panel
	if ( is_admin() ) {
		return;
	}

	wp_enqueue_script(
		'progressbar-cgb-frontend-js',
		plugins_url( '/dist/frontend.build.js', dirname( __file__ ) ),
		array( 'wp-hooks' )
		,filemtime( plugin_dir_path( __DIR__ ) . 'dist/frontend.build.js' ),
		true
	);
}
add_action( 'enqueue_block_assets', 'progressbar_cgb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 */
function progressbar_cgb_editor_assets() {
	wp_enqueue_script(
		'progressbar-cgb-block-js',
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-hooks' ),
		filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ),
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'progressbar_cgb_editor_assets' );

/**
 * Filter Gutenberg categories to add our own!
 *
 * @since 1.0.0
 */
function progressbar_cgb_block_categories( $categories, $post ) {
	$category =	array(
		'slug' => 'progressbar',
		'title' => __( 'Progress Bars', 'progressbar' )
	);

	// Now we must find the Layout category, and splice in our array after.
	for ( $i = 0; $i < count( $categories ); $i++ ) {
		if ( 'layout' === $categories[$i]['slug'] ) {
			break;
		}
	}

	// Slot our category in
	$categories = array_merge (
		array_slice( $categories, 0, $i + 1 ),
		array( $category ),
		array_slice( $categories, $i + 1 )
	);

	return $categories;
}
add_filter( 'block_categories', 'progressbar_cgb_block_categories', 10, 2 );
