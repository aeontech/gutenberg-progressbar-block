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

registerBlockType( 'shane/progressbar-line', {
	title: __( 'Line' ),
	icon: 'minus',
	category: 'progressbar',
	keywords: [
		__( 'progress' ),
		__( 'progressbar' ),
		__( 'line' ),
	],

	attributes: {
		width: {
			type: 'number',
			default: 150,
		},
		height: {
			type: 'number',
			default: 50,
		},
		strokeWidth: {
			type: 'number',
			default: 4,
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
		textColor: {
			type: 'string',
			default: '#555555',
		},
		textSize: {
			type: 'number',
			default: 22,
		},
		alignment: {
			type: 'string',
			default: 'center',
		},
		uuid: {
			type: 'string',
		},
	},

	edit: new BlockEdit( 'line' ),

	save: function( props ) {
		const {
			attributes: {
				width,
				height,
				strokeWidth,
				value,
				type,
				animation,
				duration,
				easing,
				color,
				textColor,
				textSize,
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
				data-progressbar="line"
				data-width={ width }
				data-height={ height }
				data-stroke={ strokeWidth }
				data-value={ value }
				data-type={ type }
				data-animation={ animation }
				data-duration={ duration }
				data-easing={ easing }
				data-color={ color }
				data-textcolor={ textColor }
				data-textsize={ textSize }
				data-percentage={ showPercentage }
				data-align={ alignment }
			/>
		);
	},
} );
