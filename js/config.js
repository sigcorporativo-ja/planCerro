var apikey="pl4n06";
/************************************** SERVICIOS ****************************************/
var getHermandades 	= "https://ws199.juntadeandalucia.es/prom/rest/hermandades/";
var getDias 		= "https://ws199.juntadeandalucia.es/prom/rest/fechas/";
var getRutas 		= "https://ws199.juntadeandalucia.es/prom/rest/ruta/";
var getFechas 		= "https://ws199.juntadeandalucia.es/prom/rest/fechas/";
var getCamino 		= "https://ws199.juntadeandalucia.es/prom/rest/camino/";
var getPasos 		= "https://ws199.juntadeandalucia.es/prom/rest/pasos/";
var getFechasPaso 	= "https://ws199.juntadeandalucia.es/prom/rest/fechas/paso/";
var getHoras 		= "https://ws199.juntadeandalucia.es/prom/rest/horario/";
var getGPS			= "https://ws199.juntadeandalucia.es/prom/rest/gps/";
var getColor 		= "https://ws199.juntadeandalucia.es/prom/rest/color/"; //NO USADO
/**/
var zoomToPoint = 12;
var updateGPS = 300; //en segundos
var timeout = 10; //en segundos. Se usa para detectar si hay algún problema con los servicios no controlado
M.proxy(false);
/*********************** MENSAJES DE ERROR NO CONTROLADO EN LOS SERVICIOS **********************/
var noPosicion 		= "No existe posición para la hermandad seleccionada";
var errInesperado 	= "Ha ocurrido un error inesperado. Vuelva a ejecutar la aplicación";
var htmlAcercade	= "<img src='img/logoJunta.png'/><br>Plan Romero<br>Versión 1.0.0<br><br>Junta de Andalucía<br><a href='#' onclick='javascript:openInfo();'>Consejería de Justicia e Interior</a>";
function openInfo(){
	cordova.InAppBrowser.open('http://www.juntadeandalucia.es/organismos/justiciaeinterior.html','_system');
}
