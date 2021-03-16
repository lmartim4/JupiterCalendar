var lista = []
var rodou = false
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		lista = request.aulas;
		console.log(lista)
		sendResponse({ msg: "done" })
		setTimeout(function () { loopInAulas() }, 500);
	}
);

const API_KEY = 'AIzaSyDYk0hS2ajuG0xnT0eIkz-Rb8zzZZHHxWA';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

function onGAPILoad() {
	gapi.client.init({
		// Don't pass client nor scope as these will init auth2, which we don't want
		apiKey: API_KEY,
		discoveryDocs: DISCOVERY_DOCS,
	}).then(function () {
		console.log('gapi initialized')
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
	console.log('got the token', token);
})



function loopInAulas() {
	if (rodou) return;
	rodou = true

	var status = document.querySelector("#Status");
	status.innerHTML = "Carregando grade à Agenda"
	let time = 0;
	for (const aula of lista) {
		setTimeout(function () {
			console.log(aula);
			var request = gapi.client.calendar.events.insert({
				'calendarId': 'primary',
				'resource': aula.event
			});

			request.execute(function (event) {
				addEventToHTML(event)
				console.log(event);
				console.log('Event created: ' + event.htmlLink);
			});
		}, time += 500);

	}
	setTimeout(function () {
		status.innerHTML = "Grade carregada à Agenda"
	}, time += 500);

}


function addEventToHTML(event) {
	var lista = document.querySelector("#ListaDeMaterias");
	var toAdd = document.createElement("div");
	toAdd.innerHTML = event.summary;
	toAdd.classList.add("materia")

	lista.appendChild(toAdd);

}