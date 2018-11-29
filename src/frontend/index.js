/**
 * Front-end Code
 *
 * All code related to front-end scripting should be located here.
 */

import ProgressBar from 'progressbar.js';
import { default as Registry } from './ProgressBarRegistry';

document.addEventListener('DOMContentLoaded', onContentLoaded);

function onContentLoaded (e) {
	// Ensure we only fire once
	document.removeEventListener( 'DOMContentLoaded', this );

	// Now we will get all our progressbar elements and initiate them
	let elements = document.querySelectorAll( "[data-progressbar]" );

	for (let i in elements) {
		if ( !elements.hasOwnProperty( i ) ) {
			continue;
		}

		initiatePb(elements[i]);
	}
}

function initiatePb(node) {
	let inst = null;

	let type = node.getAttribute( 'data-progressbar' );
	let width = node.getAttribute( 'data-width' );
	let height = node.getAttribute( 'data-height' );
	let duration = node.getAttribute( 'data-duration' );
	let easing = node.getAttribute( 'data-easing' );
	let color = node.getAttribute( 'data-color' );
	let strokeWidth = 3;
	let showProgress = node.getAttribute( 'data-percentage ') == 'true';

	node.style['width']  = width  + 'px';
	node.style['height'] = ( height === null ? width : height ) + 'px';

	inst = new ProgressBar[{
		'line': 'Line',
		'circle': 'Circle',
		'semicircle': 'SemiCircle',
	}[type]](node, {
		color,
		strokeWidth,
		duration: parseInt( duration ),
		easing,
		warnings: true,

		// And on step we will update the text
		step: function(state, reference, attachment) {
			// If there is no offset property, forget this attempt.
			if ( !state.hasOwnProperty( 'offset' ) ) {
				return;
			}

			// Should we show the percentage?
			if ( node.getAttribute('data-percentage') != 'true' ) {
				return;
			}

			updatePercentage( inst, true );
		}
	});

	let identifier = node.getAttribute('id');
	Registry.add(identifier, {
		node,
		inst,
	});

	initiateAnimations( inst, node );
	updatePercentage( inst, node );

	return inst;
}

function updatePercentage( inst, value ) {
	if ( value ) {
		let progress = Math.round( inst.value() * 100 )
		inst.setText( progress + '%' );
	} else {
		inst.setText( '' );
	}
}

function initiateAnimations( inst, node ) {
	function animate() {
		let value = node.getAttribute( 'data-value' );

		if ( 'static' === node.getAttribute( 'data-type' ) ) {
			if ( inst.value() !== value ) {
				inst.set( value );
				updatePercentage( inst, value );
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
				let observer = new IntersectionObserver( e => {
					if ( ! e[0].isIntersecting ) {
						return;
					}

					observer.unobserve( node );
					animate();
				}, {
					root: null,
					threshold: 1.0,
				});

				observer.observe( node );
				return;
			}

			// Manually handle scrolling
			throw Error( 'Not yet implemented!' );
			break;

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
