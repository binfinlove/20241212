// 模擬從Excel轉換來的題目數據
const quizData = [
    {
        question: "1 + 1 = ?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1  // 索引從0開始，1代表第二個選項
    },
    {
        question: "台灣的首都是？",
        options: ["台北", "台中", "高雄", "台南"],
        correctAnswer: 0
    },
    // 可以繼續添加更多題目...
];

// 生成題目HTML
function generateQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    
    quizData.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        
        let questionHTML = `
            <div class="question">${index + 1}. ${question.question}</div>
            <div class="options">
        `;
        
        question.options.forEach((option, optionIndex) => {
            questionHTML += `
                <div>
                    <input type="radio" name="question${index}" value="${optionIndex}" id="q${index}o${optionIndex}">
                    <label for="q${index}o${optionIndex}">${option}</label>
                </div>
            `;
        });
        
        questionHTML += '</div>';
        questionDiv.innerHTML = questionHTML;
        quizContainer.appendChild(questionDiv);
    });
}

// 計算分數
function calculateScore() {
    let correctCount = 0;
    
    quizData.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption && parseInt(selectedOption.value) === question.correctAnswer) {
            correctCount++;
        }
    });
    
    const score = (correctCount / quizData.length) * 100;
    const resultDiv = document.getElementById('result');
    
    if (score < 60) {
        resultDiv.innerHTML = `得分：${score}分<br>再加油！`;
    } else if (score > 90) {
        resultDiv.innerHTML = `得分：${score}分<br>太強了吧！`;
    } else {
        resultDiv.innerHTML = `得分：${score}分`;
    }
}

// 初始化測驗
window.onload = function() {
    generateQuiz();
    document.getElementById('submitBtn').addEventListener('click', calculateScore);
};