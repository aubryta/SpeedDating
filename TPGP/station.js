var t = window.location.search.substring(1);
var temp = t.split('=');
var paramNom = temp[1];

/************************************* CE QUI CONCERNE LES NEWS ****************************/
function getNews(){
	
	alert("couocu");
	var xhr = new XMLHttpRequest();
	
	xhr.open('GET',
			"flux_rss.php?ville="+paramNom);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			alert("getNews");
		var div = document.createElement("div");
		div.innerHTML = xhr.responseText;
		document.body.appendChild(div);
		//document.getElementById("news").innerHTML= 
			
		}
	};
	xhr.send(null);
	return xhr;
	
}
/************************************************* CE QUI CONCERNE L'API GOOGLE ********************************************************/
var map;
var infowindow;
var geocoder;


//document.getElementById('news').src="http://news.google.com/news?pz=1&cf=all&ned=fr&hl=fr&geo="+paramNom+"&output=rss";

//document.getElementById('news').src ="flux_wiki.php?ville="+paramNom ;
//document.getElementById("TitreInfoDeparts").innerHTML="<h2>Les prochains départs de "+paramNom+"</h2>";
function initialize() {
	getNews();
	geocoder = new google.maps.Geocoder();
	var address = "Ile-de-France,Station," + paramNom + "";
	var la, ln;
	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			la = results[0].geometry.location.lat();
			ln = results[0].geometry.location.lng();
		} else {
			alert("La géolocalisation a échoué pour la raison suivante : "
					+ status);
		}
	});
	var latlng = new google.maps.LatLng(la, ln);
	var mapOptions = {
			zoom : 17,

			// center: latlng
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
}

function afficher(typeRecherche) {
	map = new google.maps.Map(document.getElementById('map-canvas'), {
		//center: pyrmont,
		zoom : 17
	});
	geocoder = new google.maps.Geocoder();
	var address = "Ile-de-France,Station," + paramNom + "";
	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			la = results[0].geometry.location.lat();
			ln = results[0].geometry.location.lng();
			var pyrmont = new google.maps.LatLng(la, ln);

			map = new google.maps.Map(
					document.getElementById('map-canvas'), {
						center : pyrmont,
						zoom : 17
					});
			var request = {
					location : pyrmont,
					radius : 400,
					types : [ typeRecherche ]
			};
			infowindow = new google.maps.InfoWindow();
			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, callback);
			//google.maps.event.trigger(map, 'resize');
		} else {
			alert("La géolocalisation a échoué pour la raison suivante : "
					+ status);
		}
	});
}

function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map : map,
		position : place.geometry.location
	});
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent('<p><strong>' + place.name
				+ '</strong></p><p>' + place.vicinity + '</p>');
		// infowindow.setContent(place.vicinity);
		infowindow.open(map, this);
	});
}
google.maps.event.addDomListener(window, 'load', initialize);

/*******************************************************CE QUI CONCERNE L'AFFICHAGE DE LA LISTE DES TRAINS *******************************************/
var idStation = '87758607'; // idStation par défaut doit être modifier par l'appel de rechercheIdSncf
var num = new Array(), term = new Array(), date = "", miss = "", comm = "";
var HashTrainButtonOk = new Object();
var HashTrainButtonOff = new Object();
var HashTrainButtonSearch = new Object();
var HashMissButtonOk = new Object();
var nbResMax = 10;
/*Fonction faisant un appel jsonp pour récupérer la liste des trains
 */
function callWebService() {
	//var URLV = 'http://localhost:8080/SITE-SNCF/toto?idSncf=' + idStation + '&callback=?';
	var URLV ="http://peaceful-sands-6919.herokuapp.com/APITransilien?idSncf="+idStation+"&typeHoraire=depart&callback=?";
	$.ajax({
		url : URLV,
		type : 'get', /* Dont use post it JSONP doesnt support */
		dataType : 'jsonp',
		success : function(res) {
			//alert("success");
			processResponse(res);
		},
		error : function(e, msg) {
		
			affichePropositions();
			processError(e, msg);
		}
	});
}

/*Fonction de debug qui affiche si l'appel jsonp à fonctionné */
function processError(e, msg) {
	//alert('Call to Service Failed');
}

/*Fonction qui permet de rechercher un nom d'une station sncf dans la base à partir de l'id sncf*/
function rechercheNom(idGare, idDocument) {
	var URLV = "http://peaceful-sands-6919.herokuapp.com/ReadStation?type=id&idsncf="
		+ idGare + "&callback=?";
	//var URLV = "http://localhost:8080/SITE-SNCF/sql?type=id&idsncf="+idGare+"&callback=?";

	$.ajax({
		url : URLV,
		type : 'get',
		dataType : 'jsonp',
		success : function(res) {

			var nomS = res.nomStation.replace(",", " ");
			while (nomS.indexOf(',') > -1) {
				nomS = nomS.replace(",", " ");
			}
			if (nomS != 'NoResult' && nomS!="" ) {
				document.getElementById(idDocument).innerHTML = nomS;
				document.getElementById(idDocument).href = "station.jsp?name="
					+ nomS;
			} else
				document.getElementById(idDocument).style.color = 'red';
		},
		error : function(e, msg) {

			processError(e, msg);
		}
	});
}
/* Fonction permettant de rechercher l'id sncf d'une station en fonction de son nom */
function rechercheIdSncf() {

	var t = window.location.search.substring(1);
	var temp = t.split('=');
	var paramNom = temp[1];

	var nomStation = paramNom.replace("+", " ");
	while (nomStation.indexOf('+') > -1) {
		nomStation = nomStation.replace("+", " ");
	}

	var URLV = "http://peaceful-sands-6919.herokuapp.com/ReadStation?type=nom&nom='"
		+ nomStation + "'&callback=?";
	//var URLV = "http://localhost:8080/SITE-SNCF/sql?type=nom&nom='"+nomStation+"'&callback=?";
	var id = '87758607';
	$.ajax({
		url : URLV,
		type : 'get',
		dataType : 'jsonp',
		success : function(res) {
			if (!res.idSncf)
				affichePropositions();
			else{

				idStation = res.idSncf;
				callWebService();
			}

		},
		error : function(e, msg) {
			processError(e, msg);
		}
	});
	return idStation;
}

/* Fonction qui permet d'afficher la liste des trains */
function processResponse(res) {
	var item = "";
	//document.getElementById("TitreInfosDeparts").innerHTML  = "Les Prochains départs de "+"<?php echo htmlentities($_GET['name'])?>";
	//item+="<table BORDER='1' max-height=80%><tr><th max-width=20% overflow='hide'>num</th><th width=20%>Direction</th><th width=20%>Heure</th><th width=20%>Mission</th><th width=20%>Infos</th></tr>";
	var i = 0;
	var nbRes = 0;
	var nbInRow = 0;

	$.each(
			res.passages.train,
			function(key, val) {
				date = "";
				comm = "";
				if (nbRes < nbResMax)
					$.each(val, function(key2, val2) { //Pour chaque train 
						if (key2 == 'date') {//on récupère une date 
							$.each(val2, function(key3, val3) {
								date += val3 + " ";
							})
						} else if (key2 == 'term')
							term[i] = val2;
						else if (key2 == 'num')
							num[i] = val2;
						else if (key2 == 'miss')
							miss = val2;
						else
							comm += val2;
					})
					if (nbRes < nbResMax) {
						doModal(i);
						if (i == 0 || i == 4 || i == 8)
							item += '<div class="row">';
						item += '<div class="panel panel-default trainPanel col-xs-6 col-sm-3"> <div class="panel-heading">'
							+ "<button id='ok"+i+"' type='button' class='btn btn-success btn-xs'  data-toggle='tooltip' data-placement='right' title='je prends ce train'><span class='glyphicon glyphicon-ok' ></span></button>"
							+ "<button id='ok"+i+"off' type='button' class='btn btn-danger btn-xs'   data-toggle='tooltip' data-placement='right' title='je ne prends plus ce train'><span class='glyphicon glyphicon-remove' ></span></button>"
							+ "<button id='search"
							+ i
							+ "'type='button' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#myModal"
							+ i
							+ "' data-tooltip='tooltip'  title='Qui prend ce train ?'><span class='glyphicon glyphicon-search'></span></button>"
							+ '</div>' + '<div class="panel-body">';
						item += '<p>Num: ' + num[i] + '<p>';
						item += '<p>Destination: <a id=res'+i+'>'
						+ term[i] + '</a></p>';
						item += '<p>Date/Heure: ' + date + '</p>';
						item += '<p>Mission: ' + miss + '</p>';
						if (comm != "")
							item += '<p>Info: ' + comm + '<p>';
						item += '</div></div>';
						if (i == 3 || i == 7 || i == 11)
							item += '</div>';
						//Panel content</div>
						/*item +='<tr><td width=20%>'+num[i]+"</td>";
								item+="<td width=20%><a id='res"+i+"'>"+term[i]+"</a></td>";
								item+='<td width=20%>'+""+date+"</td>";
								item+='<td width=20%>'+""+miss+"</td>";
								item+='<td width=20%>'+""+comm+"</td><td ><button id='ok"+i+"' type='button' class='btn btn-default btn-xs'  data-toggle='tooltip' data-placement='right' title='je prends ce train'><span class='glyphicon glyphicon-ok' ></span></button>"+
																		 "<button id='ok"+i+"off' type='button' class='btn btn-default btn-xs'   data-toggle='tooltip' data-placement='right' title='je ne prends plus ce train'><span class='glyphicon glyphicon-remove' ></span></button>"+
																		 "<button id='search"+i+"'type='button' class='btn btn-default btn-xs' data-toggle='modal' data-target='#myModal"+i+"' data-tooltip='tooltip'  title='Qui prend ce train ?'><span class='glyphicon glyphicon-search'></span></button></td></tr>";
						 */
						HashTrainButtonOk['ok' + i] = num[i];
						HashTrainButtonOff['ok' + i+'off'] = num[i];
						HashTrainButtonSearch['myModal' + i] = num[i];
						HashMissButtonOk['ok' + i] = miss;
						i++;
						nbRes++;
					}
			});

	//item+="</table>";
	document.getElementById("InfosDeparts").innerHTML = item;
	for (i = 0; i < nbRes; i++) {

		$('#ok' + i+'off').click(function() {
			supprimerPassager(this.id);
		});

		$('#ok' + i).click(function() {
			prendreTrain(this.id);

		});
	}
	for (i = 0; i < nbRes; i++) {


		$('#myModal' + i).on('show.bs.modal', function(e) {
			afficherPassagers(this.id);
		});
	}
	for (i = 0; i < nbRes; i++)
		rechercheNom(term[i], 'res' + i);
}
//Fonction permettant d'ajouter un n-uplet dans la table prend_train 
function prendreTrain(id) {
	if(session_isConnected && session_pseudo &&  session_pseudo!="undefined" && session_pseudo!=""){
		var i = id;
		var xhr = new XMLHttpRequest();
		xhr.open('POST', "http://peaceful-sands-6919.herokuapp.com/Insert");

		xhr.setRequestHeader("Content-type",
		"application/x-www-form-urlencoded");
		xhr.send("table=prend_train&idGareSncf=" + idStation + "&numTrain="
				+ HashTrainButtonOk[i] + "&miss=" + HashMissButtonOk[i]
		+ "&idUser=" + session_pseudo);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if (/^OK|2/.test(xhr.responseText))
					alert('Vous avez bien été ajouté à la liste des passagers');
				else
					alert('Une erreur lors de l\'ajout à la liste des passagers');
			}
		};
	}else alert("Vous devez être connecté");
	return xhr;
}

//Fonction permettant d'ajouter un n-uplet dans la table prend_train 
function supprimerPassager(id) {

	if(session_isConnected && session_pseudo && session_pseudo!="undefined" && session_pseudo!=""){
		var i = id;
		var xhr = new XMLHttpRequest();
		xhr.open('POST', "http://peaceful-sands-6919.herokuapp.com/DeletePassager");

		xhr.setRequestHeader("Content-type",
		"application/x-www-form-urlencoded");
		xhr.send("idGareSncf=" + idStation + "&numTrain="
				+ HashTrainButtonOff[i] 
		+ "&idUser=" +session_pseudo);

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				//if (/^OK|2/.test(xhr.responseText))
				alert('Vous avez bien été supprimé de la liste des passagers');
				//else
				//	alert('Une erreur lors de la suppression de la liste des passagers');
			}
		};
	}else alert("Vous devez être connecté");
	return xhr;
}
//Affiche la liste des personnes qui prennnent un train avec un id précis
function afficherPassagers(idButtonSearch) {

	var URLV = "http://peaceful-sands-6919.herokuapp.com/ReadTrain?idGareSncf=" + idStation + "&numTrain="
	+ HashTrainButtonSearch[idButtonSearch]+"&callback=?";
	/*var URLV = "http://localhost:8080/SITE-SNCF/ReadTrain?table=prend_train&idGareSncf=" + idStation + "&numTrain="
	+ HashTrainButtonSearch[idButtonSearch]+"&callback=?";*/
	var id = '87758607';
	$.ajax({
		url : URLV,
		type : 'get',
		dataType : 'jsonp',
		success : function(res) {
			if(res.length==0) document.getElementById("body_" + idButtonSearch).innerHTML="Aucun passager";
			else{
				var temp = '<ul class="list-group">';
				for(var i = 0; i<res.length;i++){
					temp+='<li class="list-group-item"><a href=utilisateur.jsp?pseudo=';
					temp+=res[i].idUser+'>';
					temp+=res[i].idUser;
					temp+="</a></li>";
				}
				temp+='</ul>';
				document.getElementById("body_" + idButtonSearch).innerHTML=temp;
			}


		},
		error : function(e, msg) {
			alert("error");
			processError(e, msg);
		}
	});

}

//Affiche les propositions de gares si jamais la gare demandé n'est pas trouvée
function displayResults(res) {

	if(res!=undefined){

		var response2 = res.split(":");
		var response1 = decodeURI(response2[1]);
		var nbPropositions = 0;
		if (response1) {
			while (response1.indexOf('+') > -1) {
				response1 = response1.replace("+", " ");
			}
			response1 = response1.replace('{',"");
			response1 = response1.replace('}',"");
			response1 =response1.replace('\"',"");
			response1 = response1.replace('\"',"");
			// On ne modifie les résultats que si on en a obtenu
			document.getElementById("InfosDeparts").innerHTML = "<h5> Peut être recherchez-vous une des stations suivantes ?</h5>"
				var response= response1.split('|');
			var responseLen = response.length;
			for (var i = 0, a; i < responseLen; i++) {
				nbPropositions++;

				document.getElementById("InfosDeparts").innerHTML += "<a href='station.jsp?name="
					+ response[i] + "'>" + response[i] + "</a><br>";

			}//for
			if (nbPropositions == 2)
				document.getElementById("InfosDeparts").innerHTML = "Il semblerait qu'aucune station ne corresponde à votre recherche";
		}
	}else document.getElementById("InfosDeparts").innerHTML = "Il semblerait qu'aucune station ne corresponde à votre recherche";

}

//Recherche dans la base de données des gares qui peuvent correspondre à la gare demandée
function affichePropositions() {
	// Effectue une requête et récupère les résultats      
	var xhr = new XMLHttpRequest();
	var name = paramNom;
	
	//	xhr.open('GET',
	//			"http://localhost:8080/SITE-SNCF/ReadStation?type=search&nom="+name);
	xhr.open('GET',
			"http://peaceful-sands-6919.herokuapp.com/ReadStation?type=search&nom="+name);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			if( /^NoResult|8/.test(xhr.responseText)){
				document.getElementById("InfosDeparts").innerHTML = "Il semblerait qu'aucune station ne corresponde à votre recherche";
			}
			else{
				displayResults(xhr.responseText);
			}
		}
	};
	xhr.send(null);
	return xhr;
}

/* Fonction permettant de créer des Modal Bootstrap pour afficher la liste des personnes qui prennent le train dynamiquement @see bootstrap.com */
function doModal(i) {
	var html = '<div class="modal fade" id="myModal'+i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel'+i+'" aria-hidden="true" >'
	+ '<div class="modal-dialog">'
	+ '<div class="modal-content">'
	+ '<div class="modal-header">'
	+ '<button type="button" class="close" data-dismiss="modal">'
	+ '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
	+ '<h4 class="modal-title" id="myModalLabel'+i+'">Qui prend ce train ?</h4>'
	+ '</div>'
	+ '<div class="modal-body" id="body_myModal'+i+'">Recherche des personnes prennant ce train'
	+ '</div>'
	+ '<div class="modal-footer">'
	+ '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
	+ '</div>' + '</div>' + '</div>' + '</div>';

	$('#idMyModal').append(html);

}

//Permet l'affichage de tooltips des boutons search qui affiche la liste des utilisateurs qui prennent un train 
$(document).ready(function() {
	$('body').tooltip({
		selector : "[data-tooltip=tooltip]",
		container : "body"
	});
});
