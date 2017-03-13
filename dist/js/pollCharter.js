(function () {
	window["Reuters"] = window["Reuters"] || {};
	window["Reuters"]["Graphics"] = window["Reuters"]["Graphics"] || {};
	window["Reuters"]["Graphics"]["pollCharter"] = window["Reuters"]["Graphics"]["pollCharter"] || {};
	window["Reuters"]["Graphics"]["pollCharter"]["Template"] = window["Reuters"]["Graphics"]["pollCharter"]["Template"] || {};

	window["Reuters"]["Graphics"]["pollCharter"]["Template"]["pollchart"] = function (t) {
		var __t,
		    __p = '',
		    __j = Array.prototype.join;
		function print() {
			__p += __j.call(arguments, '');
		}
		__p += '\n<div class="page-legend d-flex  flex-wrap">\n	';
		t.self.legendItemsArray.forEach(function (d, i) {
			if (d == t.self.centerCol) {
				return;
			};
			__p += '	\n	    <div class="legendItems-poll d-flex flex-row ';
			if (i == 0) {
				;
				__p += 'flex-last';
			};
			__p += '">\n	        <div class=\'poll-legend-bar\' style=\'background-color:' + ((__t = t.self.colors[d]) == null ? '' : __t) + ';\'></div>\n	        <div class="poll-legend-text">' + ((__t = t.self.columnNames[d]) == null ? '' : __t) + '</div>\n	    </div>		\n	';
		});
		__p += '\n</div>\n\n\n';
		t.data.forEach(function (d) {
			;
			__p += '\n	<p class="poll-chart-label">' + ((__t = d.category) == null ? '' : __t) + '    <span class="poll-chart-sample">Sample size: <strong>' + ((__t = t.self.numbFormat(d.sample)) == null ? '' : __t) + '</strong> | Credibility interval: <strong> ' + ((__t = d.ci) == null ? '' : __t) + '%</strong></span>\n</p>\n    <div id="' + ((__t = t.self.targetDiv) == null ? '' : __t) + '-' + ((__t = d.id) == null ? '' : __t) + '" class="chart"></div>\n';
		});
		__p += '\n ';
		return __p;
	};
})();
(function () {
	window["Reuters"] = window["Reuters"] || {};
	window["Reuters"]["Graphics"] = window["Reuters"]["Graphics"] || {};
	window["Reuters"]["Graphics"]["pollCharter"] = window["Reuters"]["Graphics"]["pollCharter"] || {};
	window["Reuters"]["Graphics"]["pollCharter"]["Template"] = window["Reuters"]["Graphics"]["pollCharter"]["Template"] || {};

	window["Reuters"]["Graphics"]["pollCharter"]["Template"]["polltip"] = function (t) {
		var __t,
		    __p = '',
		    __j = Array.prototype.join;
		function print() {
			__p += __j.call(arguments, '');
		}

		if (t.data[0].quarters) {
			;
			__p += '\n	<div class=\'dateTip\'> ' + ((__t = t.data[0].quarters) == null ? '' : __t) + ' ' + ((__t = t.data[0].displayDate) == null ? '' : __t) + ' </div>\n';
		} else if (t.data[0].displayDate) {
			;
			__p += '\n	<div class=\'dateTip\'> ' + ((__t = t.data[0].displayDate) == null ? '' : __t) + ' </div>\n';
		} else {
			;
			__p += '\n	<div class=\'dateTip\'> ' + ((__t = t.data[0].category) == null ? '' : __t) + ' </div>\n';
		};
		__p += '\n\n';
		t.data.forEach(function (d, i) {
			if (d.name == t.self.centerCol) {
				return;
			};
			__p += '\n		<div class="tipHolder">\n			';
			if (t.data.length > 1) {
				;
				__p += '\n				<div class=\'circleTip ' + ((__t = t.self.chartType) == null ? '' : __t) + '\' style=\'background-color:';
				print(t.self.colorScale(d.name));
				__p += ';\'></div>\n				<div class=\'nameTip\'>' + ((__t = d.displayName) == null ? '' : __t) + '</div>\n			';
			};
			__p += '\n			<div class=\'valueTip\'>\n				';
			if (t.self.chartLayout == "stackPercent") {
				;
				__p += '\n					';
				print(t.self.tipNumbFormat(d.y1Percent - d.y0Percent));
				__p += '				\n				';
			} else {
				;
				__p += '\n					';
				print(t.self.tipNumbFormat(d[t.self.dataType]));
				__p += '				\n				';
			};
			__p += '\n			</div>\n	\n		</div>\n';
		});
		__p += '	\n';
		if (t.self.timelineData) {
			var timelineData = t.self.timelineDataGrouped[t.self.timelineDate(t.data[0].date)];
			print(t.self.timelineTemplate({ data: timelineData, self: t.self }));
		};
		__p += '	';
		return __p;
	};
})();
Reuters = Reuters || {};
Reuters.Graphics = Reuters.Graphics || {};
//the view that constructs a linechart
Reuters.Graphics.pollCharter = Backbone.View.extend({
	template: Reuters.Graphics.pollCharter.Template.pollchart,
	tipTemplate: Reuters.Graphics.pollCharter.Template.polltip,
	numbFormat: d3.format(",.0f"),
	initialize: function initialize(opts) {
		var self = this;
		this.options = opts;

		// if we are passing in options, use them instead of the defualts.
		_.each(opts, function (item, key) {
			self[key] = item;
		});

		self.loadData();
	},
	loadData: function loadData() {
		var self = this;
		//Test which way data is presented and load appropriate way
		if (this.dataURL.indexOf("csv") == -1 && !_.isObject(this.dataURL)) {
			d3.json(self.dataURL, function (data) {
				self.parseData(data);
			});
		}
		if (this.dataURL.indexOf("csv") > -1) {
			d3.csv(self.dataURL, function (data) {
				self.parseData(data);
			});
		}
		if (_.isObject(this.dataURL)) {
			setTimeout(function () {
				self.parseData(self.dataURL);
			}, 100);
		}
	},
	parseData: function parseData(data) {
		var self = this;
		self.data = data;
		self.baseRender();
	},

	baseRender: function baseRender() {
		var self = this;

		self.legendItemsArray = [self.rightBarCol, self.centerCol, self.leftBarCol];
		if (_.isArray(self.color)) {
			var obj = {};
			self.legendItemsArray.forEach(function (d, i) {
				obj[d] = self.color[i];
			});
			self.color = obj;
		}

		self.targetDiv = self.$el.attr("id");
		self.$el.html(self.template({ data: self.data, self: self }));

		self.data.forEach(function (d) {

			var chartBlock = {
				el: "#" + self.targetDiv + "-" + d.id,
				dataURL: [d],
				height: 40,
				colors: [orange4, "none", purple4, red3, yellow3],
				YTickLabel: [[gettext(""), "%"]],
				yScaleVals: [0, 25, 50, 75, 100],
				groupSort: self.legendItemsArray,
				hasLegend: false,
				horizontal: true,
				chartLayout: "stackTotal",
				yScaleMax: function yScaleMax() {
					return 100;
				},
				margin: { top: 0, right: 18, bottom: 15, left: 3 },
				tipTemplate: self.tipTemplate
			};

			_.each(self.options, function (value, key) {
				if (key == "el" || key == "dataURL") {
					return;
				}
				chartBlock[key] = value;
			});
			console.log(chartBlock.dataURL);

			Reuters.Graphics[d.id] = new Reuters.Graphics.BarChart(chartBlock);
			Reuters.Graphics[d.id].on("renderChart:end", function (evt) {
				self.addMoe(this);
			});
			Reuters.Graphics[d.id].on("update:start", function (evt) {
				self.updateMoe(this);
			});
		});
	},

	updateMoe: function updateMoe(self) {
		var viewSelf = this;
		self.addMoe.transition().duration(1000).attr("height", function (d, i, j) {
			return self.barWidth(d, i, j);
		}).attr("y", function (d, i, j) {
			return self.xBarPosition(d, i, j);
		}).attr("x", function (d) {
			if (d.name == viewSelf.leftBarCol) {
				return self.scales.y(d["y1Total"]) - self.scales.y(d[viewSelf.moeColumn]) / 2;
			}
			return self.scales.y(d["y0Total"]) - self.scales.y(d[viewSelf.moeColumn]) / 2;
		}).attr("width", function (d) {
			return self.scales.y(d[viewSelf.moeColumn]);
		});
	},

	addMoe: function addMoe(self) {
		var viewSelf = this;

		self.t = textures.lines().size(5).orientation("2/8").stroke("#C3C4C6");
		self.tother = textures.lines().size(5).orientation("6/8").stroke("#C3C4C6");

		self.svg.call(self.t);
		self.svg.call(self.tother);

		self.addMoe = self.barChart.selectAll(".moebar").data(function (d) {
			return d.values;
		}).enter().append("rect").attr("class", ".moebar").style("fill", function (d) {

			if (d.name == viewSelf.centerCol) {
				return "none";
			}
			if (d.name == viewSelf.leftBarCol) {
				return self.tother.url();
			}
			return self.t.url();
		}).attr("height", function (d, i, j) {
			return self.barWidth(d, i, j);
		}).attr("y", function (d, i, j) {
			return self.xBarPosition(d, i, j);
		}).attr("x", function (d) {
			if (d.name == viewSelf.leftBarCol) {
				return self.scales.y(d["y1Total"]) - self.scales.y(d[viewSelf.moeColumn]) / 2;
			}
			return self.scales.y(d["y0Total"]) - self.scales.y(d[viewSelf.moeColumn]) / 2;
		}).attr("width", function (d) {
			return self.scales.y(d[viewSelf.moeColumn]);
		});
	}
});
//# sourceMappingURL=pollCharter.js.map
