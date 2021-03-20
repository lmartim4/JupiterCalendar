const gradeHoraria = [];

const TaskLerGrade = setInterval(() => { // FICA TENTANDO ACHAR A GRADE
	const tabela = document.querySelector("#tableGradeHoraria");
	if (tabela) {
		if (LerTabelaEnviarBackground(tabela)) {
			console.log("A grade foi lida com sucesso");
			clearInterval(TaskLerGrade);
		}
	} else
		console.log("Falha ao ler a grade. Tentando novamente em 1 segundo.");
}, 1000)
// Cria um botão ao lado do títilo "Grade Horária" após carregar a tabela
function criaBotao() {
	const div = document.querySelector(".ui-jqgrid-titlebar")
	if (!div)
		return;

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
	button.addEventListener("click", function () {

	});
	div.appendChild(button);
}
//Tenta carregar a grade e retorna true se tiver conseguido
function LerTabelaEnviarBackground(tabela) {
	var tbody = tabela.querySelector("tbody");
	if (tbody) { //Encontrou o objeto carregado
		var row_id = 1;
		var row_obj = tbody.querySelector("[id='" + row_id + "']");

		while (row_obj) {
			var i = row_obj.querySelector("[aria-describedby='tableGradeHoraria_horent']").innerHTML
			var f = row_obj.querySelector("[aria-describedby='tableGradeHoraria_horsai']").innerHTML
			materiaNoVetor(row_obj.querySelector("[aria-describedby='tableGradeHoraria_seg']").textContent, i, f, "seg")
			materiaNoVetor(row_obj.querySelector("[aria-describedby='tableGradeHoraria_ter']").textContent, i, f, "ter")
			materiaNoVetor(row_obj.querySelector("[aria-describedby='tableGradeHoraria_qua']").textContent, i, f, "qua")
			materiaNoVetor(row_obj.querySelector("[aria-describedby='tableGradeHoraria_qui']").textContent, i, f, "qui")
			materiaNoVetor(row_obj.querySelector("[aria-describedby='tableGradeHoraria_sex']").textContent, i, f, "sex")
			materiaNoVetor(row_obj.querySelector("[aria-describedby='tableGradeHoraria_sab']").textContent, i, f, "sab")
			row_obj = tbody.querySelector("[id='" + ++row_id + "']")
		}
		criaBotao();
		SendGradeToBackground();
		return true;
	} else {
		return false;
	}
}
function materiaNoVetor(a, i, f, d) {
	if (a)
		gradeHoraria.push({
			nome: a,
			inicio: i,
			fim: f,
			dia: d,
			adicionado: false,
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
						{
							'method': 'popup',
							'minutes': 15
						}
					]
				}
			}
		});
}
function SendGradeToBackground() {
	const tarefa = setInterval(() => {
		chrome.runtime.sendMessage({ msg: "enviandoGrade", gradeHoraria }, function (response) {
			var lastError = chrome.runtime.lastError;
			if (lastError) {
				console.log("Falha ao enviar vetor de materias ao background. Tentando novamente em 1 segundo")
			} else {
				clearInterval(tarefa)
			}
		});
	}, 1000)
}