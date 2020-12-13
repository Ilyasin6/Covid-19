import React from 'react';
import { Circle, Popup } from 'react-leaflet';
import numeral from 'numeral';
import LineGraph from './LineGraph';
import styled from 'styled-components';

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
		multiplier: 300
	},
	deaths: {
		hex: '#fb4443',
		rgb: 'rgb(251, 68, 67)',
		half_op: 'rgba(251, 68, 67, 0.5)',
		multiplier: 1000
	}
};

function CircleMap({ data, casesType, theme }) {
	const StyledPop = styled(Popup)`
  
  .leaflet-popup-content-wrapper {
	${theme === 'dark' && 'background-color: #010b44;'}
    
  }
`;

	return data.map((country, i) => {
		//console.log(country);
		// console.log(casesTypeColors[casesType].hex);
		return (
			<Circle
				key={i}
				center={[ country.countryInfo.lat, country.countryInfo.long ]}
				color={casesTypeColors[casesType].rgb}
				fillColor={casesTypeColors[casesType].rgb}
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

export default CircleMap;
