type = ['', 'info', 'success', 'warning', 'danger'];
demo = {
	initPickColor: function () {
		$('.pick-class-label').click(function () {
			var new_class = $(this).attr('new-class');
			var old_class = $('#display-buttons').attr('data-class');
			var display_div = $('#display-buttons');
			if (display_div.length) {
				var display_buttons = display_div.find('.btn');
				display_buttons.removeClass(old_class);
				display_buttons.addClass(new_class);
				display_div.attr('data-class', new_class);
			}
		});
	},

	initChartist: function (year) {

		var dataSales = {
			labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
			series: [
				[287, 385, 490, 492, 554, 586, 698, 695, 752, 788, 846, 944],
				[67, 152, 143, 240, 287, 335, 435, 437, 539, 542, 544, 647],
				[23, 113, 67, 108, 190, 239, 307, 308, 439, 410, 410, 509]
			]
		};

		var optionsSales = {
			lineSmooth: false,
			low: 0,
			high: 800,
			showArea: true,
			height: "245px",
			axisX: {
				showGrid: false,
			},
			lineSmooth: Chartist.Interpolation.simple({
				divisor: 3
			}),
			showLine: false,
			showPoint: false,
		};

		var responsiveSales = [
			['screen and (max-width: 640px)', {
				axisX: {
					labelInterpolationFnc: function (value) {
						return value[0];
					}
				}
			}]
		];

		Chartist.Line('#chartHours', dataSales, optionsSales, responsiveSales);
		var crops = []

		$.getJSON("../../static/json/crops.json", function (datas) {
			var plot = []
			for (var i = 0; i < datas.length; i++) {
				if (crops.indexOf(datas[i].Crop) == -1) {
					crops.push(datas[i].Crop)
				}
			}
			$.getJSON("../../static/json/seasons.json", function (seasonData) {



				for (var i = 1; i <= seasonData.length; i++) {

					var temp = []
					for (var j = 0; j < crops.length; j++) {
						temp.push(0)
					}

					for (var k = 0; k < datas.length; k++) {
						if (datas[k].Season == i && datas[k].DateTime.substring(4, -1) == year) {
							temp[crops.indexOf(datas[k].Crop)] = datas[k].Yield
						}
					}

					plot.push(temp)
				}

				var data = {
					labels: crops,
					series: plot
				};

				var options = {
					seriesBarDistance: 10,
					axisX: {
						showGrid: false
					},
					height: "245px"
				};

				var responsiveOptions = [
					['screen and (max-width: 640px)', {
						seriesBarDistance: 10,
						axisX: {
							labelInterpolationFnc: function (value) {
								return value[0];
							}
						}
					}]
				];

				Chartist.Bar('#chartActivity', data, options, responsiveOptions);
			});
		});

		var dataPreferences = {
			series: [
				[25, 30, 20, 25]
			]
		};

		var optionsPreferences = {
			donut: true,
			donutWidth: 40,
			startAngle: 0,
			total: 100,
			showLabel: false,
			axisX: {
				showGrid: false
			}
		};

		Chartist.Pie('#chartPreferences', dataPreferences, optionsPreferences);

		Chartist.Pie('#chartPreferences', {
			labels: ['62%', '32%', '6%'],
			series: [62, 32, 6]
		});
	},
}