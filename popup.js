let gradeHoraria = [];
var adicionado;
var naoadicionado;

document.addEventListener("DOMContentLoaded", function (event) {
	adicionado = document.querySelector("#MateriasEncontradas");
	naoadicionado = document.querySelector("#MateriasNaoEncontradas");
});

/* ------------------ Google API Loading --------------------*/
const API_KEY = 'AIzaSyDYk0hS2ajuG0xnT0eIkz-Rb8zzZZHHxWA';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
function onGAPILoad() {
	gapi.client.init({
		apiKey: API_KEY,
		discoveryDocs: DISCOVERY_DOCS,
	}).then(function () {
		console.log('GAPI Initialized')
		chrome.identity.getAuthToken({ interactive: true }, function (token) {
			gapi.auth.setToken({
				'access_token': token,
			});
		})
	}, function (error) {
		console.log('error', error)
	});
}
chrome.identity.getAuthToken({ interactive: true }, function (token) {
	console.log('Google Token API', token);
	pedirGradeHoraria();
})
/* ----------------------------------------------------------*/
//Recebe do Background e inicia envio para o google
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.msg == "gradePopup") {
			gradeHoraria = request.gradeHoraria;
			console.log(request)
			sendResponse({ msg: "done" })
			//a();

			//enviarParaAgenda();
			lerAgendaUsuario();
		}
	}
);

//adiciona no popup
function addEventToHTML(event) {
	var lista = document.querySelector("#ListaDeMaterias");
	var toAdd = document.createElement("div");
	toAdd.innerHTML = event.summary;
	toAdd.classList.add("materia")
	lista.appendChild(toAdd);
	console.log("Adding: " + event);
}

//Pedir Grade ao Background
function pedirGradeHoraria() {
	chrome.runtime.sendMessage({ msg: "getGrade" }, function (response) {
		var lastError = chrome.runtime.lastError;
		if (lastError) {
			console.log("Falha ao pedir a grade ao background");
		}
	});
}

function lerAgendaUsuario() {
	setTimeout(function () {
		gapi.client.calendar.events.list({
			'calendarId': 'primary',
			'timeMin': (new Date()).toISOString(),
			'showDeleted': false,
			'singleEvents': true,
			'maxResults': 200,
			'orderBy': 'startTime'
		}).then(function (response) {
			var events = response.result.items;
			console.log('Achamos ' + events.length + " eventos. Checando se pertencem à grade");

			if (events.length > 0) {
				for (i = 0; i < events.length; i++) {
					for (const aula of gradeHoraria) {
						if (events[i].summary == aula.nome) {
							aula.adicionado = true;
							console.log("Materia ja encontrada");
							continue;
						}
					}
				}
			} else {
				console.log('No upcoming events found.');
			}
			addAulaPosChecagem();
		});
	}, 600);
}
function addAulaPosChecagem() {
	console.log("Working? ");
	for (const aula of gradeHoraria) {
		console.log("Working? " + aula.nome);
		var divNova = document.createElement("div");
		var caixa = document.createElement("input");

		var label = document.createElement('label');

		label.appendChild(document.createTextNode(aula.nome));

		caixa.type = "checkbox";
		caixa.id = "materia";

		caixa.checked = !aula.adicionado;
		divNova.appendChild(caixa);
		divNova.appendChild(label);
		if (aula.adicionado) {
			adicionado.appendChild(divNova);
		} else {
			naoadicionado.appendChild(divNova);
		}
	}
}
//enviar para a agenda
function enviarParaAgenda() {
	var status = document.querySelector("#status");
	status.innerHTML = "Carregando grade à Agenda"
	let time = 0;

	for (const aula of gradeHoraria) {
		setTimeout(function () {
			var request = gapi.client.calendar.events.insert({
				'calendarId': 'primary',
				'resource': aula.event
			});

			request.execute(function (event) {
				addEventToHTML(event)
			});
		}, time += 500);

	}
	setTimeout(function () {
		status.innerHTML = "Grade carregada à Agenda"
	}, time += 500);
}

