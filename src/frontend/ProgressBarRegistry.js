const {
	doAction,
	applyFilters,
} = wp.hooks;

class Registry {
	constructor() {
		this.store = {};
	}

	has( identifier ) {
		const hasProperty = this.store.hasOwnProperty( identifier );
		return applyFilters( 'item.exists', hasProperty );
	}

	add( identifier, item ) {
		if ( this.store.hasOwnProperty( identifier ) ) {
			throw Error( 'Property "' + identifier + '" already exists.' );
		}

		this.store[ identifier ] = item;
		doAction( 'item.added', item );
	}

	remove( identifier ) {
		if ( ! this.has( identifier ) ) {
			throw Error( 'Invalid property identifier "' + identifier + '".' );
		}

		delete this.store[ identifier ];

		const value = this.store[ identifier ];
		doAction( 'item.removed', value );
	}

	get( identifier ) {
		if ( ! this.has( identifier ) ) {
			throw Error( 'Invalid property identifier "' + identifier + '".' );
		}

		const value = this.store[ identifier ];
		return applyFilters( 'item.retrieve', value );
	}
}

export default new Registry;
