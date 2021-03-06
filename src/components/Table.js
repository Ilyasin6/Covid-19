import React from 'react';
import './Table.css';
import numeral from 'numeral';

function Table({ countries, theme }) {
	return (
		<div className={`table ${theme === 'dark' && 'dark-theme'}`}>
			<table>
				<tbody>
					{countries.map(({ country, cases }, i) => {
						return (
							<tr key={i}>
								<td>{country}</td>
								<td>
									<strong>{numeral(cases).format('0,0')}</strong>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default Table;
