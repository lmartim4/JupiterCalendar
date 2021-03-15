const aulas = [];

const lerGrade = setInterval(() => {
	const tabela = document.querySelector("#tableGradeHoraria");
	if (tabela) {
		if (saveToArray(tabela)) {
			console.log("Grade lida com sucesso");
			clearInterval(lerGrade);
		}
	} else {
		console.log("Tentando ler a tabela em 5 segundos");
	}
}, 5000)


function saveToArray(tabela) {
	var tbody = tabela.querySelector("tbody");
	if (tbody) {
		var row_id = 1;
		var row_obj = tbody.querySelector("[id='" + row_id + "']");
		while (row_obj) {
			var i = row_obj.querySelector("[aria-describedby='tableGradeHoraria_horent']").innerHTML
			var f = row_obj.querySelector("[aria-describedby='tableGradeHoraria_horsai']").innerHTML
			saveMateria(row_obj.querySelector("[aria-describedby='tableGradeHoraria_seg']").textContent, i, f, "seg")
			saveMateria(row_obj.querySelector("[aria-describedby='tableGradeHoraria_ter']").textContent, i, f, "ter")
			saveMateria(row_obj.querySelector("[aria-describedby='tableGradeHoraria_qua']").textContent, i, f, "qua")
			saveMateria(row_obj.querySelector("[aria-describedby='tableGradeHoraria_qui']").textContent, i, f, "qui")
			saveMateria(row_obj.querySelector("[aria-describedby='tableGradeHoraria_sex']").textContent, i, f, "sex")
			saveMateria(row_obj.querySelector("[aria-describedby='tableGradeHoraria_sab']").textContent, i, f, "sab")
			row_obj = tbody.querySelector("[id='" + ++row_id + "']")
		}

		const ta = setInterval(() => {
			chrome.runtime.sendMessage({
				aulas
			}, function (response) {
				if (response)
					clearInterval(ta);
			});
		}, 500)
		return true;
	} else {
		console.log("Tentando ler a tabela em 5 segundos");
		return false;
	}
}

function criarMateria(a, i, f, d) {
	return {
		nome: a,
		inicio: i,
		fim: f,
		dia: d,
		getCalendarEvent() {
			return {
				'summary': this.nome,
				'location': 'Universidade de São Paulo',
				'description': `Aula de ` + this.nome,
				'start': {
					'dateTime': "2021-04-12T" + this.inicio + ":00-03:00",
					'timeZone': 'America/Sao_Paulo'
				},
				'end': {
					'dateTime': "2021-04-12T" + this.fim + ":00-03:00",
					'timeZone': 'America/Sao_Paulo'
				},
				'recurrence': [
					'RRULE:FREQ=WEEKLY;COUNT=16'
				],
				'reminders': {
					'useDefault': false,
					'overrides': [
						{ 'method': 'popup', 'minutes': 15 }
					]
				}
			}
		}
	}
}

function saveMateria(a, i, f, d) {
	if (a) {
		aulas.push(criarMateria(a, i, f, d));
	}
}

/*
function loopInAulas() {
	for (const aula of aulas)
		console.log(aula);
}
*/
