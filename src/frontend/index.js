/**
 * Front-end Code
 *
 * All code related to front-end scripting should be located here.
 */

import ProgressBar from 'progressbar.js';
import { default as Registry } from './ProgressBarRegistry';

document.addEventListener( 'DOMContentLoaded', onContentLoaded );

function onContentLoaded() {
	// Ensure we only fire once
	document.removeEventListener( 'DOMContentLoaded', this );

	// Now we will get all our progressbar elements and initiate them
	const elements = document.querySelectorAll( '[data-progressbar]' );

	for ( const i in elements ) {
		if ( ! elements.hasOwnProperty( i ) ) {
			continue;
		}

		initiatePb( elements[ i ] );
	}
}

function initiatePb( node ) {
	let inst = null;

	const type = node.getAttribute( 'data-progressbar' );
	const width = node.getAttribute( 'data-width' );
	const height = node.getAttribute( 'data-height' );
	const duration = node.getAttribute( 'data-duration' );
	const easing = node.getAttribute( 'data-easing' );
	const color = node.getAttribute( 'data-color' );
	const strokeWidth = 3;

	node.style.width = width + 'px';
	node.style.height = ( height === null ? width : height ) + 'px';

	inst = new ProgressBar[ {
		line: 'Line',
		circle: 'Circle',
		semicircle: 'SemiCircle',
	}[ type ] ]( node, {
		color,
		strokeWidth,
		duration: parseInt( duration ),
		easing,
		warnings: false,

		// And on step we will update the text
		step: function( state ) {
			// If there is no offset property, forget this attempt.
			if ( ! state.hasOwnProperty( 'offset' ) ) {
				return;
			}

			updatePercentage( inst, node );
		},
	} );

	const identifier = node.getAttribute( 'id' );
	Registry.add( identifier, {
		node,
		inst,
	} );

	initiateAnimations( inst, node );
	updatePercentage( inst, node );

	return inst;
}

function updatePercentage( inst, node ) {
	if ( node.getAttribute( 'data-percentage' ) === 'true' ) {
		const progress = Math.round( inst.value() * 100 );
		inst.setText( progress + '%' );
	} else {
		inst.setText( '' );
	}
}

function initiateAnimations( inst, node ) {
	function animate() {
		const value = node.getAttribute( 'data-value' );

		if ( 'static' === node.getAttribute( 'data-type' ) ) {
			if ( inst.value() !== value ) {
				inst.set( value );
				updatePercentage( inst, node );
			}
		} else {
			inst.set( 0 );
			inst.animate( node.getAttribute( 'data-value' ) );
		}
	}

	if ( 'static' === node.getAttribute( 'data-type' ) ) {
		animate();
	}

	switch ( node.getAttribute( 'data-animation' ) ) {
		case 'show':
			if ( window.IntersectionObserver ) {
				// eslint-disable-next-line no-undef
				const observer = new IntersectionObserver( e => {
					if ( ! e[ 0 ].isIntersecting ) {
						return;
					}

					observer.unobserve( node );
					animate();
				}, {
					root: null,
					threshold: 1.0,
				} );

				observer.observe( node );
				return;
			}

			// Manually handle scrolling
			throw Error( 'Not yet implemented!' );

		case 'hover':
			animate();
			node.addEventListener( 'mouseover', animate );
			break;

		case 'click':
			node.addEventListener( 'click', animate );
			break;
	}
}

export default initiatePb;
