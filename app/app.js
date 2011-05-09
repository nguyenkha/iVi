app = {
	views: {},
	
	models: {currentPosition: {}},
	
	launch: function() {
		
		// Model
		Ext.regModel('Withdraw', {
		    fields: ['id', 'amount', 'description', 'datetime', 'timestamp', 'photo', 'x', 'y'],

		    proxy: {
		        type: 'localstorage',
		        id  : 'myvi-withdraw'
            },
		});
		
		this.models.withdraw = new Ext.data.Store({
		    model: 'Withdraw',
			autoLoad: true
		});
        this.models.withdraw.load();
		
		this.views.main = new Ext.Panel({
			title: 'iVi\'',
			html: '<div id="wrapper">'+'<div id="coin"><img class="imgbase" src="img/coin.png" /></div>'+'<div id="coin1"><img class="imgbase" src="img/coin.png" /></div>'+'<div id="wallet"><img class="imgbase" src="img/wallet.png" /></div></div>',
			iconCls: 'bookmarks'
		});
			
		this.views.deposit = new Ext.form.FormPanel({
			title: 'Deposit',			
			html: 	
			'<div id="box-money">'+
				'<div class="wrapper">' +
					'<div id="money1">' +
						'<img class="moneybase" src="img/1.jpg" />'+
						'<div class="ribbon">0</div>'+	
					'</div>'+
					'<div id="money2">'+
						'<img class="moneybase" src="img/2.jpg" />'+
						'<div class="ribbon">0</div>'+
					'</div>'+
					'<div id="money5">'+
						'<img class="moneybase" src="img/5.jpg" />'+
						'<div class="ribbon">0</div>'+
					'</div>'+
				'</div>' +
				'<div class="wrapper">' +
					'<div id="money10">' +
						'<img class="moneybase" src="img/10.jpg" />'+
						'<div class="ribbon">0</div>'+
					'</div>'+
					'<div id="money20">'+
						'<img class="moneybase" src="img/20.jpg" />'+
						'<div class="ribbon">0</div>'+
					'</div>'+
					'<div id="money50">'+
						'<img class="moneybase" src="img/50.jpg" />'+
						'<div class="ribbon">0</div>'+
					'</div>'+
				'</div>' +
				'<div class="wrapper">' +
					'<div id="money100">' +
						'<img class="moneybase" src="img/100.jpg" />'+
						'<div class="ribbon">0</div>'+
					'</div>'+
					'<div id="money200">'+
						'<img class="moneybase" src="img/200.jpg" />'+
						'<div class="ribbon">0</div>'+
					'</div>'+
					'<div id="money500">'+
						'<img class="moneybase" src="img/500.jpg" />'+
						'<div class="ribbon">0</div>'+
					'</div>'+
				'</div>' +
			'</div>',

			items: [
			        {
			            xtype: 'numberfield',
			            name : 'amount',
						label: 'Amount',
						value: '0'
			        },
					{
						xtype: 'button',
						name: 'submit',
						text: 'Deposit',
						handler: function() {
                            var value = app.views.deposit.items.items[0].getValue();
                            if (value!=0)
                                Ext.Msg.alert('Deposit:'+value+' VND');
                            // reset all values
                            app.views.deposit.items.items[0].setValue(0); // amount value
                                // money papers' values
                            document.getElementById('money1').childNodes[1].innerText = 0;
                            document.getElementById('money2').childNodes[1].innerText = 0;
                            document.getElementById('money5').childNodes[1].innerText = 0;
                            document.getElementById('money10').childNodes[1].innerText = 0;
                            document.getElementById('money20').childNodes[1].innerText = 0;
                            document.getElementById('money50').childNodes[1].innerText = 0;
                            document.getElementById('money100').childNodes[1].innerText = 0;
                            document.getElementById('money200').childNodes[1].innerText = 0;
                            document.getElementById('money500').childNodes[1].innerText = 0;
                            
						}
					},				
				],
			iconCls: 'download'
		});
		
		var infowindow = new google.maps.InfoWindow() ,
            trackingButton = Ext.create({
               xtype   : 'button',
               iconMask: true,
               iconCls : 'locate'
            });                

        // map 
        this.views.map = new Ext.Map({
            title : 'Location',
            mapOptions : {
                center : new google.maps.LatLng(10.875262, 106.799058),  
                zoom : 13,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                navigationControl: true,
                navigationControlOptions: {
                        style: google.maps.NavigationControlStyle.DEFAULT
                    }
            },
			listeners : {
                maprender : function(comp, map){
                    for(var i = 0; i < app.models.withdraw.getCount() ; ++i) {
                        var lat = app.models.withdraw.getAt(i).data.x;
                        var lng = app.models.withdraw.getAt(i).data.y;
                        var info = app.models.withdraw.getAt(i).data.description;
                        var latLng = new google.maps.LatLng(lat, lng);
                        var marker = new google.maps.Marker({map: map, position: latLng, title:info});

                        // Set an attribute on the marker, it can be named whatever...
                        marker.html = '<div>' + app.models.withdraw.getAt(i).data.description + '</div>';

                        google.maps.event.addListener(marker, 'click', function(){
                            infowindow.setContent(this.html);
                            infowindow.open(map, this);
                        });
                        
                        setTimeout( function(){ map.panTo (latLng); } , 1000);
                    }
                }
            },
            iconCls: 'search'
        });

		this.views.withdrawForm = new Ext.form.FormPanel({
			title: 'Withdraw',
			items: [
			        {
			            xtype: 'numberfield',
			            name : 'amount',
						label: 'Amount'
			        },
					{
			            xtype: 'textfield',
			            name : 'description',
						label: 'Description'
			        },
					{
						xtype: 'button',
						name: 'submit',
						text: 'Withdraw',
						handler: function() {
							var data = app.views.withdrawForm.getValues();
							var date = new Date();
							app.views.withdrawForm.currentWithdrawn = {amount: data.amount, description: data.description, datetime: date.toUTCString(), timestamp: date.getTime(), photo: 'img/default-photo.jpg', x: -1,y: -1};
							navigator.camera.getPicture(function(imageData) {
								app.views.withdrawForm.currentWithdrawn.photo = 'data:image/jpeg;base64,' + imageData;
								navigator.geolocation.getCurrentPosition(function(position) {
                                    app.views.withdrawForm.currentWithdrawn.y = position.coords.longitude;
                                    app.views.withdrawForm.currentWithdrawn.x = position.coords.latitude;
									app.models.withdraw.add(app.views.withdrawForm.currentWithdrawn);
									app.models.withdraw.sync();
                                    // add marker
                                    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                    var marker = new google.maps.Marker({map: app.views.map.map , position: latLng, title:app.views.withdrawForm.currentWithdrawn.description});
                                    setTimeout( function(){ app.views.map.map (latLng); } , 1000);                                     
                                    
                                    app.views.withdrawForm.items.items[0].setValue('');
                                    app.views.withdrawForm.items.items[1].setValue('');
									app.views.viewPort.setActiveItem(3);
								}, function(e) {
									Ext.Msg.alert(e);
								});
							}, function(e) {
								Ext.Msg.alert(e);
							}, { quality: 30 }); 
						}
					}
			    ],
			iconCls: 'action'
		});
		
		this.views.withdraw = new Ext.Panel({
			title: 'Withdraw',
			layout: 'card',
			cardSwitchAnimation: 'cube',
			items: [this.views.withdrawForm],
			iconCls: 'action'
		});
		
		this.views.report = new Ext.Panel({
			title: 'Report',
            items: [new Ext.List({
			    fullscreen: true,
			    itemTpl : '<img src="{photo}" /><div>{datetime}<br /><strong>${amount}</strong> {description}</div>',
			    store: this.models.withdraw,
                // events
                listeners: {
                    itemdoubletap: function( view, index, item, e) {
                        var x = app.models.withdraw.getAt(index).get('x');
                        var y = app.models.withdraw.getAt(index).get('y');
                        var latLng = new google.maps.LatLng(x,y);
                        setTimeout( function(){ app.views.map.map (latLng); } , 1000);
                        
                        // switch view
                        app.views.viewPort.setActiveItem(3);
                    }
                }
			})],
			iconCls: 'info'
		});
		
		this.views.viewPort = new Ext.TabPanel({
			fullscreen: true,
			layout: 'card',
			cardSwitchAnimation: 'pop',
			tabBar: {
				dock: 'bottom',
				layout: {
					pack: 'center'
				}
			},
		    items: [this.views.main, this.views.deposit, this.views.withdraw,  this.views.map, this.views.report]
		});
		
		//this.views.main.getEl().on('touchstart', function() {
		//	varExt.get('coin').removeClass('hidden');
		//});
		
		new Ext.util.TapRepeater('money1', {
		listeners: {
            touchstart: function( tap, e){			
				app.views.deposit.items.items[0].setValue(parseInt(app.views.deposit.items.items[0].getValue())+1000);
				tap.el.dom.childNodes[1].innerText = parseInt(tap.el.dom.childNodes[1].innerText)+1;
			}
			}
        });
		
		new Ext.util.TapRepeater('money2', {
		listeners: {
            touchstart: function( tap, e){			
				app.views.deposit.items.items[0].setValue(parseInt(app.views.deposit.items.items[0].getValue())+2000);
				tap.el.dom.childNodes[1].innerText = parseInt(tap.el.dom.childNodes[1].innerText)+1;
			}
			}
        });
		
		new Ext.util.TapRepeater('money5', {
		listeners: {
            touchstart: function( tap, e){			
				app.views.deposit.items.items[0].setValue(parseInt(app.views.deposit.items.items[0].getValue())+5000);
				tap.el.dom.childNodes[1].innerText = parseInt(tap.el.dom.childNodes[1].innerText)+1;
			}
			}
        });
		
		new Ext.util.TapRepeater('money10', {
		listeners: {
            touchstart: function( tap, e){			
				app.views.deposit.items.items[0].setValue(parseInt(app.views.deposit.items.items[0].getValue())+10000);
				tap.el.dom.childNodes[1].innerText = parseInt(tap.el.dom.childNodes[1].innerText)+1;
			}
			}
        });
		
		new Ext.util.TapRepeater('money20', {
		listeners: {
            touchstart: function( tap, e){			
				app.views.deposit.items.items[0].setValue(parseInt(app.views.deposit.items.items[0].getValue())+20000);
				tap.el.dom.childNodes[1].innerText = parseInt(tap.el.dom.childNodes[1].innerText)+1;
			}
			}
        });
		
		new Ext.util.TapRepeater('money50', {
		listeners: {
            touchstart: function( tap, e){			
				app.views.deposit.items.items[0].setValue(parseInt(app.views.deposit.items.items[0].getValue())+50000);
				tap.el.dom.childNodes[1].innerText = parseInt(tap.el.dom.childNodes[1].innerText)+1;
			}
			}
        });
		
		new Ext.util.TapRepeater('money100', {
		listeners: {
            touchstart: function( tap, e){			
				app.views.deposit.items.items[0].setValue(parseInt(app.views.deposit.items.items[0].getValue())+100000);
				tap.el.dom.childNodes[1].innerText = parseInt(tap.el.dom.childNodes[1].innerText)+1;
			}
			}
        });
		
		new Ext.util.TapRepeater('money200', {
		listeners: {
            touchstart: function( tap, e){			
				app.views.deposit.items.items[0].setValue(parseInt(app.views.deposit.items.items[0].getValue())+200000);
				tap.el.dom.childNodes[1].innerText = parseInt(tap.el.dom.childNodes[1].innerText)+1;
			}
			}
        });
		
		new Ext.util.TapRepeater('money500', {
		listeners: {
            touchstart: function( tap, e){			
				app.views.deposit.items.items[0].setValue(parseInt(app.views.deposit.items.items[0].getValue())+500000);
				tap.el.dom.childNodes[1].innerText = parseInt(tap.el.dom.childNodes[1].innerText)+1;
			}
			}
        });
		
		new Ext.util.Draggable('coin', {
            revert: true
        });
		
		new Ext.util.Draggable('coin1', {
            revert: true
        });
		
		new Ext.util.Droppable('wallet', {
            validDropMode: 'contains',
            listeners: {
                drop: function(droppable, draggable, e) {
                    app.views.viewPort.setActiveItem(1);
                    draggable.moveTo(100,100);
                },
				 dropleave: function(droppable, draggable, e) {
                    app.views.viewPort.setActiveItem(2);
                }
            }
        });
	}
};

new Ext.Application({
    launch: function() {
		// Launch Application
		app.launch();
	}
});
