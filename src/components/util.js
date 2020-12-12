import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';
import LineGraph from './LineGraph';
import CircleMap from './CircleMap';

const casesTypeColors = {
	cases: {
		hex: '#CC1034',
		rgb: 'rgb(204, 16, 52)',
		half_op: 'rgba(204, 16, 52, 0.5)',
		multiplier: 250
	},
	recovered: {
		hex: '#7dd71d',
		rgb: 'rgb(125, 215, 29)',
		half_op: 'rgba(125, 215, 29, 0.5)',
		multiplier: 500
	},
	deaths: {
		hex: '#fb4443',
		rgb: 'rgb(251, 68, 67)',
		half_op: 'rgba(251, 68, 67, 0.5)',
		multiplier: 1000
	}
};

export const sortData = (data) => {
	const sortedData = [ ...data ];

	sortedData.sort((a, b) => {
		if (a.cases > b.cases) {
			return -1;
		} else {
			return 1;
		}
	});

	return sortedData;
};

export const showDataOnMap = (data, zoom, casesType = 'cases') => {
	return data.map((country) => {
		console.log(country);
		return (
			<CircleMap
				zoom={zoom}
				country={country}
				casesType={casesType}
				casesTypeColors={casesTypeColors}
			/>
		);
	});
};
