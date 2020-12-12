import React from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';

function Map() {
	return (
		<div className="map">
			<LeafletMap>
				<TileLayer />
			</LeafletMap>
		</div>
	);
}

export default Map;
