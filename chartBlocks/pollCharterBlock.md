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
	