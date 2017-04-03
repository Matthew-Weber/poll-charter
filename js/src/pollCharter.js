Reuters = Reuters || {};
Reuters.Graphics = Reuters.Graphics || {};
//the view that constructs a linechart
Reuters.Graphics.stackPollCharter = Backbone.View.extend({
	template:Reuters.Graphics.pollCharter.Template.pollchart,
	tipTemplate:Reuters.Graphics.pollCharter.Template.polltip,
	numbFormat: d3.format(",.0f"),
	initialize: function(opts){
		var self = this;
		this.options = opts; 		
		
		// if we are passing in options, use them instead of the defualts.
		_.each(opts, function(item, key){
			self[key] = item;
		});	

			self.loadData()					

	},
	loadData:function(){
		var self = this;
		//Test which way data is presented and load appropriate way
		if (this.dataURL.indexOf("csv") == -1 && !_.isObject(this.dataURL)){
			d3.json(self.dataURL, function(data){
				self.parseData (data);
			});
		} 
		if (this.dataURL.indexOf("csv") > -1){
			d3.csv(self.dataURL, function(data){
				self.parseData (data);
			});
		}
		if (_.isObject(this.dataURL)){
			setTimeout(function(){
				self.parseData (self.dataURL);											
			}, 100);
		}				
	},
	parseData: function (data){			
		var self = this;
		self.data = data;
		self.baseRender();
	},
	

	baseRender: function() {
		var self = this;
		
		self.legendItemsArray = [self.rightBarCol, self.centerCol, self.leftBarCol]
		if (_.isArray(self.color)){
			var obj = {}
			self.legendItemsArray.forEach(function(d,i){
				obj[d]=self.color[i]
			})
			self.color = obj;
		}
		
		self.targetDiv = self.$el.attr("id")
		self.$el.html(self.template({data:self.data, self:self}))

		self.data.forEach(function(d,i){
			
			var chartBlock = {
				el: "#"+self.targetDiv+"-"+d.id,
				dataURL: [d],
				height:40,
				colors: [orange4, "none",purple4, red3,yellow3],  
				YTickLabel: [[gettext(""),gettext("%")]],
				yScaleVals: [0,25,50,75,100],
				groupSort:self.legendItemsArray,				
				hasLegend: false,
				horizontal:true,
				chartLayout:"stackTotal", 
				yScaleMax:function(){
					return 100;
				},
				margin: {top: 5, right: 18, bottom: 15, left: 3},
				tipTemplate:self.tipTemplate				
			}
			
			_.each(self.options, function(value,key){
				if (key == "el" || key == "dataURL"){ return}
				chartBlock[key] = value;
			})
			console.log(chartBlock.dataURL)
			
			Reuters.Graphics[d.id] = new Reuters.Graphics.BarChart(chartBlock);				
			Reuters.Graphics[d.id].on("renderChart:end", function(evt){
		    	self.addMoe(this);
		    	self.addNumbers(this)
		    	
					    			
				if (i != self.data.length - 1){
					$("#"+self.targetDiv+"-"+d.id+" .x.axis text").css({display:"none"})
				}
			})			
			Reuters.Graphics[d.id].on("update:start", function(evt){
		    	self.updateMoe(this);
		    	self.updateNumbers(this);		
			})
							
			
			
		})


	},
	
	addNumbers: function(self){
		var viewSelf = this;
		self.barChart.selectAll(".poll-bar-label")
			.data(function(d) {return d.values;})
			.enter().append("text")
			.attr("class", "poll-bar-label")
			.attr(self.widthOrHeight, function(d,i,j){ return self.barWidth(d,i,j); }) 
			.attr("y", function (d,i,j){				
				var width = self.barWidth(d,i,j);									  					  				  	
				return self.xBarPosition(d,i,j) + width / 2 +5;
			})
			.attr("x", function(d){ 
				if (d.name == viewSelf.rightBarCol){
					return self.width - 5
				}
				return 5
					
			})
			.text(function(d){
				if (d.name == viewSelf.centerCol){
					return 
				}				
				return self.numbFormat(d[self.dataType]) +"%"
			})
			.attr("text-anchor", function(d){
				if (d.name == viewSelf.rightBarCol){
					return "end"
				}
			})
		
		
	},
	
	updateNumbers: function(self){
		var viewSelf = this;	

		self.barChart.selectAll(".poll-bar-label")
			.transition()
			.duration(1000)
			.attr(self.widthOrHeight, function(d,i,j){ return self.barWidth(d,i,j); }) 
			.attr("y", function (d,i,j){				
				var width = self.barWidth(d,i,j);									  					  				  	
				return self.xBarPosition(d,i,j) + width / 2 +5;
			})
			.attr("x", function(d){ 
				if (d.name == viewSelf.rightBarCol){
					return self.width - 5
				}
				return 5
					
			})
		
	},
	
	updateMoe: function (self){
		var viewSelf = this;
	    self.addMoe
	    	.transition()
	    	.duration(1000)
			.attr("height", function(d,i,j){ return self.barWidth(d,i,j); }) 
			.attr("y", function (d,i,j){					  					  				  	
				return self.xBarPosition(d,i,j);
			})
			.attr("x", function(d){
				if (d.name == viewSelf.leftBarCol){
					return self.scales.y(d["y1Total"]) - (self.scales.y(d[viewSelf.moeColumn])/2);					
				} 
				return self.scales.y(d["y0Total"]) - (self.scales.y(d[viewSelf.moeColumn])/2);
			})
			.attr("width", function(d){ 
				return self.scales.y(d[viewSelf.moeColumn])
			});		
	},

	addMoe: function addMoe(self) {
		var viewSelf = this;

		self.t = textures.lines().size(8).orientation("2/8").stroke("#C3C4C6");
		self.tother = textures.lines().size(8).orientation("6/8").stroke("#C3C4C6");

		self.svg.call(self.t);
		self.svg.call(self.tother);

		self.moeChart = self.svg.selectAll(".moeChart")
			.data(self.jsonData, function(d) { return d.name;})
			.enter().append("g")
		  	.attr("clip-path", "url(#clip" + self.targetDiv + ")")
			.attr("class", "moeChart")


		self.addMoe = self.moeChart.selectAll(".moebar").data(function (d) {
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
//end of view
});



Reuters.Graphics.pollLineCharter = Backbone.View.extend({
	initialize: function(opts){
		var self = this;
		this.options = opts; 		
		
		// if we are passing in options, use them instead of the defualts.
		_.each(opts, function(item, key){
			self[key] = item;
		});	

			self.baseRender()					

	},

	baseRender: function() {
		var self = this;
		
		self.poll_chart_obj = new Reuters.Graphics.LineChart(self.options);				

		self.poll_chart_obj.on("renderChart:end", function(evt){
		    var self = this;
			self.area
			    .y0(function(d) { 
			    	return self.scales.y(d[self.dataType] - parseFloat(d[self.moeColumn]))
			    })
			    .y1(function(d) {
			    	return self.scales.y(d[self.dataType] + parseFloat(d[self.moeColumn]))
					
			     })
		    
		})								
	},
	
//end of view
});

Reuters.Graphics.pollBarChart = Backbone.View.extend({
	initialize: function(opts){
		var self = this;
		this.options = opts; 		
		
		// if we are passing in options, use them instead of the defualts.
		_.each(opts, function(item, key){
			self[key] = item;
		});	

			self.baseRender()					

	},

	baseRender: function() {
		var self = this;
		var options = self.options;
		console.log(Reuters.Graphics.pollCharter)
		if (!options.tipTemplate){
			options.tipTemplate = Reuters.Graphics.pollCharter.Template.pollBarTip
		}
		self.poll_chart_obj = new Reuters.Graphics.BarChart(self.options);				


		self.poll_chart_obj.on("renderChart:end", function(evt){
		    self.addMoe(this);
		    
		})								
		self.poll_chart_obj.on("update:end", function(evt){
		    self.updateMoe(this);
		    
		})								

	},
	updateMoe: function (self){
		var viewSelf = this;

	    self.addMoe
	    	.transition()
	    	.duration(1000)
			.attr("height", function(d,i,j){ return self.barWidth(d,i,j); }) 
			.attr("y", function (d,i,j){					  					  				  	
				return self.xBarPosition(d,i,j);
			})
			.attr("x", function(d){
				return self.scales.y(d[self.dataType]) - (self.scales.y(d[viewSelf.moeColumn])/2);
			})
			.attr("width", function(d){ 
				return self.scales.y(d[viewSelf.moeColumn])
			});		

	},

	addMoe: function (self){
		var viewSelf = this;

	
	    
	    self.addMoe = self.barChart.selectAll(".moebar")
			.data(function(d) {return d.values;})
			.enter().append("rect")
			.attr("class", ".moebar")
			.style("fill", function(d){ 
				var strokecolor = d3.rgb(self.colorScale(d.name)).darker(0.8);
				self.t = textures.lines().size(5).orientation("2/8").stroke(strokecolor);

				
				self.svg.call(self.t);

				return self.t.url()
			})
			.attr("height", function(d,i,j){ return self.barWidth(d,i,j); }) 
			.attr("y", function (d,i,j){					  					  				  	
				return self.xBarPosition(d,i,j);
			})
			.attr("x", function(d){
				return self.scales.y(d[self.dataType]) - (self.scales.y(d[viewSelf.moeColumn])/2);
			})
			.attr("width", function(d){ 
				return self.scales.y(d[viewSelf.moeColumn])
			});		
	},	
	
//end of view
});


