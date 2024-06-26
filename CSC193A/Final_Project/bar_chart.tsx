'use client';

import React, { useState, useRef, useEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {
	getFilteredRevenueChartData,
	ChartData,
} from '@/lib/actions/dashboard';
import { getCookie } from '@/lib/actions/client';

function LineChart(props: { id: string; className: string }) {
	const { id, className } = props;
	const chartRef = useRef<am5xy.XYChart | null>(null);
	const [chartData, setChartData] = useState<ChartData[]>([]);

	const [org_id, setOrgId] = useState<string | null>(null);

	useEffect(() => {
		// Fetch org_id from cookie
		const org_id = getCookie('org');
		setOrgId(org_id);

		// Call the function to fetch and set data for the chart
		const fetchData = async () => {
			const data = await getFilteredRevenueChartData({
				org_id: org_id,
				type: 'month',
			}); // or 'yearly', based on your requirement
			setChartData(data);
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (chartData.length === 0) {
			return () => {};
		}
		const root = am5.Root.new(`${id}`);

		root.setThemes([am5themes_Animated.new(root)]);

		// Create chart
		const chart = root.container.children.push(
			am5xy.XYChart.new(root, {
				panX: false,
				panY: false,
				wheelX: 'panX',
				wheelY: 'zoomX',
				pinchZoomX: true,
			}),
		);

		// Add cursor
		const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
		cursor.lineY.set('visible', false);

		// Create axes
		const xRenderer = am5xy.AxisRendererX.new(root, {
			minGridDistance: 30,
		});
		const xAxis = chart.xAxes.push(
			am5xy.CategoryAxis.new(root, {
				maxDeviation: 0.3,
				categoryField: 'date',
				renderer: xRenderer,
				tooltip: am5.Tooltip.new(root, {}),
			}),
		);
		xAxis.get('renderer').labels.template.setAll({
			fontSize: `.5rem`,
		});

		const yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(root, {
				renderer: am5xy.AxisRendererY.new(root, {}),
			}),
		);
		yAxis.get('renderer').labels.template.setAll({
			fontSize: `.6rem`,
		});

		// Add series
		function makeSeries(name: string, fieldName: string, color: string) {
			const series = chart.series.push(
				am5xy.LineSeries.new(root, {
					name: name,
					xAxis: xAxis,
					yAxis: yAxis,
					valueYField: fieldName,
					categoryXField: 'date',
					stroke: am5.color(color),
					tooltip: am5.Tooltip.new(root, {
						labelText: '{valueY}',
					}),
				}),
			);

			series.strokes.template.set('strokeWidth', 2);
			series.data.setAll(chartData);

			const bullet = series.bullets.push(function () {
				return am5.Bullet.new(root, {
					sprite: am5.Circle.new(root, {
						radius: 4,
						fill: am5.color(color),
					}),
				});
			});

			chartRef.current = chart;
		}

		// Set data
		// const chartData = [
		// 	{
		// 		date: new Date('2023-01-01'),
		// 		income: 6500,
		// 		expenses: 4800,
		// 	},
		// 	{
		// 		date: new Date('2023-02-15'),
		// 		income: 5400,
		// 		expenses: 4100,
		// 	},
		// 	{
		// 		date: new Date('2023-02-20'),
		// 		income: 6700,
		// 		expenses: 4300,
		// 	},
		// 	{
		// 		date: new Date('2023-03-10'),
		// 		income: 7100,
		// 		expenses: 3900,
		// 	},
		// ];

		// Create series for each category
		if (chartData.length > 0) {
			// Create series for each category
			makeSeries('Income', 'income', '#34568B');
			makeSeries('Expenses', 'expenses', '#FF6F61');

			// This should update whenever chartData changes, hence included in useLayoutEffect
			xAxis.data.setAll(chartData.map(item => ({ date: item.date })));
			chart.series.each(series => {
				series.data.setAll(chartData);
			});
		}
		// Add legend
		const legend = chart.children.push(
			am5.Legend.new(root, {
				centerX: am5.p50,
				x: am5.p50,
			}),
		);
		legend.data.setAll(chart.series.values);

		xAxis.data.setAll(chartData);
		// console.log('CHARTDATA LINE CHART', chartData);

		return () => {
			root.dispose();
		};
	}, [chartData, org_id]);

	if (chartData.length === 0) {
		return (
			<div
				id={`${id}`}
				className={`${className} chart-no-data`}
				style={{
					width: '100%',
					height: '20rem',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<p className="text-primary-green-500 text-lg">
					No data is present 😕
				</p>
			</div>
		);
	}
	return (
		// Render the chart
		<div
			id={`${id}`}
			className={`${className}`}
			style={{ width: '100%', height: '20rem' }}
		></div>
	);
}

export default LineChart;
