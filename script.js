// =====================================================
// QUESTIONS
// =====================================================

const questions = [

    {
        dialogue: "Siddu nuvvu naa nadumu chusav",
        answer: "jalsa"
    },

    {
        dialogue: "Emo sir nak kapadad?",
        answer: "raja the great"
    },

    {
        dialogue: "Ippudu kakapothe inkeppudu",
        answer: "jalsa"
    },

    {
        dialogue: "Okkasari commit ayite",
        answer: "pokiri"
    },

    {
        dialogue: "Hippu appu hippu appu",
        answer: "rebel"
    },

    {
        dialogue: "Naa valle problem ayite nen vellipotaga idikell",
        answer: "jathi ratnalu"
    },

    {
        dialogue: "Andari favourite player okate, aa player name enti?",
        answer: "peddi"
    },

    {
        dialogue: "Hey Spandana nuv spandiste inka andanga untav",
        answer: "race gurram"
    },

    {
        dialogue: "Naaku konchem mathimarupu sir",
        answer: "bhale bhale magadivoy"
    },

    {
        dialogue:
        "City nunchi soft ga lover boy laga unnadu anukunnavemo, lopala original alage undi",
        answer: "brindavanam"
    }

];



// =====================================================
// TELUGU → ENGLISH MOVIE NAME MAPPING
// =====================================================

const teluguNames = {

    "జల్సా": "jalsa",
    "జల్స": "jalsa",

    "రాజా ది గ్రేట్": "raja the great",
    "రాజా ద గ్రేట్": "raja the great",

    "పోకిరి": "pokiri",
    "పోకిర": "pokiri",

    "రెబల్": "rebel",
    "రెబెల్": "rebel",

    "జాతి రత్నాలు": "jathi ratnalu",
    "జాతిరత్నాలు": "jathi ratnalu",

    "పెద్ది": "peddi",
    "పెడ్డి": "peddi",

    "రేస్ గుర్రం": "race gurram",
    "రేసుగుర్రం": "race gurram",

    "భలే భలే మగాడివోయ్": "bhale bhale magadivoy",
    "భలే భలే మగాడివో": "bhale bhale magadivoy",

    "బృందావనం": "brindavanam",
    "బ్రిందావనం": "brindavanam"

};



// =====================================================
// VARIABLES
// =====================================================

let currentQuestion = 0;

let score = 0;

let timeLeft = 15;

let timer = null;

let answerGiven = false;



// =====================================================
// CORRECT MESSAGES
// =====================================================

const correctMessages = [

    "Nuvvu thopehaaa! 🔥",

    "Genius ra beta nuv! 😂",

    "Ninnu ika evaru aapaleru! 😎"

];



// =====================================================
// START GAME
// =====================================================

function startGame() {

    currentQuestion = 0;

    score = 0;

    clearInterval(timer);


    document
        .getElementById("startPage")
        .classList.add("hidden");


    document
        .getElementById("finalPage")
        .classList.add("hidden");


    document
        .getElementById("gamePage")
        .classList.remove("hidden");


    loadQuestion();

}



// =====================================================
// LOAD QUESTION
// =====================================================

function loadQuestion() {

    answerGiven = false;

    clearInterval(timer);


    const question =
        questions[currentQuestion];



    // QUESTION NUMBER

    document.getElementById(
        "questionNumber"
    ).textContent =
        `Question ${currentQuestion + 1}/${questions.length}`;



    // SCORE

    document.getElementById(
        "score"
    ).textContent =
        `⭐ ${score}`;



    // DIALOGUE / SCENE

    document.getElementById(
        "dialogue"
    ).textContent =
        question.dialogue;



    // CLEAR INPUT

    const input =
        document.getElementById("answerInput");

    input.value = "";

    input.disabled = false;



    // ENABLE BUTTON

    document.getElementById(
        "checkButton"
    ).disabled = false;



    // STATUS

    document.getElementById(
        "status"
    ).textContent =
        "Type your answer and click Check Answer";



    // PROGRESS

    const percentage =
        ((currentQuestion + 1) /
        questions.length) * 100;


    document.getElementById(
        "progressBar"
    ).style.width =
        percentage + "%";



    // FOCUS INPUT

    input.focus();



    // START TIMER

    startTimer();

}



// =====================================================
// TIMER
// =====================================================

function startTimer() {

    timeLeft = 15;


    document.getElementById(
        "timer"
    ).textContent =
        `⏱️ ${timeLeft}`;



    timer = setInterval(function() {

        timeLeft--;


        document.getElementById(
            "timer"
        ).textContent =
            `⏱️ ${timeLeft}`;



        if (timeLeft <= 0) {

            clearInterval(timer);

            timeUp();

        }

    }, 1000);

}



// =====================================================
// TIME UP
// =====================================================

function timeUp() {

    if (answerGiven) {

        return;

    }


    answerGiven = true;


    document.getElementById(
        "answerInput"
    ).disabled = true;


    document.getElementById(
        "checkButton"
    ).disabled = true;


    const correctAnswer =
        questions[currentQuestion].answer;


    showTimeUp(correctAnswer);

}



// =====================================================
// NORMALIZE TEXT
// =====================================================

function normalizeText(text) {

    if (!text) {

        return "";

    }


    text = text
        .toLowerCase()
        .trim();



    // CHECK TELUGU MOVIE NAME

    if (teluguNames[text]) {

        text = teluguNames[text];

    }



    // REMOVE PUNCTUATION

    text = text.replace(
        /[.,!?'"`~@#$%^&*()_+=\[\]{}:;<>\/\\|-]/g,
        " "
    );



    // COMMON EXTRA WORDS

    const extraWords = [

        "movie",

        "film",

        "cinema"

    ];



    extraWords.forEach(function(word) {

        text = text.replace(
            new RegExp(
                "\\b" + word + "\\b",
                "g"
            ),
            ""
        );

    });



    // REMOVE EXTRA SPACES

    text = text
        .replace(/\s+/g, " ")
        .trim();



    return text;

}



// =====================================================
// LEVENSHTEIN SIMILARITY
// =====================================================

function getSimilarity(a, b) {

    a = normalizeText(a);

    b = normalizeText(b);



    // EXACT MATCH

    if (a === b) {

        return 100;

    }



    if (!a || !b) {

        return 0;

    }



    const matrix = [];



    for (
        let i = 0;
        i <= b.length;
        i++
    ) {

        matrix[i] = [i];

    }



    for (
        let j = 0;
        j <= a.length;
        j++
    ) {

        matrix[0][j] = j;

    }



    for (
        let i = 1;
        i <= b.length;
        i++
    ) {

        for (
            let j = 1;
            j <= a.length;
            j++
        ) {

            if (
                b.charAt(i - 1) ===
                a.charAt(j - 1)
            ) {

                matrix[i][j] =
                    matrix[i - 1][j - 1];

            }

            else {

                matrix[i][j] =
                    Math.min(

                        matrix[i - 1][j - 1] + 1,

                        matrix[i][j - 1] + 1,

                        matrix[i - 1][j] + 1

                    );

            }

        }

    }



    const distance =
        matrix[b.length][a.length];


    const maxLength =
        Math.max(
            a.length,
            b.length
        );


    return (
        (1 - distance / maxLength) * 100
    );

}



// =====================================================
// CHECK ANSWER
// =====================================================

function checkAnswer() {

    if (answerGiven) {

        return;

    }


    const input =
        document.getElementById(
            "answerInput"
        );


    const userAnswer =
        input.value.trim();



    // EMPTY ANSWER

    if (!userAnswer) {

        document.getElementById(
            "status"
        ).textContent =
            "⚠️ Please enter the movie name!";

        return;

    }



    answerGiven = true;

    clearInterval(timer);



    input.disabled = true;


    document.getElementById(
        "checkButton"
    ).disabled = true;



    const correctAnswer =
        questions[currentQuestion].answer;



    const similarity =
        getSimilarity(
            userAnswer,
            correctAnswer
        );



    console.log(
        "User Answer:",
        userAnswer
    );


    console.log(
        "Correct Answer:",
        correctAnswer
    );


    console.log(
        "Similarity:",
        similarity.toFixed(2) + "%"
    );



    // ==========================================
    // 60% OR MORE = CORRECT
    // ==========================================

    if (similarity >= 60) {

        score++;


        showCorrect(
            correctAnswer,
            similarity
        );

    }

    else {

        showWrong(
            correctAnswer,
            similarity
        );

    }

}



// =====================================================
// CORRECT RESULT
// =====================================================

function showCorrect(
    correctAnswer,
    similarity
) {

    const randomMessage =
        correctMessages[
            Math.floor(
                Math.random() *
                correctMessages.length
            )
        ];



    document.getElementById(
        "resultEmoji"
    ).textContent =
        "🎉";



    document.getElementById(
        "resultMessage"
    ).textContent =
        randomMessage;



    document.getElementById(
        "resultMovie"
    ).textContent =
        `✅ Correct! 🎬 Movie: ${correctAnswer}`;



    document.getElementById(
        "resultStars"
    ).textContent =
        "⭐ ⭐ ⭐";



    document.getElementById(
        "resultPage"
    ).classList.remove("hidden");

}



// =====================================================
// WRONG RESULT
// =====================================================

function showWrong(
    correctAnswer,
    similarity
) {

    document.getElementById(
        "resultEmoji"
    ).textContent =
        "😂";



    document.getElementById(
        "resultMessage"
    ).textContent =
        "UR IDIOT! 😂";



    document.getElementById(
        "resultMovie"
    ).textContent =
        `❌ Wrong! Correct Movie: ${correctAnswer}`;



    document.getElementById(
        "resultStars"
    ).textContent =
        "❌";



    document.getElementById(
        "resultPage"
    ).classList.remove("hidden");

}



// =====================================================
// TIME UP RESULT
// =====================================================

function showTimeUp(correctAnswer) {

    document.getElementById(
        "resultEmoji"
    ).textContent =
        "⏰😂";



    document.getElementById(
        "resultMessage"
    ).textContent =
        "TIME UP! 😂";



    document.getElementById(
        "resultMovie"
    ).textContent =
        `🎬 Correct Movie: ${correctAnswer}`;



    document.getElementById(
        "resultStars"
    ).textContent =
        "❌";



    document.getElementById(
        "resultPage"
    ).classList.remove("hidden");

}



// =====================================================
// NEXT QUESTION
// =====================================================

function nextQuestion() {

    document
        .getElementById("resultPage")
        .classList.add("hidden");


    currentQuestion++;



    if (
        currentQuestion >=
        questions.length
    ) {

        finishGame();

        return;

    }



    loadQuestion();

}



// =====================================================
// FINISH GAME
// =====================================================

function finishGame() {

    clearInterval(timer);


    document
        .getElementById("gamePage")
        .classList.add("hidden");


    document
        .getElementById("finalPage")
        .classList.remove("hidden");


    document.getElementById(
        "finalScore"
    ).textContent =
        `⭐ Score: ${score}/${questions.length}`;

}



// =====================================================
// RESTART GAME
// =====================================================

function restartGame() {

    currentQuestion = 0;

    score = 0;


    document
        .getElementById("finalPage")
        .classList.add("hidden");


    document
        .getElementById("gamePage")
        .classList.remove("hidden");


    loadQuestion();

}



// =====================================================
// ENTER KEY
// =====================================================

document
    .getElementById("answerInput")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                checkAnswer();

            }

        }
    );