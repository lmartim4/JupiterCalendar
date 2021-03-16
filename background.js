const aulas = [];

const lerGrade = setInterval(() => {
	const tabela = document.querySelector("#tableGradeHoraria");
	if (tabela) {
		const divCabeca = document.querySelector(".ui-jqgrid-titlebar")
		addCalendarButton(divCabeca)
		if (saveToArray(tabela)) {
			console.log("Grade lida com sucesso");
			clearInterval(lerGrade);
		}
	} else {
		console.log("Tentando ler a tabela em 1 segundo");
	}
}, 1000)


function addCalendarButton(div) {
	console.log(div);
	const button = document.createElement("button");
	button.innerHTML = "<strong>Google Agenda</strong>";
	button.classList.add("ui-jqgrid-title");
	button.style.backgroundColor = "Transparent";
	//button.style.backgroundImage = "radial-gradient(circle, #F7B64D, #F6AF3A)";
	button.style.border = "none";
	button.style.color = "#4285F4";
	button.style.marginTop = "-1px";
	button.style.marginLeft = "15px";
	button.style.borderRadius = "15";
	/*
	button.style.height = "15px";*/
	div.appendChild(button);
}

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
		console.log("Tentando ler a tabela em 1 segundo");
		return false;
	}
}

function criarMateria(a, i, f, d) {
	return {
		nome: a,
		inicio: i,
		fim: f,
		dia: d,
		event: {
			'summary': a,
			'location': 'Universidade de São Paulo',
			'description': `Aula de ` + a,
			'start': {
				'dateTime': "2021-04-12T" + i + ":00-03:00",
				'timeZone': 'America/Sao_Paulo'
			},
			'end': {
				'dateTime': "2021-04-12T" + f + ":00-03:00",
				'timeZone': 'America/Sao_Paulo'
			},
			'recurrence': [
				'RRULE:FREQ=WEEKLY;COUNT=1' //MUDAR PARA 16
			],
			'colorId': (Math.floor((Math.random() * 11)) + 1),
			'reminders': {
				'useDefault': false,
				'overrides': [
					{ 'method': 'popup', 'minutes': 15 }
				]
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
