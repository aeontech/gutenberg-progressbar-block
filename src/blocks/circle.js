/**
 * BLOCK: progressbar
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { default as BlockEdit } from '../editor';
import 'progressbar.js';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

registerBlockType( 'shane/progressbar-circle', {
	title: __( 'Circular' ),
	icon: <svg viewbox="0 0 24 24" width="24" height="24"><mask id="hole"><g><rect x="0" y="0" width="24" height="24" fill="#ffffff" /><path d="M 8.0467836,18.502607 C 4.4340505,16.486474 3.4325417,12.492547 5.3547817,8.866479 6.0297777,7.593182 6.8338036,6.7247688 7.9320907,6.011174 9.3252274,5.1060053 10.979213,4.6924265 12.639865,4.8477907 14.367,5.0093747 16.101347,5.7863678 17.556957,7.26579" fillOpacity="0" stroke="#090909" strokeWidth="2" strokeLinecap="round" /></g></mask><path d="M 7.6760394,18.457644 C 7.3698082,18.29481 8.8120979,19.264067 7.78729,18.549324 7.78215,18.545724 7.761832,18.518114 7.6760394,18.457644 6.5961302,17.696415 5.752339,16.672769 5.2066627,15.506755 c -0.669093,-1.42972 -0.889972,-3.073499 -0.548346,-4.709992 0.725661,-3.476134 3.790318,-5.965954 7.3417583,-5.965954 3.551442,0 6.535183,2.3684572 7.260843,5.844591 0.72567,3.476172 -0.277624,6.702022 -3.532664,8.122642" mask="url(#hole)" fillOpacity="0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>,
	category: 'progressbar',
	keywords: [
		__( 'progress' ),
		__( 'progressbar' ),
		__( 'circular' ),
	],

	attributes: {
		width: {
			type: 'number',
			default: 150,
		},
		value: {
			type: 'number',
			default: 0.5,
		},
		type: {
			type: 'string',
			default: 'dynamic',
		},
		animation: {
			type: 'string',
			default: 'show',
		},
		duration: {
			type: 'number',
			default: 500,
		},
		easing: {
			type: 'string',
			default: 'linear',
		},
		showPercentage: {
			type: 'boolean',
			default: true,
		},
		color: {
			type: 'string',
			default: '#4682B4',
		},
		alignment: {
			type: 'string',
			default: 'center',
		},
		uuid: {
			type: 'string',
		},
	},

	edit: new BlockEdit( 'circle' ),

	save: function( props ) {
		const {
			attributes: {
				width,
				value,
				type,
				animation,
				duration,
				easing,
				color,
				showPercentage,
				alignment,
				uuid,
			},
			className,
		} = props;

		return (
			<div
				id={ `pb-${ uuid }` }
				className={ className }
				data-progressbar="circle"
				data-width={ width }
				data-value={ value }
				data-type={ type }
				data-animation={ animation }
				data-duration={ duration }
				data-easing={ easing }
				data-color={ color }
				data-percentage={ showPercentage }
				data-align={ alignment }
			/>
		);
	},
} );
