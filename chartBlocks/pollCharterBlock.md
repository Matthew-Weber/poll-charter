	Reuters.Graphics.overall = new Reuters.Graphics.pollCharter({
		el: "#reutersGraphic-chart1",
		dataURL: 'data/data.csv',
		columnNames:{contact:gettext("Concerned with contact"), dk:gettext("Don't know"),leaks:gettext("Concerned with leaks")},
		colors: {contact:orange4, dk:"none",leaks:purple4},  
		moeColumn:"ci",
		leftBarCol:"contact",
		rightBarCol:"leaks",
		centerCol:"dk",
//		template:Reuters.Graphics.Template.pollchart
//		tipTemplate:Reuters.Graphics.Template.polltip
	});	
	


//HISTORICAL LINE CHART, MAKE SURE TO SET margin of error column on bottom.
/*
		Reuters.Graphics.pollLines = new Reuters.Graphics.pollLineCharter({
			el: "#reutersGraphic-chart1",
//			dataURL: '//d3sl9l9bcxfb5q.cloudfront.net/json/mw-disney-earns',
 			dataURL:"data/linedata.csv",
			height:220, //if < 10 - ratio , if over 10 - hard height.  undefined - square
			columnNames:{clinton:gettext("Clinton"), trump:gettext("Trump")}, // undefined uses sheet headers, object will map, array matches columnNamesDisplay
//			colors: [blue3, purple3,orange3, red3,yellow3],  //array or mapped object
//			dataType:'value',//value, changePreMonth, CumulativeChange, percentChange, cumulate
			YTickLabel: [[gettext(""),gettext("%")]], //  \u00A0  - use that code for a space.
//			xScaleTicks: 5,
//			yScaleTicks:5,
//			dateFormat: d3.time.format("%b %Y"),
//			numbFormat: d3.format(",.1f"),
//			divisor:1000,

//			columnNamesDisplay:[gettext("Bob"),gettext("Jerry")], // only use this if you are using an array for columnNames
//			colorUpDown:true,
//			hasLegend: false,
//			showTip:true,
//			yScaleVals: [0,100],
//			tickAll:true, //if you make tickAll anything, it will put a tick for each point.
//			horizontal:true,
//			margin: {top: 60, right: 80, bottom: 60, left: 130},
//			groupSort:"ascending", // ascending descending or array
//			categorySort:"ascending", //ascending descending, array or alphabetical
//			parseDate:d3.time.format("%d/%m/%y").parse // can change the format of the original dates
//			hasRecessions: true,
//			hasZoom: true,
//			dataStream:true,
//			timelineData:"data/timeline.csv", //dates much match source dates 
//			tipNumbFormat: function(d){
//				var self = this;
//				if (isNaN(d) === true){return "N/A";}else{
//					return self.dataLabels[0] + self.numbFormat(d) + " " + self.dataLabels[1] ;				
//				}				
//			},
//			lineType: "linear",//step-before, step-after
//			chartBreakPoint:400, //when do you want the legend to go up top
//			markDataPoints:true,
//			multiDataColumns:["gpd","unemployment"],//can use value,changePreMonth, CumulativeChange, percentChange
//			multiDataLabels:[gettext("VALUE"),gettext("PERCENT")],
			chartLayout:"fillLines", // basic,stackTotal, stackPercent, fillLines, sideBySide, onTopOf,
//			chartLayoutLables:["stackPercent", "basic","stackTotal","fillLines"], //define this, and buttons appear
//			orient:"right",
//			yTickFormat:function(d){
//				var numbFormat = d3.format(".2f")
//				return numbFormat(d)
//			},
//			xTickFormat:function(d){
//				var dateFormat = d3.time.format("%b %Y")
//				return dateFormat(d)
//			},
//			navSpacer:true,
//			tipTemplate:Reuters.Graphics.Template.tooltip,
//			chartTemplate:Reuters.Graphics.Template.chartTemplate,
//			legendTemplate: Reuters.Graphics.Template.legendTemplate,
//			timelineTemplate:Reuters.Graphics.Template.tooltipTimeline,
			moeColumn:"moe"		
		});
*/

	
	
