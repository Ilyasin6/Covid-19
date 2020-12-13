import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
//import { showDataOnMap } from './util';
import CircleMap from './CircleMap';
import './Map.css';

function ChangeView({ center, zoom }) {
	const map = useMap();
	map.setView(center, zoom);
	return null;
}

function Map({ center, zoom, countries, casesType, theme }) {
	return (
		<div className={`map ${theme === 'dark' && 'dark-theme'}`}>
			<MapContainer center={center} zoom={zoom}>
				<ChangeView center={center} zoom={zoom} />
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
				/>
				<CircleMap data={countries} casesType={casesType} theme={theme} />
				{/* {showDataOnMap(countries, zoom, casesType)} */}
			</MapContainer>
		</div>
	);
}

export default Map;
