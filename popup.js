var lista = []

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		lista = request.aulas;
		console.log(lista)
		sendResponse({ msg: "done" })
		loopInAulas()
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
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		// Handle the initial sign-in state.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignoutClick;
	}, function (error) {
		console.log('error', error)
	});
}

chrome.identity.getAuthToken({ interactive: true }, function (token) {
	console.log('got the token', token);
})

function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		/*authorizeButton.style.display = 'none';
		signoutButton.style.display = 'block';*/
		listUpcomingEvents();
	} else {
		/*authorizeButton.style.display = 'block';
		signoutButton.style.display = 'none';*/
	}
}

function listUpcomingEvents() {
	gapi.client.calendar.events.list({
	  'calendarId': 'primary',
	  'timeMin': (new Date()).toISOString(),
	  'showDeleted': false,
	  'singleEvents': true,
	  'maxResults': 10,
	  'orderBy': 'startTime'
	}).then(function(response) {
	  var events = response.result.items;
	  console.log('Upcoming events:');

	  if (events.length > 0) {
		for (i = 0; i < events.length; i++) {
		  var event = events[i];
		  var when = event.start.dateTime;
		  if (!when) {
			when = event.start.date;
		  }
		  console.log(event.summary + ' (' + when + ')')
		}
	  } else {
		console.log('No upcoming events found.');
	  }
	});
  }

function loopInAulas() {
	for (const aula of lista) {
		console.log(aula);
		var request = gapi.client.calendar.events.insert({
			'calendarId': 'primary',
			'resource': aula.getCalendarEvent()
		});

		request.execute(function (event) {
			appendPre('Event created: ' + event.htmlLink);
		});
	}
}