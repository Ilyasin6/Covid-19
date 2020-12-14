import React, { useEffect } from 'react';
import { Circle, Popup } from 'react-leaflet';
import numeral from 'numeral';
import LineGraph from './LineGraph';
import styled from 'styled-components';

const casesTypeColors = {
	cases: {
		hex: '#CC1034',
		fill: 'rgb(204, 16, 52)',
		stroke: 'rgb(204, 16, 52)',
		half_op: 'rgba(204, 16, 52, 0.5)',
		multiplier: 250
	},
	recovered: {
		hex: '#7dd71d',
		fill: 'lightgreen',
		stroke: '#18ce18',
		half_op: 'rgba(125, 215, 29, 0.5)',
		multiplier: 300
	},
	deaths: {
		hex: '#fb4443',
		fill: ' #010b44',
		stroke: ' #010b44',
		rgb: 'rgb(251, 68, 67)',
		half_op: 'rgba(251, 68, 67, 0.5)',
		multiplier: 1000
	}
};

function MapCircles({ data, casesType, theme }) {
	const StyledPop = styled(Popup)`
  
  .leaflet-popup-content-wrapper {
	${theme === 'dark' && 'background-color: #010b44;'}
    
  }
`;

	const changeColor = (fill, stroke) => {
		const circles = document.querySelectorAll('.leaflet-interactive');
		circles.forEach((circle) => {
			circle.setAttribute('style', `fill: ${fill}; stroke: ${stroke}`);
		});
	};

	useEffect(
		() => {
			changeColor(
				casesTypeColors[casesType].fill,
				casesTypeColors[casesType].stroke
			);
		},
		[ casesType ]
	);

	return data.map((country, i) => {
		//console.log(country);
		// console.log(casesTypeColors[casesType].hex);

		return (
			<Circle
				className={`${casesType === 'deaths' && 'circle-deaths'}`}
				key={i}
				color={casesTypeColors.cases.fill}
				fillColor={casesTypeColors[casesType].fill}
				center={[ country.countryInfo.lat, country.countryInfo.long ]}
				fillOpacity={0.4}
				radius={
					Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
				}
			>
				<StyledPop className="popup">
					<div className={`info-container ${theme === 'dark' && 'dark-theme'}`}>
						<div className={`info-name ${theme === 'dark' && 'dark-theme'}`}>
							<div>{country.country}</div>
							<div
								className="info-flag"
								style={{
									backgroundImage: `url(${country.countryInfo.flag})`,
									backgroundPosition: 'center'
								}}
							/>
						</div>
						<div className="info-confirmed">
							Cases: {numeral(country.cases).format('0,0')}
						</div>
						<div className="info-recovered">
							Recovered: {numeral(country.recovered).format('0,0')}
						</div>
						<div className="info-deaths">
							Deaths: {numeral(country.deaths).format('0,0')}
						</div>
						<div>
							<LineGraph country={country.country} theme={theme} />
						</div>
					</div>
				</StyledPop>
			</Circle>
		);
	});
}

export default MapCircles;
