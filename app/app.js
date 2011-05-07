app = {
	views: {},
	
	models: {currentPosition: {}},
	
	launch: function() {
		
		// Model
		Ext.regModel('Withdraw', {
		    fields: ['id', 'amount', 'description', 'datetime', 'timestamp', 'x', 'y'],

		    proxy: {
		        type: 'localstorage',
		        id  : 'myvi-withdraw'
		    }
		});
		
		this.models.withdraw = new Ext.data.Store({
		    model: 'Withdraw',
			autoLoad: true
		});
		
		this.views.main = new Ext.Panel({
			title: 'MyVi\'',
			html: '<div id="wrapper"><div id="coin"><img class="imgbase" src="img/coin.png" /></div><div id="wallet"><img class="imgbase" src="img/wallet.png" /></div></div>',
			iconCls: 'download'
		});
		
		this.views.deposit = new Ext.form.FormPanel({
			title: 'Deposit',
			items: [
			        {
			            xtype: 'numberfield',
			            name : 'amount',
						label: 'Amount'
			        },
					{
						xtype: 'button',
						name: 'submit',
						text: 'Deposit',
						handler: function() {
							
						}
					}
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
            title : 'map',
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
            }
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
							navigator.geolocation.getCurrentPosition(function(position) {
								var data = app.views.withdrawForm.getValues();
								var date = new Date();
								app.models.withdraw.add({amount: data.amount, description: data.description, datetime: date.toUTCString(), timestamp: date.getTime(), x: position.coords.latitude,y: position.coords.longitude});
								app.models.withdraw.sync();
								app.views.withdraw.setActiveItem(1);
							}, function(e) {
								Ext.Msg.alert(e);
							});
						}
					}
			    ],
			iconCls: 'download'
		});
		
		this.views.withdraw = new Ext.Panel({
			title: 'Withdraw',
			layout: 'card',
			cardSwitchAnimation: 'cube',
			items: [this.views.withdrawForm, this.views.map],
			iconCls: 'download'
		});
		
		this.views.report = new Ext.Panel({
			title: 'Report',
            items: new Ext.List({
			    fullscreen: true,

			    itemTpl : '{datetime}: ${amount}, {description}',

			    store: this.models.withdraw
			}),
			iconCls: 'download'
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
		    items: [this.views.main, this.views.deposit, this.views.withdraw, this.views.report]
		});
		
		//this.views.main.getEl().on('touchstart', function() {
		//	varExt.get('coin').removeClass('hidden');
		//});
		
		new Ext.util.Draggable('coin', {
            revert: true
        });


		new Ext.util.Droppable('wallet', {
            validDropMode: 'contains',
            listeners: {
                drop: function(droppable, draggable, e) {
                    app.views.viewPort.setActiveItem(1);
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