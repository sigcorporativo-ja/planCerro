var apikey="pl4n06";
/************************************** SERVICIOS ****************************************/
var getHermandades 	= "http://www.juntadeandalucia.es/justiciaeinterior/prom/rest/hermandades/";
var getDias 		= "http://www.juntadeandalucia.es/justiciaeinterior/prom/rest/fechas/";
var getRutas 		= "http://www.juntadeandalucia.es/justiciaeinterior/prom/rest/ruta/";
var getFechas 		= "http://www.juntadeandalucia.es/justiciaeinterior/prom/rest/fechas/";
var getCamino 		= "http://www.juntadeandalucia.es/justiciaeinterior/prom/rest/camino/";
var getPasos 		= "http://www.juntadeandalucia.es/justiciaeinterior/prom/rest/pasos/";
var getFechasPaso 	= "http://www.juntadeandalucia.es/justiciaeinterior/prom/rest/fechas/paso/";
var getHoras 		= "http://www.juntadeandalucia.es/justiciaeinterior/prom/rest/horario/";
var getGPS			= "http://www.juntadeandalucia.es/justiciaeinterior/prom/rest/gps/";
var getColor 		= "http://www.juntadeandalucia.es/justiciaeinterior/prom/rest/color/"; //NO USADO
/**/
var bboxContext = [96388,3959795,621889,4299792];
var zoomToPoint = 12;
var updateGPS = 300; //en segundos
var timeout = 15; //en segundos. Se usa para detectar si hay algún problema con los servicios no controlado
M.proxy(false);
var attrNotShow = [ "the_geom", "geom", "geometry", "_version_", "solrid", "keywords", "equipamiento"];
/*********************** MENSAJES DE ERROR NO CONTROLADO EN LOS SERVICIOS **********************/
var noGPS			= "Actualmente no exiten posiciones de GPS. Inténtelo más tarde";
var noPosicion 		= "No existe posición para la hermandad seleccionada";
var errInesperado 	= "Ha ocurrido un error inesperado. Vuelva a ejecutar la aplicación";
var htmlAcercade	= "<img src='img/logoJunta.png'/><br>Plan Romero<br>Versión 1.0.0<br><br>Junta de Andalucía<br><a href='#' onclick='javascript:openInfo();'>Consejería de Justicia e Interior</a>";
function openInfo(){
	cordova.InAppBrowser.open('http://www.juntadeandalucia.es/organismos/justiciaeinterior.html','_system');
}
window.isApp 	= /^(?!HTTP)/.test(document.URL.toUpperCase()); //
window.iOS 		= /IPAD|IPHONE|IPOD/.test(navigator.userAgent.toUpperCase());
var poiStyle = new ol.style.Style({
										image: new ol.style.Circle({
															radius: 6,
															fill: new ol.style.Fill({
																color: 'rgba(0, 204, 204, 0.6)',
																opacity: 0.2
															}),
															stroke: new ol.style.Stroke({
																color: 'rgba(0, 0, 204, 1)',
																width: 1
															})
														})});
