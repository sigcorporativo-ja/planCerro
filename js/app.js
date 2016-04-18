/***********variables globales********/
var mapajsRuta, mapajsTopo, mapajsGPS;
var geoJSONformat = new ol.format.GeoJSON();
var vectorSourceGPS = new ol.source.Vector();
var vectorSourceRuta = new ol.source.Vector();
var dias = null;
var hermandades = [];
hermandades.getByField = function (field, value){
	for(i=0;i<this.length;i++){//forEach no interrumpe con return
		if(this[i][field] && this[i][field]!=null
			&& this[i][field].toString().toUpperCase()===value.toString().toUpperCase()) return this[i]; 
	}
	return null;
};
hermandades.add = function (h){
	this.push.apply(this,h);
};
/*************************************/

function getInfo(url,filtro){
	$.mobile.loading().show();
	if (filtro===undefined) filtro={};
	filtro.apikey=apikey;
	return $.ajax({
		dataType: "jsonp",
		url: url,
		timeout: timeout*1000,
		data: filtro		
	}).then(function(data, textStatus, jqXHR) {
		if (data.error){
			data.peticion=$(this)[0].url;
			return $.Deferred().reject(data);
		}else{
			return data;			
		}
	}).fail(function(e){
		//Captura de error genérica para todas las llamadas
		console.error(e.peticion, e.error);		
		if (e.statusText){ //ES UN ERROR NO CONTROLADO
			showDialog(errInesperado,'ERROR INESPERADO','error');
		}
	}).always(function(){
		$.mobile.loading().hide();
	});
}
function cargarHermandades(){
	return getInfo(getHermandades).done(function(data){
		hermandades.add(data.hermandades);
		$.each(hermandades,function(i,hermandad){
			option = $("<option value=" + hermandad.codigo_hermandad + ">" + hermandad.nombre + "</option>");
			$("#dropHermandadCamino").append(option);
			if(hermandad.gps){$("#dropHermandadGps").append(option.clone());}
		});
		cargarCamino($("#dropHermandadCamino").val());
	}).fail(function(e){showDialog(e.error.mensaje,'ERROR','error');});
}
function cargarHermandadesRuta(){
	return getInfo(getHermandades,{"ruta":true}).done(function(data){
		$.each(data.hermandades,function(i,hermandad){
			option = $("<option value=" + hermandad.codigo_hermandad + ">" + hermandad.nombre + "</option>");
			$("#dropHermandadRuta").append(option);
		});
		cargarFechasHermandad($("#dropHermandadRuta").val());
	}).fail(function(e){showDialog(e.error.mensaje,'ERROR','error');});
}
function cargarPasos(){
	return getInfo(getPasos).done(function(data){
		pasos = data.pasos;
		$.each(pasos,function(i,paso){
			option = $("<option value=" + paso.codigo_toponimo + ">" + paso.nombre_toponimo + "</option>");
			$("#dropPasos").append(option);
		});
		cargarDiasPaso($("#dropPasos").val()).done(function(data){
			cargarHoras($("#dropPasos").val(),$("#dropDiasPaso").val());
		});
	}).fail(function(e){showDialog(e.error.mensaje,'ERROR','error');});
}
function cargarCamino(idHermandad){
	listCamino = $("#listCamino");
	return getInfo(getCamino+idHermandad).done(function(data){
		listCamino.empty();
		$("#msjCamino").hide();
		$.each(data.pasos,function(i,paso){
			ul = listCamino.find("#"+paso.codigo_fecha);
			if (ul.length==1){
				ul=$(ul[0]);
			}
			else{
				div = $("<div data-role='collapsible'><h1>"+paso.dia_semana+"</h1></div>");
				ul = $("<ul data-role='listview' id='"+paso.codigo_fecha+"'></ul>");
				div.append(ul);
			}
			texto_fecha = paso.texto_fecha.match(/\d{1,2}:\d{1,2}/);
			topoNombre = texto_fecha.input.substr(0,texto_fecha.index).trim();
			toponimo = {"topoX":paso.x,"topoY":paso.y,"topoNombre":topoNombre+" ("+texto_fecha+")","topoHermandad":$("#dropHermandadCamino option:selected").text()};

			li = $("<li><a href='javascript:$.mobile.changePage(\"#toponimo\","+JSON.stringify(toponimo)+")'>"+topoNombre+"</a><p class='ui-li-aside'><strong>"+texto_fecha[0]+"</strong></p></li>");
			ul.append(li);
			listCamino.append(div);
		});
	}).fail(function(e){
		listCamino.empty();
		$("#msjCamino").html(e.error.mensaje).show();
	});
}
function cargarDiario(idDia){
	//JGL: no puedo usar las hermandades ya consultadas poque la respuesta no tiene los días de paso.
	return getInfo(getHermandades,{"codigo_fecha":idDia}).done(function(data){
		listDiario = $("#listDiario");
		listDiario.empty();

		$.each(data.hermandades,function(i,hermandad){
			gps = hermandad.nombre_largo.indexOf('(GPS)');
			if (gps>0){
				li = $("<li>"+hermandad.nombre_largo.substr(0,gps).trim()+"</li>"); 
				li.append("<p class='ui-li-aside'>GPS</p>");
			}else{
				li = $("<li>"+hermandad.nombre_largo+"</li>"); 
			}
			listDiario.append(li);
		});
	}).fail(function(e){showDialog(e.error.mensaje,'ERROR','error');});
}
function cargarHoras(idPaso, idDia){
	return getInfo(getHoras,{"codigo_toponimo":idPaso, "codigo_fecha":idDia}).done(function(data){
		listHoras = $("#listHoras");
		listHoras.empty();
		$.each(data.hora_hermandad,function(i,horaPaso){
			li = $("<li>"+horaPaso.nombre+"</li>"); 
			li.append("<p class='ui-li-aside'>"+horaPaso.hora+"</p>");
			listHoras.append(li);
		});
	}).fail(function(e){showDialog(e.error.mensaje,'ERROR','error');});
}
function cargarDiasPaso(idPaso){
	return getInfo(getFechasPaso+idPaso).done(function (data){
		$("#dropDiasPaso").empty();
		$.each(data.dias_semana_paso,function(i,dia){
			option=$("<option value=" + dia.codigo_fecha + ">" + dia.dia_semana + "</option>");
			$("#dropDiasPaso").append(option);
		});
	}).fail(function(e){showDialog(e.error.mensaje,'ERROR','error');}); 
}
function cargarDias(){
	return getInfo(getDias).done(function (data){
		dias = data.dias_semana;
		$.each(dias,function(i,dia){
			option=$("<option value=" + dia.codigo_fecha + ">" + dia.dia_semana + "</option>");
			$("#dropDiaDiario").append(option);
		});
		cargarDiario($("#dropDiaDiario").val());
	}).fail(function(e){showDialog(e.error.mensaje,'ERROR','error');});
}
function cargarFechasHermandad(idHermandad){
	return getInfo(getDias+idHermandad).done(function (data){
		
		$("#dropDiaRuta").empty();
		opCompleta=$("<option value='completa'>Completa</option>");
		opIda=$("<option value='ida'>Ida</option>");
		opVuelta=$("<option value='vuelta'>Vuelta</option>");
		$("#dropDiaRuta").append(opCompleta);

		dias = data.dias_semana;

		ida=false;
		vuelta = false;
		$.each(dias,function(i,dia){
			if (dia.dia_semana.toUpperCase().indexOf('IDA')>0) ida=true;
			if (dia.dia_semana.toUpperCase().indexOf('VUELTA')>0) vuelta=true;
			option=$("<option value=" + dia.codigo_fecha + ">" + dia.dia_semana + "</option>");
			$("#dropDiaRuta").append(option);
		});
		
		if (vuelta) $("#dropDiaRuta option:first").after(opVuelta);
		if (ida) $("#dropDiaRuta option:first").after(opIda);
	}).fail(function(e){showDialog(e.error.mensaje,'ERROR','error');});
}
function pintarRuta(hermandad, dia){
	if (mapajsRuta===undefined){
		mapajsRuta = M.map({
			controls:["location"],
			container:"mapRuta"}
			);
		lyRuta = new ol.layer.Vector({
			source: vectorSourceRuta,
			zIndex: 99999999,
			name: 'Ruta',
			style: function(feature, resolution){
				return [new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: feature.get('color'),
						width: 5									
					})/*,
					text: new ol.style.Text({
						text: feature.get('codigoTramo'),
						rotation: feature.get('angulo'), //si se usa, descomentar el cáculo
						font: 'bold 11px arial',
						fill: new ol.style.Fill({color: "#000"}),
						stroke: new ol.style.Stroke({
							color: "#ffffff",
							width: 3
						})
					})*/

				/*,geometry: function(feature) {
            // return the coordinates of the first ring of the polygon
            var coordinates = feature.getGeometry().getCoordinates()[0];
            console.log(coordinates);
          }*/
				})];
			}
		});

		mapajsRuta.getMapImpl().addLayer(lyRuta);

	}else{}

	filtro={};
	if ($.isNumeric(dia)) filtro.codigo_fecha =dia;
	
	getInfo(getRutas+hermandad, filtro).done(function(data){
		vectorSourceRuta.clear();
		
		features = geoJSONformat.readFeatures(data);
		if (!$.isNumeric(dia)){
			features= $.grep(features, function(f) {
				return (dia=='completa' || f.get('sentido') == dia);
			});
		}
		if (features.length>0){
			vectorSourceRuta.addFeatures(features);
			//JGL: cálculo de ángulo
			/*vectorSourceRuta.forEachFeature(function (f){
				start = f.getGeometry().getFirstCoordinate();
				end = f.getGeometry().getLastCoordinate();
				angulo = Math.abs(Math.atan2(end[1] - start[1], end[0] - start[0])* 180 / Math.PI);
				//rad = Math.atan2(end[1] - start[1], end[0] - start[0]);
				//angulo = 270-(rad*180/Math.PI); //más preciso ¿por?			
				f.set('angulo', angulo);
			});*/

			mapajsRuta.setBbox(vectorSourceRuta.getExtent());
		}else{
			//JGL: no debería ocurrir
			showDialog('El trayecto seleccionado no tiene elementos','INFORMACIÓN','warning');
		}
	}).fail(function(e){showDialog(e.error.mensaje,'ERROR','error');});
}
function pintarToponimo(data){

	if (mapajsTopo===undefined){

		mapajsTopo = M.map({
			controls:["location"],
			zoom: zoomToPoint,
			center: data.topoX+","+data.topoY+"*true",
			container:"mapToponimo"}
			);
	}else{
		mapajsTopo.setCenter(data.topoX+","+data.topoY+"*true").setZoom(zoomToPoint); 
	}
	$("#toponimo .ui-title").text(data.topoNombre);
	$("#toponimo .subheader").text(data.topoHermandad);
}
function updateLastPos(){
	filtro ={"emp" : "grea"};
	return getInfo(getGPS,filtro).done(function(data){
		vectorSourceGPS.clear();
		vectorSourceGPS.addFeatures(geoJSONformat.readFeatures(data, 
			{featureProjection: 'EPSG:25830'}));
		if (vectorSourceGPS.getFeatures().length>0){
			vectorSourceGPS.forEachFeature(function (f){
				h=hermandades.getByField('etiqueta_gps', f.get('name'));
				if (h!=null){
					f.set('color',h.color);
					h.lastPos = f.getGeometry().getCoordinates();
				}else{
					f.set('color',"#000");				
				}
			});
			
		}else{
			
			showDialog(noGPS,'ERROR','error');
		}
	}).fail(function(e){showDialog(e.error.mensaje,'ERROR','error');});
}

function pintarGPS(hermandad){
	if(hermandad!=null){ //pos si se quiere sólo pintar una hermandad
		features = vectorSourceGPS.getFeatures();
		vectorSourceGPS.clear();
		$.grep(features, function(f) {
			h=hermandades.getByField('etiqueta_gps', f.get('name'));
			return (h.codigo_hermandad === hermandad);
		});
		vectorSourceGPS.addFeatures(features);
	}
	bbox = vectorSourceGPS.getFeatures().length>0 ? vectorSourceGPS.getExtent(): bboxContext;

	if (mapajsGPS===undefined){
		mapajsGPS = M.map({
				controls:["location"],
				container:"mapGPS",
				bbox: bbox[0]+","+bbox[1]+","+bbox[2]+","+bbox[3]
			});
		lyGPS = new ol.layer.Vector({
			source: vectorSourceGPS,
			zIndex: 99999999,
			name: 'GPS',
			style: function(feature, resolution){
				return [new ol.style.Style({
					image: new ol.style.Circle({
						radius: 5,
						fill: new ol.style.Fill({
							color: feature.get('color')
						}),
						stroke: new ol.style.Stroke({
							color: "#000",
							width: 1
						})
					}),
					text: new ol.style.Text({
						text: feature.get('name'),
						font: 'bold 9px arial',
						offsetY: -12,
						fill: new ol.style.Fill({color: "#000"}),
						stroke: new ol.style.Stroke({
							color: "#ffffff",
							width: 3
						})
					})
				})];
			}
		});
		mapajsGPS.getMapImpl().addLayer(lyGPS);
	}
}
function bindEvents(){
	$(document).on("pagechange", function (e, data) {
  	  	if ($.type(data.toPage) == "object"){
	  		switch(data.toPage[0].id) {
	  			case 'ruta':
		  			pintarRuta($("#dropHermandadRuta").val(),$("#dropDiaRuta").val());
		  			mapajsRuta.getMapImpl().updateSize();  			
	  			break;
	  			case 'toponimo':
		  			pintarToponimo(data.options);
		  			mapajsTopo.getMapImpl().updateSize();
	  			break;
	  			case 'gps':
		  			updateLastPos().done(function(){
		  				//JGL: actualización dinámica
		  				//window.clearInterval(updateLastPos);
		  				//window.setInterval(updateLastPos, updateGPS*1000);
		  				pintarGPS();
		  				//JGL: si sólo se quiere pintar la hermandad seleccionada
		  				//pintarGPS($("#dropHermandadGps").val()); 
		  				mapajsGPS.getMapImpl().updateSize();	  				
		  			});
	  			break;
	  			default:
	  			break;
	  		}
	  	}
  	});
	$("#dropHermandadCamino").on("change", function() {
		cargarCamino($(this).val()).done(function(){$("#listCamino").collapsibleset().trigger("create");});
	});
	$("#dropDiaDiario").on("change", function() {
		cargarDiario($(this).val()).done(function(){$("#listDiario").listview("refresh");});
	});
	$("#dropPasos").on("change", function() {
		cargarDiasPaso($(this).val()).done(
			function(){
				$("#dropDiasPaso").selectmenu("refresh");
				cargarHoras($("#dropPasos").val(),$("#dropDiasPaso").val()).done(function(){
					$("#listHoras").listview("refresh");
				});
			});
	});
	$("#dropDiasPaso").on("change", function() {
		cargarHoras($("#dropPasos").val(),$("#dropDiasPaso").val()).done(
			function(){
				$("#listHoras").listview("refresh");
			});
	});
	$("#dropHermandadRuta").on("change", function() {
		cargarFechasHermandad($("#dropHermandadRuta").val()).done(function(){
			$("#dropDiaRuta").selectmenu("refresh");
			pintarRuta($("#dropHermandadRuta").val(),$("#dropDiaRuta").val());
		});
	});
	$("#dropDiaRuta").on("change", function() {
		pintarRuta($("#dropHermandadRuta").val(),$("#dropDiaRuta").val());
	});
	$("#dropHermandadGps").on("change", function() {
		//pintarGPS($(this).val()); //JGL: para sólo pintar la hermandad
		if($(this).val()!=0){
			h = hermandades.getByField('codigo_hermandad',$(this).val());
			if (h!=null && h.lastPos){
				mapajsGPS.setCenter(h.lastPos[0]+","+h.lastPos[1]).setZoom(zoomToPoint);
			}else{
				showDialog(noPosicion, "ERROR", "error");
			}
		}else{
			if (vectorSourceGPS.getFeatures().length>0){
				mapajsGPS.setBbox(vectorSourceGPS.getExtent());
			}else{
				showDialog(noGPS,'ERROR','error');
			}		
		}
	});
}

$(document).ready(function() {
    // are we running in native app or in a browser?
    window.isphone = false;
    if(document.URL.indexOf("http://") === -1 
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
    }

    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});

function onDeviceReady(){
	if(window.isphone) {StatusBar.hide();}
    $.when.apply($,[cargarDias(), 
		    cargarHermandades(),  
		    cargarPasos(), 
		    cargarHermandadesRuta()]).always(function(){
		      //JGL: oculto splash cuando se han cargado todos los datos básicos o ha dado error
		      navigator.splashscreen.hide(); 
		    });
    bindEvents();   
};

function showDialog(message, title, severity) {
	if (message && message!=null && message!=''){
      M.template.compile('dialog.html', {
         'message': message,
         'title': title,
         'severity': severity
      }).then(function(html) {
      	 M.dialog.remove();
         dialog = $(html);
         var okButton = dialog.find('div.m-button > button');
         $(okButton).on("click", function () { 
         	if (navigator.app && !/iPad|iPhone|iPod/.test(navigator.userAgent)
     			&& title.toUpperCase().indexOf('INESPERADO')>-1){
         		navigator.app.exitApp();
			}else{
         		dialog.remove(); 
         	}
         });
         $(document.body).append(dialog);
      });
    }
   };
function showInfo(){
	showDialog(htmlAcercade,'Acerca de','info');
}