let gradeHoraria = [];

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

//enviar para a agenda
function enviarParaAgenda() {
	var status = document.querySelector("#Status");
	status.innerHTML = "Carregando grade à Agenda"
	let time = 0;

	for (const aula of aulas) {
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