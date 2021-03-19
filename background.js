let gradeHoraria = [];

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.msg == "enviandoGrade") {
            gradeHoraria = request.gradeHoraria;
            sendResponse({ msg: "done" })
        } else if (request.msg == "getGrade") {
            sendResponse({ msg: "done" })
            chrome.runtime.sendMessage({ msg: "gradePopup", gradeHoraria },
                function (response) {
                    var lastError = chrome.runtime.lastError;
                    if (lastError) {
                        console.log("Falha ao enviar grade horária ao popup")
                    }
                }
            );
        }
    }
);