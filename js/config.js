var apikey="123456";
/************************************** SERVICIOS ****************************************/
var getHermandades 	= "http://ws198.juntadeandalucia.es/desaprom/rest/hermandades/";
var getDias 		= "http://ws198.juntadeandalucia.es/desaprom/rest/fechas/";
var getRutas 		= "http://ws198.juntadeandalucia.es/desaprom/rest/ruta/";
var getFechas 		= "http://ws198.juntadeandalucia.es/desaprom/rest/fechas/";
var getCamino 		= "http://ws198.juntadeandalucia.es/desaprom/rest/camino/";
var getPasos 		= "http://ws198.juntadeandalucia.es/desaprom/rest/pasos/";
var getFechasPaso 	= "http://ws198.juntadeandalucia.es/desaprom/rest/fechas/paso/";
var getHoras 		= "http://ws198.juntadeandalucia.es/desaprom/rest/horario/";
var getGPS			= "http://ws198.juntadeandalucia.es/desaprom/rest/gps/";
var getColor 		= "http://ws198.juntadeandalucia.es/desaprom/rest/color/"; //NO USADO
/**/
var zoomToPoint = 12;
var updateGPS = 300; //en segundos
var timeout = 10; //en segundos. Se usa para detectar si hay algún problema con los servicios no controlado
M.proxy(false);
/*********************** MENSAJES DE ERROR NO CONTROLADO EN LOS SERVICIOS **********************/
var noPosicion 		= "No existe posición para la hermandad seleccionada";
var errInesperado 	= "Ha ocurrido un error inesperado";
var htmlAcercade	= "<img src='img/logoJunta.png'/><br>Plan Romero<br>Versión 1.0.0<br><br>Junta de Andalucía<br><a href='http://www.juntadeandalucia.es/organismos/justiciaeinterior.html' target='_blank'>Consejería de Justicia e Interior</a>";