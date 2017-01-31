/*
* File: map.js
* Application to display a MAp using Openlayers,Geoext and extjs
*Author:wanjohi kibui
*/
 Ext.require([
    'Ext.container.Viewport',
    'Ext.window.MessageBox',
    'GeoExt.panel.Map',
    'GeoExt.data.FeatureStore',
    'GeoExt.grid.column.Symbolizer',
    'GeoExt.selection.FeatureModel',
    'Ext.grid.GridPanel',
    'Ext.layout.container.Accordion',
    'Ext.chart.*',
	'GeoExt.selection.FeatureModel',
    'Ext.toolbar.Paging',
	'GeoExt.container.WmsLegend',
    //'GeoExt.container.UrlLegend',
    //'GeoExt.container.VectorLegend',
    'GeoExt.panel.Legend',
    'Ext.tree.plugin.TreeViewDragDrop',
    'GeoExt.window.Popup',
    'GeoExt.data.MapfishPrintProvider',
    'GeoExt.plugins.PrintExtent',
    'GeoExt.tree.LayerContainer',
    'GeoExt.tree.OverlayLayerContainer',
    'GeoExt.tree.BaseLayerContainer',
    'GeoExt.data.LayerTreeModel',
	'GeoExt.Action',
	'Ext.form.field.Text',
	'Ext.layout.container.Table',
	'Ext.container.ButtonGroup' 
]);
Ext.application({
    name: 'app',
    launch: function(){
		OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
        var map = new OpenLayers.Map("map-id",{
            controls: [
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.ArgParser(),
				new OpenLayers.Control.Attribution(),
				//new OpenLayers.Control.LayerSwitcher(),
				new OpenLayers.Control.MousePosition(),
				new OpenLayers.Control.OverviewMap(),
				new OpenLayers.Control.Scale(),
				new OpenLayers.Control.PanZoomBar(),
				new OpenLayers.Control.KeyboardDefaults()
			]
        },
		{projection: "EPSG:4326",units: 'degrees'}
		);
		var OSM = new OpenLayers.Layer.OSM("OpenStreetMap");
        var context = {
            getColor: function(feature) {
                if (feature.attributes.NAME_1 == 'Central') {
                    return 'green';
                }
				if (feature.attributes.NAME_1 == 'Coast') {
                    return 'grey';
                }
				if (feature.attributes.NAME_1 == 'Eastern') {
                    return 'purple';
                }
				if (feature.attributes.NAME_1 == 'Western') {
                    return 'yellow';
                }
				if (feature.attributes.NAME_1 == 'Nyanza') {
                    return 'orange';
                }
				if (feature.attributes.NAME_1 == 'Nairobi') {
                    return 'pink';
                }
                if (feature.attributes.NAME_1 == 'Rift Valley') {
                    return 'red';
                }
                return 'orange';
            }
        };
        var template = {
            cursor: "pointer",
            fillOpacity: 0.5,
            fillColor: "${getColor}",
            pointRadius: 6,
            strokeWidth: 1,
            strokeOpacity: 1,
            strokeColor: "${getColor}",
            graphicName: "circle"
        };
        var template1 = {
            cursor: "pointer",
            fillOpacity: 0.5,
            fillColor: "orange",
            pointRadius: 6,
            strokeWidth: 1,
            strokeOpacity: 1,
            strokeColor: "${getColor}",
            graphicName: "circle"
        };
        var style = new OpenLayers.Style(template, {context: context});
        var style1 = new OpenLayers.Style(template1, {context: context});
		var kenya = new OpenLayers.Layer.Vector("Kenya Counties", {
            styleMap: new OpenLayers.StyleMap({
                'default': style
            }),
            protocol: new OpenLayers.Protocol.HTTP({
                url: "data/kenya.json",
                format: new OpenLayers.Format.GeoJSON()
            }),
            strategies: [new OpenLayers.Strategy.Fixed()],
            isBasiclayer: false,
            displayInLayerSwitcher: true,
            //visibility:false
        });
		
    var metereological = new OpenLayers.Layer.Vector("Metereological Stations", {
            styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        pointRadius: 6,
                        fillColor: "green",
                        strokeColor: '#000000',
                        strokeWidth: 1
                    })
            }),
            protocol: new OpenLayers.Protocol.HTTP({
                url: "data/metereological.json",
                format: new OpenLayers.Format.GeoJSON()
            }),
            strategies: [new OpenLayers.Strategy.Fixed()],
            isBasiclayer: false,
            displayInLayerSwitcher: true,
            //visibility:false
        });
    var temp = new OpenLayers.Layer.Vector("Temperature Data", {
            styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        pointRadius: 6,
                        fillColor: "green",
                        strokeColor: '#000000',
                        strokeWidth: 1
                    })
                }),
            protocol: new OpenLayers.Protocol.HTTP({
                url: "data/temperature.json",
                format: new OpenLayers.Format.GeoJSON()
            }),
            strategies: [new OpenLayers.Strategy.Fixed()],
            isBasiclayer: false,
            displayInLayerSwitcher: true,
            //visibility:false
        });
		
        /*var allstations = new OpenLayers.Layer.Vector("Weather stations");
		allstations.addFeatures([temperature2014]);*/
        map.addLayers([OSM,kenya,metereological,temp,]);
        map.setCenter(new OpenLayers.LonLat(4176923.85672,81455.37479),6 );
		 // create select feature control
		 var selectCtrl = new OpenLayers.Control.SelectFeature([metereological,temp],{
                    clickout: true, toggle: false,
                    multiple: false, hover: false,
                    toggleKey: "ctrlKey", // ctrl key removes from selection
                    multipleKey: "shiftKey" // shift key adds to selection
		 });
           //adding a popup panel for our layer 'towns'
           var popup;
          function createPopup(feature) {
              // close existing popup
                if (popup) {
                        popup.destroy();
                    }
              popup = new GeoExt.Popup({
                     title: feature.attributes.towns,
                     location: feature,
                     width:200,
                     height: 260,
                     html: "<br/> Station:" + feature.attributes.towns + "<br/> Monday Min :" + feature.attributes.min_temp + "<br/>Monday Max :" + feature.attributes.max_temp + "<br/>Tuesday Min :" + feature.attributes.min_temp1 + "<br/>Tuesday Max :" + feature.attributes.max_temp1 + "<br/>Wednesday Min :" + feature.attributes.min_temp2 + "<br/>Wednesday Max :" + feature.attributes.max_temp2 + "<br/>Thursday Min :" + feature.attributes.min_temp3 + "<br/>Thursday Max :" + feature.attributes.max_temp3 + "<br/>Friday Min :" + feature.attributes.min_temp4 + "<br/>Friday Max :" + feature.attributes.max_temp4 + "<br/>Saturday Min :" + feature.attributes.min_temp5 + "<br/>Saturday Max :" + feature.attributes.max_temp5 + "<br/>Sunday Min :" + feature.attributes.min_temp6 + "<br/>Sunday Max :" + feature.attributes.max_temp6 + "<br/><br/>",
                     maximizable: true,
                     collapsible: true,
					     padding:'5 5 5 5'
                     //items:items[0]
              });
			  /*popup.on({
				close: function() {
					if(OpenLayers.Util.indexOf(radiation2014.selectedFeatures,
											   this.feature) > -1) {
						selectCtrl.unselect(this.feature);
					}
				}
			});*/
              popup.show();
          }
          temp.events.on({
            featureselected: function(e) {
              createPopup(e.feature);
            }
          });
          metereological.events.on({
            featureselected: function(e) {
              createPopup(e.feature);
            }
          });
          
        var fields= [{name: 'towns', type: 'string'},
                {name: 'max_temp', type: 'float'},
        				{name: 'min_temp', type: 'float'},
        				{name: 'max_temp1', type: 'float'},
        				{name: 'min_temp1', type: 'float'},
        				{name: 'max_temp2', type: 'float'},
        				{name: 'min_temp2', type: 'float'},
        				{name: 'max_temp3', type: 'float'},
        				{name: 'min_temp3', type: 'float'},
        				{name: 'max_temp4', type: 'float'},
        				{name: 'min_temp4', type: 'float'},
        				{name: 'max_temp5', type: 'float'},
        				{name: 'min_temp5', type: 'float'},
        				{name: 'max_temp6', type: 'float'},
        				{name: 'min_temp6', type: 'float'}
            ];
		var store = Ext.create('GeoExt.data.FeatureStore', {
            layer: temp,
            enablePaging:true,
            fields: fields,
            autoLoad: true
        });
        
		var cols= [	{header: "Station",flex:0.2,dataIndex: "towns"}, 
					{header: "MONDAY",flex:0.1,columns: [{
                    text     : 'Max',
                    width    : 100,
                    dataIndex: 'max_temp'
                },{
                    text     : 'Min',
                    width    : 100,
                    dataIndex: 'min_temp'
                }]},
					{header: "TUESDAY",flex:0.1,columns: [{
                    text     : 'Max',
                    width    : 100,
                    dataIndex: 'max_temp1'
                },{
                    text     : 'Min',
                    width    : 100,
                    dataIndex: 'min_temp1'
                }]},
          {header: "WEDNESDAY",flex:0.1,columns: [{
                    text     : 'Max',
                    width    : 100,
                    dataIndex: 'max_temp2'
                },{
                    text     : 'Min',
                    width    : 100,
                    dataIndex: 'min_temp2'
                }]},
          {header: "THURSDAY",flex:0.1,columns: [{
                    text     : 'Max',
                    width    : 100,
                    dataIndex: 'max_temp3'
                },{
                    text     : 'Min',
                    width    : 100,
                    dataIndex: 'min_temp3'
                }]},
          {header: "FRIDAY",flex:0.1,columns: [{
                    text     : 'Max',
                    width    : 100,
                    dataIndex: 'max_temp4'
                },{
                    text     : 'Min',
                    width    : 100,
                    dataIndex: 'min_temp4'
                }]},
          {header: "SATURDAY",flex:0.1,columns: [{
                    text     : 'Max',
                    width    : 100,
                    dataIndex: 'max_temp5'
                },{
                    text     : 'Min',
                    width    : 100,
                    dataIndex: 'min_temp5'
                }]},  
          {header: "SUNDAY",flex:0.1,columns: [{
                    text     : 'Max',
                    width    : 100,
                    dataIndex: 'max_temp6'
                },{
                    text     : 'Min',
                    width    : 100,
                    dataIndex: 'min_temp6'
                }]},                  
	
          ];
		var griddata = Ext.create('Ext.grid.GridPanel',{
                    store:store,
                    autoScroll:true,
                    layout:'fit',
                    columnLines: true,
                    viewConfig: {
                        stripeRows: true,
                        enableTextSelection: true
                    },
                    tbar: [
                    {
                        xtype:'combo',
                        fieldlabel:'Search',
                        emptyText:'Search by Name',
                        store:store,
                        displayField:'towns',
                        valueField:'feature',
						forceSelection:true,
						queryMode: 'local',
                        typeAhead:true,
                        listeners: {
                            select: function(combo, value, options){
                                filters
                                event.getStore().filter('towns', combo.
                                    getValue());
                                event.getStore().clearFilter();
                            }
                        }
                    }],
                    columns: cols,
					sm: new GeoExt.selection.FeatureModel({
						autoPanMapOnSelection: true,
						mode: 'MULTI'
					}),
                    selType: 'featuremodel',
        });
		
		var tips = {
                    trackMouse: true,
                    width: 170,
                    height: 40,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('towns'));
                        //this.update(storeItem.get('totals'));
						this.update(String(item.value[1]));						
						
                    }
                };
		var series = [{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['max_temp'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['max_temp1'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['max_temp2'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['max_temp3'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['max_temp4'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['max_temp5'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['max_temp6'],
                tips: tips
            }
            ];
        var axes = [{
                type: 'Numeric',
                minimum: 0,
                position: 'left',
                fields:['max_temp','max_temp1','max_temp2','max_temp3','max_temp4','max_temp5','max_temp6'],
                title: 'Values/Amounts',
                grid: true,
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0'),
                    font: '10px Arial'
                }
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['towns'],
                title: 'Weather Station',
                label: {
		            rotate: {
		                degrees: 270
		            }
               	}
        }];
    var seriesmin = [{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['min_temp'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['min_temp1'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['min_temp2'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['min_temp3'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['min_temp4'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['min_temp5'],
                tips: tips
            },{
                type: 'line',
                axis: 'left',
                xField: 'towns',
                highlight: true,
                yField:['min_temp6'],
                tips: tips
            }
            ];
        var axesmin = [{
                type: 'Numeric',
                minimum: 0,
                position: 'left',
                fields:['min_temp','min_temp1','min_temp2','min_temp3','min_temp4','min_temp5','min_temp6'],
                title: 'Values/Amounts',
                grid: true,
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0'),
                    font: '10px Arial'
                }
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['towns'],
                title: 'Weather Station',
                label: {
                rotate: {
                    degrees: 270
                }
                }
        }];
		var maxchart = Ext.create('Ext.chart.Chart',{
            animate: true,
            store: store,
            margin:'20 0 5 5',
            //autoHeight:true,
            //insetPadding: 30,
			legend: {
                position: 'top'
            },
            background: {
					gradient: {
					id: 'backgroundGradient',
					stops: {
						0: {
							color: '#ffffff'
						},
						100: {
							color: '#eaf1f8'
						}
					}
					}
			},
            axes: axes,
            series:series
        });
      var minchart = Ext.create('Ext.chart.Chart',{
            animate: true,
            store: store,
            margin:'20 0 5 5',
            //autoHeight:true,
            //insetPadding: 30,
      			legend: {
                      position: 'top'
                  },
                  background: {
      					gradient: {
      					id: 'backgroundGradient',
      					stops: {
      						0: {
      							color: '#ffffff'
      						},
      						100: {
      							color: '#eaf1f8'
      						}
      					}
      					}
      			},
            axes: axesmin,
            series:seriesmin
        });
        
		var dataPanel = Ext.create('Ext.tab.Panel', {
			activeTab: 0,
			//title:'Data Tables',
			autoHeight:true,
			deferredRender: false,
			//layout:'fit',
			items: [{
					xtype: 'tabpanel',
					title: 'Analysis Charts',
					layout: 'fit',
					items:[{
							xtype: 'panel',
							title: 'Maximum Temperature per Day',
							layout: 'fit',
							items:[maxchart],
							autoScroll:true,
              tbar: [{
                text: 'Save Chart',
                handler: function() {
                    Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
                        if(choice == 'yes'){
                            maxchart.save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            }],
						},{
							xtype: 'panel',
							title: 'Minimum Temperature per Day',
							layout: 'fit',
							items:[minchart],
							autoScroll:true,
              tbar: [{
                text: 'Save Chart',
                handler: function() {
                    Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
                        if(choice == 'yes'){
                            minchart.save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            }],
						}
					],
				}
				
			],
			//renderTo : Ext.getBody()
		});  
		var visuals = Ext.create('Ext.window.Window', {
				width: 1000,
				height:600,
				closeAction:'hide',
				layout:'fit',
				title: 'Weather Analysis',
				draggable: true,
				resizable: true,
				minimizable: true,
				maximizable: true,
				minHeight:400,
				minWidth:500,
				items: [dataPanel]
			}
		);
		//var records = grid.getStore().getCount();
        var length = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
			immediate: true,
            eventListeners: {
                measure: function(evt) {
                    //alert("Length = " + evt.measure + evt.units);
					Ext.MessageBox.show({
							title: 'Line length :',
							buttons: Ext.MessageBox.OK,
							width:200,
							msg:"Line Length: " + evt.measure.toFixed(2) + " " + evt.units
						}
					);
                }
            },
			persist: true
        });
        var area = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
            immediate: true,
			eventListeners: {
                measure: function(evt) {
                    Ext.MessageBox.show({
							title: 'Area :',
							buttons: Ext.MessageBox.OK,
							width:200,
							msg:"Area: " + evt.measure.toFixed(2) + " " + evt.units
						}
						);
                }
            },
			persist: true
        });
		var toggleGroup = "Measure";
        var lengthButton = new Ext.Button({
            text: 'Length',
            enableToggle: true,
            toggleGroup: toggleGroup,
            handler: function(toggled){
                if (toggled) {
                    length.activate();
                } else {
                    length.deactivate();
                }
            }
        });
        var areaButton = new Ext.Button({
            text: 'Area',
            enableToggle: true,
            toggleGroup: toggleGroup,
            handler: function(toggled){
                if (toggled) {
                    area.activate();
                } else {
                    area.deactivate();
                }
            }
        });
		var ctrl, toolbarItems = [], action, actions = {};
        
        // ZoomToMaxExtent control, a "button" control
        action = Ext.create('GeoExt.Action', {
            control: new OpenLayers.Control.ZoomToMaxExtent(6),
            map: map,
            text: "Zoom To MaxExtent",
			icon:'app/icons/arrow_inout.png',
            tooltip: "zoom to max extent"
        });
        actions["max_extent"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        toolbarItems.push("-");
		//draw zoom box
		//var zoom_box = new OpenLayers.Control.ZoomBox(); 
        action = Ext.create('GeoExt.Action', {
			text:'Zoom',
            control: new OpenLayers.Control.ZoomBox(), 
            map: map, 
            allowDepress: true, 
            icon: "app/icons/zoom.png", 
            tooltip: "Zoom by drawing a box on map", 
            toggleGroup: "navigate", 
            group: "navigate" 
        }); 
        actions["zoom_box"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button', action)); 
        toolbarItems.push("-"); 
		//pan control
		action = Ext.create('GeoExt.Action', {
			text:'Pan',
            control: new OpenLayers.Control.Navigation(), 
            map: map, 
            allowDepress: false, 
            icon: "app/icons/pan.png", 
            tooltip: "Pan", 
            toggleGroup: "navigate", 
            group: "navigate" 
        }); 
        actions["pan"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button', action)); 
        toolbarItems.push("-"); 
		//zoom in control
		action = Ext.create('GeoExt.Action', {
			text:'zoom in',
            control: new OpenLayers.Control.ZoomIn(), 
            map: map, 
			icon:'app/icons/zoom_in.png',
            tooltip: "Zoom in" 
		}); 
        actions["zoom_in"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button',action)); 
        toolbarItems.push("-"); 
		//zoom out control
        action = Ext.create('GeoExt.Action', {
			text:'zoom out',
            control: new OpenLayers.Control.ZoomOut(), 
            map: map, 
			icon:'app/icons/zoom_out.png',
            tooltip: "Zoom out" 
		}); 
        actions["zoom_out"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button',action)); 
        toolbarItems.push("-"); 
		//identify features
        action = Ext.create('GeoExt.Action', {
			text:'Identify',
			toggleGroup:"navigate",
			group: "navigate",
			icon:'app/icons/information.png',
            control: new OpenLayers.Control.SelectFeature(kenya, {
                type: OpenLayers.Control.TYPE_TOGGLE,
                hover: false
            }),
            map: map,
			allowDepress:true,
            enableToggle: true,
            tooltip: "Identify features"
        });
        actions["select"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        toolbarItems.push("-");
        //measure tools-length
		action = Ext.create('GeoExt.Action', {
			text: "Length",
			toggleGroup:"navigate",
			group: "navigate",
			enableToggle:true,
			icon:'app/icons/ruler.png',
			allowDepress:true,
			tooltip:'Measure Length',
			map: map,
			control: new OpenLayers.Control.Measure(OpenLayers.Handler.Path , {
				eventListeners: {
					measure: function(evt) {
						Ext.MessageBox.show({
							title: 'Line length :',
							buttons: Ext.MessageBox.OK,
							width:200,
							msg:"Line Length: " + evt.measure.toFixed(2) + " " + evt.units
						});
					}
				}
			})
		}); 
        actions["length"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button',action)); 
        toolbarItems.push("-"); 
		//measure area
		action = Ext.create('GeoExt.Action', {
			text: "area",
			toggleGroup:"navigate",
			group: "navigate",
			enableToggle:true,
			allowDepress:true,
			tooltip:'Measure Area',
			icon:'app/icons/ruler_square.png',
			map: map,
			control: new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon , {
				eventListeners: {
					measure: function(evt) {
						Ext.MessageBox.show({
							title: 'Area :',
							buttons: Ext.MessageBox.OK,
							width:200,
							msg:"Area: " + evt.measure.toFixed(2) + " " + evt.units
						});
					}
				}
			})
		}); 
        actions["area"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button',action)); 
        toolbarItems.push("-"); 
        // Navigation history - two "button" controls
        ctrl = new OpenLayers.Control.NavigationHistory();
        map.addControl(ctrl);
        
        action = Ext.create('GeoExt.Action', {
            text: "previous",
            control: ctrl.previous,
            disabled: true,
			icon:'app/icons/arrow_left.png',
            tooltip: "previous action"
        });
        actions["previous"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        
        action = Ext.create('GeoExt.Action', {
			text: "next",
			icon:'app/icons/arrow_right.png',
            control: ctrl.next,
            disabled: true,
            tooltip: "next "
        });
        actions["next"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
		toolbarItems.push(Ext.create('Ext.button.Button',{
			text: 'Charts',
			handler: function() {
				visuals.show();
			}
		}
		));
		/*toolbarItems.push(Ext.create('Ext.button.Button',{
			text: 'Login',
			handler: function() {
				login.show();
			}
		}
		));*/
		map.addControl(selectCtrl);
        selectCtrl.activate();
        var mapPanel = Ext.create('GeoExt.panel.Map', {
            title: 'Map Viewer',
            map: map,
			//minWidth:'30%',
            fallThrough: true,
            layout:'fit',
            region:'center',
            tbar:toolbarItems
        });
		var legendPanel= new Ext.Panel({
                title:'Map Legend',
                layout:'fit',
                border:false,
                items:[
                    {
                        xtype: "gx_legendpanel",
                        autoScroll: true,
                        border:false,
                        padding: 20
                    }
                ]
        });
        var storeTree = Ext.create('Ext.data.TreeStore',{
            model:'GeoExt.data.LayerTreeModel',
            root:{
                expanded:true,
                children:[{
                    //plugins:['gx_layer'],
                    expanded:true,
                    leaf:false,
                    singleClickExpand: true,
                    qtip: "Double Click to expand/Collapse",
                    text:'Data Layers',
                    children:[{
                        plugins:['gx_layer'],
                        text:'Temperature Data',
                        layer:temp,
                        leaf:true,
                        onCheckChange:true
                    },{
                        plugins:['gx_layer'],
                        text:'Metereological Stations',
                        layer:metereological,
                        leaf:true,
                        onCheckChange:true
                    },
                    {
                        plugins:['gx_layer'],
                        text:'Kenya Counties',
                        layer:kenya,
                        leaf:true,
                        onCheckChange:true
                    }
                    ]
                },
					{
						plugins:['gx_baselayercontainer'],
						expanded:true,
						allowDD:true,
						text:'BaseMaps'
					}
				]
            }
        });
        var tree = Ext.create('GeoExt.tree.Panel',{
            title:'Map Layers',
            autoScroll:true,
            viewConfig:{
                plugins:[{
                    ptype:'treeviewdragdrop',
                    appendOnly:true
                }]
            },
            store:storeTree,
            rootVisible:false,
            lines:true
        });
        var myaccordionwest = new Ext.Panel({
            title:'Data Visualization',
            region:'west',
            split:true,
            collapsible:true,
            width:'13%',
            layout:'accordion',
            items:[tree]
        });
        mapPanel.map.addControl(length);
        mapPanel.map.addControl(area);
       // var selectCtrl = new OpenLayers.Control.SelectFeature(biz);
        
        // create grid panel configured with feature store
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            renderTo: Ext.getBody(),
            items: [mapPanel,myaccordionwest,
                {
                    region:'south',
                    height:'30%',
                    collapsible:true,
					         collapsed:false,
                    layout:'fit',
                    split:true,
                    title:'Grid View - Temperature Data',
                    //autoScroll:true,
                    items:[griddata]

                },
                {
                    region:'north',
                    height:120,
                    xtype: 'container',
                    layout: {
                        align: 'stretch',
                        type: 'hbox'
                    },
					html: '<h1>Kenya Weather Stations</h1><h2>Enhancing weather forecast and analysis in the region</h2>',
                    style:"background-image:url(app/images/geo.jpg);font-size: 18px;text-align:center;color:#ffffff; !important"

                }
                ]  
                    
        });
}
});