import ProgressBar from 'progressbar.js';
import { default as initPb } from '../frontend/index';
import { default as Registry } from '../frontend/ProgressBarRegistry';

const { __ } = wp.i18n;
const {
	addAction,
	removeAction,
} = wp.hooks;
const { Component } = wp.element;
const {
	BlockControls,
	InspectorControls,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	PanelBody,
	ColorPicker,
	RangeControl,
	SelectControl,
	ToggleControl,
} = wp.components;

var DOMLoaded = false;

function Editor( shape ) {
	class BlockEdit extends Component {
		componentDidMount() {
			var pb = null
			let node = document.querySelector('#block-' + this.props.clientId + ' [data-progressbar]');

			// This is how we will get our 'pb'
			addAction( 'item.added', 'pb-' + this.props.clientId, ( inst ) => {
				let nodeId = inst.node.getAttribute( 'id' );
				if ( nodeId !== `pb-${this.props.clientId}` ) {
					return;
				}

				pb = inst.inst;

				let value = this.props.attributes.value;
				this.updateValue( value );

				removeAction( 'item.added', 'pb-' + this.props.clientId );
			} );

			// Create handlers for attribute changes
			const update = ( key, value ) => {
				pb._progressPath._opts[key] =
				pb._opts[key] = value;
			}

			this.updateWidth = ( value ) => {
				node.style['width']  = `${value}px`;

				if ( undefined === this.props.attributes.height ) {
					node.style['height'] = `${value}px`;
				}
			};
			this.updateHeight = ( value ) => {
				if ( undefined !== this.props.attributes.height ) {
					node.style['height'] = `${value}px`;
				}
			};
			this.updateValue    = ( value ) => {
				pb.set( value );
				update( 'value', value );
				this.updatePercentage( value );
			}
			this.updateDuration = value => update( 'duration', value );
			this.updateEasing   = value => update( 'easing', value );
			this.updateColor    = value => {
				update( 'color', value )
				pb.path.setAttribute( 'stroke', value );
				pb.text == undefined ? null: pb.text.style['color'] = value;
			};
			this.updateAlignment = value => {
				let margin = [ 0, 0, 0, 0 ];

				if ( [ 'left', 'center' ].includes( value ) ) {
					margin[1] = 'auto';
				}
				if ( [ 'right', 'center' ].includes( value ) ) {
					margin[3] = 'auto';
				}

				node.style['margin'] = margin.join( ' ' );
			};
			this.updatePercentage = value => {
				if ( this.props.attributes.showPercentage ) {
					let progress = Math.round( pb.value() * 100 )
					pb.setText( progress + '%' );
				} else {
					pb.setText( '' );
				}
			}

			// If DOMContentLoaded has already fired, we will manually call
			// for initialization of the progressbar.
			if ( DOMLoaded ) {
				initPb( node );
			}

			this.updateAlignment( this.props.attributes.alignment );
		}

		componentDidUpdate() {
			if ( ! DOMLoaded ) return;

			this.updateWidth( this.props.attributes.width );
			this.updateHeight( this.props.attributes.height );
			this.updateDuration( this.props.attributes.duration );
			this.updateEasing( this.props.attributes.easing );
			this.updateColor( this.props.attributes.color );
			this.updateAlignment( this.props.attributes.alignment );
			this.updateValue( this.props.attributes.value );
		}

		componentWillUnmount() {
			Registry.remove( `pb-${this.props.attributes.uuid}` );
		}

		render() {
			const {
				attributes: {
					width,
					height,
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
				attributes,
				className,
				setAttributes
			} = this.props;

			// A few quick event handlers
			const setWidth = value => setAttributes( { width: value } );
			const setHeight = value => setAttributes( { height: value } );
			const setValue = value => setAttributes( { value: value / 100 } );
			const setType = value => setAttributes( { type: value } );
			const setAnimation = value => setAttributes( { animation: value } );
			const setDuration = value => setAttributes( { duration: value } );
			const setEasing = value => setAttributes( { easing: value } );
			const setColor = value => setAttributes( { color: value.hex } );
			const setPercentage = value => setAttributes( { showPercentage: value } );
			const setAlignment = value => setAttributes( { alignment: value } );

			setAttributes( { uuid: this.props.clientId } );

			// The attributes to output on the div
			let nodeAttributes = {
				'id': `pb-${this.props.clientId}`,
				'className': className,
				'data-progressbar': shape,
				'data-width': width,
				'data-height': height,
				'data-value': value,
				'data-type': type,
				'data-animation': "click",
				'data-duration': duration,
				'data-easing': easing,
				'data-color': color,
				'data-percentage': showPercentage,
				'data-align': alignment,
			}

			// If we don't use a height, don't add one to attributes
			if ( undefined === height ) {
				delete nodeAttributes['data-height'];
			}

			return ( [
				<BlockControls>
					<BlockAlignmentToolbar
						value={ alignment }
						onChange={ setAlignment }
						controls={ [ 'left', 'center', 'right' ] }
					/>
				</BlockControls>,
				<InspectorControls>
					<PanelBody title={ __( 'ProgressBar Settings', 'aeontech' ) }>
						<RangeControl
							label={ __( 'Width', 'aeontech' ) }
							value={ width }
							onChange={ setWidth }
							min={ 50 }
							max={ 1600 }
							step={ 10 }
						/>
						{ height !== undefined &&
						<RangeControl
							label={ __( 'Height', 'aeontech' ) }
							value={ height }
							onChange={ setHeight }
							min={ 50 }
							max={ 1600 }
							step={ 10 }
						/>
						}
						<RangeControl
							label={ __( 'Value', 'aeontech' ) }
							value={ value * 100 }
							onChange={ setValue }
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
						<SelectControl
							label={ __( 'Display Type', 'aeontech' ) }
							value={ type }
							options={ [
								{ label: __( 'Static', 'aeontech' ), value: 'static' },
								{ label: __( 'Dynamic', 'aeontech' ), value: 'dynamic' },
							] }
							onChange={ setType }
						/>
						{ type && type == 'dynamic' && ( [
							<SelectControl
								label={ __( 'Animation Trigger', 'aeontech' ) }
								value={ animation }
								options={ [
									{ label: __( 'On Visible', 'aeontech' ), value: 'show' },
									{ label: __( 'On Hover', 'aeontech' ), value: 'hover' },
									{ label: __( 'On Click', 'aeontech' ), value: 'click' },
								] }
								onChange={ setAnimation }
							/>,
							<SelectControl
								label={ __('Animation Easing', 'aeontech' ) }
								value={ easing }
								options={ [
									{ label: __( 'Linear', 'aeontech' ), value: 'linear' },
									{ label: __( 'Ease In Quad', 'aeontech' ), value: 'easeInQuad' },
									{ label: __( 'Ease Out Quad', 'aeontech' ), value: 'easeOutQuad' },
									{ label: __( 'Ease In Out Quad', 'aeontech' ), value: 'easeInOutQuad' },
									{ label: __( 'Ease In Cubic', 'aeontech' ), value: 'easeInCubic' },
									{ label: __( 'Ease Out Cubic', 'aeontech' ), value: 'easeOutCubic' },
									{ label: __( 'Ease In Out Cubic', 'aeontech' ), value: 'easeInOutCubic' },
									{ label: __( 'Ease In Quart', 'aeontech' ), value: 'easeInQuart' },
									{ label: __( 'Ease Out Quart', 'aeontech' ), value: 'easeOutQuart' },
									{ label: __( 'Ease In Out Quart', 'aeontech' ), value: 'easeInOutQuart' },
									{ label: __( 'Ease In Quint', 'aeontech' ), value: 'easeInQuint' },
									{ label: __( 'Ease Out Quint', 'aeontech' ), value: 'easeOutQuint' },
									{ label: __( 'Ease In Out Quint', 'aeontech' ), value: 'easeInOutQuint' },
									{ label: __( 'Ease In Sine', 'aeontech' ), value: 'easeInSine' },
									{ label: __( 'Ease Out Sine', 'aeontech' ), value: 'easeOutSine' },
									{ label: __( 'Ease In Out Sine', 'aeontech' ), value: 'easeInOutSine' },
									{ label: __( 'Ease In Expo', 'aeontech' ), value: 'easeInExpo' },
									{ label: __( 'Ease Out Expo', 'aeontech' ), value: 'easeOutExpo' },
									{ label: __( 'Ease In Out Expo', 'aeontech' ), value: 'easeInOutExpo' },
									{ label: __( 'Ease In Circ', 'aeontech' ), value: 'easeInCirc' },
									{ label: __( 'Ease Out Circ', 'aeontech' ), value: 'easeOutCirc' },
									{ label: __( 'Ease In Out Circ', 'aeontech' ), value: 'easeInOutCirc' },
									{ label: __( 'Ease Out Bounce', 'aeontech' ), value: 'easeOutBounce' },
									{ label: __( 'Ease In Back', 'aeontech' ), value: 'easeInBack' },
									{ label: __( 'Ease Out Back', 'aeontech' ), value: 'easeOutBack' },
									{ label: __( 'Ease In Out Back', 'aeontech' ), value: 'easeInOutBack' },
									{ label: __( 'Elastic', 'aeontech' ), value: 'elastic' },
									{ label: __( 'Swing From To', 'aeontech' ), value: 'swingFromTo' },
									{ label: __( 'Swing From', 'aeontech' ), value: 'swingFrom' },
									{ label: __( 'Swing To', 'aeontech' ), value: 'swingTo' },
									{ label: __( 'Bounce', 'aeontech' ), value: 'bounce' },
									{ label: __( 'Bounce Past', 'aeontech' ), value: 'bouncePast' },
									{ label: __( 'Ease From To', 'aeontech' ), value: 'easeFromTo' },
									{ label: __( 'Ease From', 'aeontech' ), value: 'easeFrom' },
									{ label: __( 'Ease To', 'aeontech' ), value: 'easeTo' },
								] }
								onChange={ setEasing }
							/>,
							<RangeControl
								label={ __('Animation Duration (ms)', 'aeontech' ) }
								value={ duration }
								onChange={ setDuration }
								min={ 0 }
								max={ 10 * 1000 }
								step={ 100 }
							/>
						] ) }
						<ColorPicker
							label={ __( 'Color', 'aeontech' ) }
							color={ color }
							onChangeComplete={ setColor }
							disableAlpha
						/>
						<ToggleControl
							label={ __( 'Display Percentage', 'aeontech' ) }
							checked={ showPercentage }
							onChange={ setPercentage }
						/>
					</PanelBody>
				</InspectorControls>,
				<div { ...nodeAttributes } />
			] );
		}
	}

	return BlockEdit;
}

document.addEventListener( 'DOMContentLoaded', e => DOMLoaded = true );

export default Editor;
