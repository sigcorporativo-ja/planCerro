var apikey="pl4n06";
var urlBase = "https://ws199.juntadeandalucia.es/vcab/rest/"
/************************************** SERVICIOS ****************************************/
var getHermandades 	= urlBase + "hermandades/";
var getDias 		= urlBase + "fechas/";
var getRutas 		= urlBase + "ruta/";
var getFechas 		= urlBase + "fechas/";
var getCamino 		= urlBase + "camino/";
var getPasos 		= urlBase + "pasos/";
var getFechasPaso 	= urlBase + "fechas/paso/";
var getHoras 		= urlBase + "horario/";
var getGPS			= urlBase + "gps/";
var getAvisos	    = urlBase + "avisos/";
//var getGPS			= "http://www.mocky.io/v2/56deaf14110000a303979e5c/";
var getColor 		= urlBase + "color/"; //NO USADO
/**/
//var bboxContext = [96388,3959795,621889,4299792];
var bboxContext = [395827,4210307,411397,4225578];
var zoomToPoint = 12;
var updateGPS = 150; //en segundos
var intervalAvisos = 15; //en segundos
var timeout = 15; //en segundos. Se usa para detectar si hay algún problema con los servicios no controlado
const docsPDF = [
	{
		nombre: "Normas de regulación y ordenación del tráfico",
		url: "https://ws199.juntadeandalucia.es/imgplan/NormaTraficoPlanCerro.pdf"
	},
	{
		nombre: "Programa de la Romería",
		url: "https://ws199.juntadeandalucia.es/imgplan/ProgramaPlanCerro.pdf"
	},
	{
		nombre: "Normas Andújar",
		url: "https://ws199.juntadeandalucia.es/imgplan/NormaAndujarPlanCerro.pdf"
	},
	{
		nombre: "Normas Marmolejo",
		url: "https://ws199.juntadeandalucia.es/imgplan/NormaMarmolejoPlanCerro.pdf"
	},
	{
		nombre: "Recomendaciones para prevenir riesgos",
		url: "https://ws199.juntadeandalucia.es/imgplan/RecomendacionesPlanCerro.pdf"
	},
	{
		nombre: "Teléfonos de interés",
		url: "https://ws199.juntadeandalucia.es/imgplan/TelefInteresPlanCerro.pdf"
	}
];
M.proxy(false);
var attrNotShow = [ "the_geom", "geom", "geometry", "_version_", "solrid", "keywords", "equipamiento"];
/*********************** MENSAJES DE ERROR NO CONTROLADO EN LOS SERVICIOS **********************/
var noGPS			= "Actualmente no existen posiciones GPS. Inténtelo más tarde";
var noPosicion 		= "No existe posición para la selección";
var errInesperado 	= "Ha ocurrido un error inesperado. Vuelva a ejecutar la aplicación";
var errCode = [2];
var errMsg = ["No es posible visualizar la ruta. El desplazamiento no se realiza en carreta"];
var htmlAcercade	= "<img src='img/logoJunta.png'/><br>Plan del Cerro<br>Versión 1.0.0<br><br>Junta de Andalucía<br><a href='#' onclick='javascript:openInfo();'>Consejería de Presidencia, Administración Pública e Interior</a>";
function openInfo(){
	cordova.InAppBrowser.open('https://www.juntadeandalucia.es/organismos/presidenciaadministracionpublicaeinterior.html','_system');
}
window.isApp 	= /^(?!HTTP)/.test(document.URL.toUpperCase()); //
window.iOS 		= /IPAD|IPHONE|IPOD/.test(navigator.userAgent.toUpperCase());
var poiStyle = function(feature, resolution){
	etiqueta = feature.get('nombre') || "";
	etiqueta += "\n\r";
	etiqueta += feature.get('hora de paso') || "";
	return [new ol.style.Style({
		image: new ol.style.Circle({
							radius: 6,
							fill: new ol.style.Fill({
								color: 'rgba(0, 204, 204, 0.6)'
							}),
							stroke: new ol.style.Stroke({
								color: 'rgba(0, 0, 204, 1)',
								width: 1
							})
						}),
			text: new ol.style.Text({
				text: etiqueta,
				font: 'bold 9px arial',
				offsetY: -18,
				fill: new ol.style.Fill({color: "#000"}),
				stroke: new ol.style.Stroke({
					color: "#ffffff",
					width: 3
				})
			})
	})];
};
var formatDate = function(date) {
	//console.log(date);
  return date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + " "
	+  ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2);
}
