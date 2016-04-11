var apikey="123456";
/************************************** SERVICIOS ****************************************/
var getHermandades 	= "http://ws198.juntadeandalucia.es/prom/rest/hermandades/";
var getDias 		= "http://ws198.juntadeandalucia.es/prom/rest/fechas/";
var getRutas 		= "http://ws198.juntadeandalucia.es/prom/rest/ruta/";
var getFechas 		= "http://ws198.juntadeandalucia.es/prom/rest/fechas/";
var getCamino 		= "http://ws198.juntadeandalucia.es/prom/rest/camino/";
var getPasos 		= "http://ws198.juntadeandalucia.es/prom/rest/pasos/";
var getFechasPaso 	= "http://ws198.juntadeandalucia.es/prom/rest/fechas/paso/";
var getHoras 		= "http://ws198.juntadeandalucia.es/prom/rest/horario/";
var getGPS			= "http://ws198.juntadeandalucia.es/prom/rest/gps/";
var getColor 		= "http://ws198.juntadeandalucia.es/prom/rest/color/"; //NO USADO
/**/
var zoomToPoint = 12;
var updateGPS = 300; //en segundos
var timeout = 10; //en segundos. Se usa para detectar si hay algún problema con los servicios no controlado
M.proxy(false);
/*********************** MENSAJES DE ERROR NO CONTROLADO EN LOS SERVICIOS **********************/
var noPosicion 		= "No existe posición para la hermandad seleccionada";
var errInesperado 	= "Ha ocurrido un error inesperado. Vuelva a ejecutar la aplicación";
var htmlAcercade	= "<img src='img/logoJunta.png'/><br>Plan Romero<br>Versión 1.0.0<br><br>Junta de Andalucía<br><a href='#' onclick='javascript:cordova.InAppBrowser.open('http://www.juntadeandalucia.es/organismos/justiciaeinterior.html','_system');'>Consejería de Justicia e Interior</a>";