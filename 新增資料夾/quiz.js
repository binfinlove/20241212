let quizData = [];

async function loadExcelData() {
    try {
        const response = await fetch('questions.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 使用第一個工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 將 Excel 數據轉換為 JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // 處理並轉換數據格式
        quizData = jsonData.map(row => {
            if (row.type === 'multiple') {
                return {
                    type: 'multiple',
                    question: row.question,
                    options: [row.option1, row.option2, row.option3, row.option4],
                    correctAnswer: parseInt(row.correctAnswer) - 1
                };
            } else {
                return {
                    type: 'fill',
                    question: row.question,
                    correctAnswer: row.correctAnswer
                };
            }
        });
        
        // 載入完成後自動生成測驗
        generateQuiz();
    } catch (error) {
        console.error('載入題目失敗:', error);
        alert('載入題目失敗，請重新整理頁面或聯繫管理員');
    }
}

function generateQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    
    quizData.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        
        let questionHTML = `
            <div class="question">
                <span class="question-type">${question.type === 'multiple' ? '選擇題' : '填充題'}</span><br>
                第 ${index + 1} 題：${question.question}
            </div>
        `;
        
        if (question.type === 'multiple') {
            questionHTML += '<div class="options">';
            question.options.forEach((option, optionIndex) => {
                questionHTML += `
                    <div class="option-item">
                        <input type="radio" name="question${index}" value="${optionIndex}" id="q${index}o${optionIndex}">
                        <label for="q${index}o${optionIndex}">${option}</label>
                    </div>
                `;
            });
            questionHTML += '</div>';
        } else if (question.type === 'fill') {
            questionHTML += `
                <div class="fill-in-blank">
                    <input type="text" name="question${index}" placeholder="請在此輸入答案">
                </div>
            `;
        }
        
        questionDiv.innerHTML = questionHTML;
        quizContainer.appendChild(questionDiv);
    });
}

function calculateScore() {
    let correctCount = 0;
    let allAnswered = true;
    
    quizData.forEach((question, index) => {
        if (question.type === 'multiple') {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            if (!selectedOption) {
                allAnswered = false;
            } else if (parseInt(selectedOption.value) === question.correctAnswer) {
                correctCount++;
            }
        } else if (question.type === 'fill') {
            const answer = document.querySelector(`input[name="question${index}"]`).value.trim();
            if (!answer) {
                allAnswered = false;
            } else if (answer.toLowerCase() === question.correctAnswer.toLowerCase()) {
                correctCount++;
            }
        }
    });

    if (!allAnswered) {
        alert('請回答所有題���！');
        return;
    }
    
    const score = Math.round((correctCount / quizData.length) * 100);
    const resultDiv = document.getElementById('result');
    
    resultDiv.classList.remove('score-high', 'score-mid', 'score-low');
    
    if (score < 60) {
        resultDiv.innerHTML = `得分：${score}分<br>再加油！`;
        resultDiv.classList.add('score-low');
    } else if (score > 90) {
        resultDiv.innerHTML = `得分：${score}分<br>太強了吧！`;
        resultDiv.classList.add('score-high');
    } else {
        resultDiv.innerHTML = `得分：${score}分`;
        resultDiv.classList.add('score-mid');
    }

    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

window.onload = function() {
    loadExcelData();  // 頁面載入時自動讀取 Excel
    document.getElementById('submitBtn').addEventListener('click', calculateScore);
}; 