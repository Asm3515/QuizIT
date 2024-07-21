import React, { useState } from 'react';
import axios from 'axios';

export function Quiz() {
    const [file, setFile] = useState(null);
    const [numQuestions, setNumQuestions] = useState(10);
    const [quiz, setQuiz] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [result, setResult] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmitFile = async () => {
        if (!file) {
            alert("Please upload a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('numQuestions', numQuestions);

        try {
            const response = await axios.post('http://localhost:3000/generate-quiz', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Custom parsing function
            const parsedQuiz = parseQuiz(response.data.quiz);
            setQuiz(parsedQuiz);
        } catch (error) {
            console.error('Error generating quiz:', error);
        }
    };

    const parseQuiz = (quizData) => {
        // Example parsing function
        const quizText = quizData.replace(/(?:\r\n|\r|\n)/g, ' ').replace(/[\{\}]+/g, '').trim();
        const regex = /Question: (.*?)(?=Question:|$)/g;
        const questions = [];
        let match;

        while ((match = regex.exec(quizText)) !== null) {
            const [fullMatch, question] = match;
            const optionsMatch = fullMatch.match(/option_[A-D]: (.*?)(?=option_[A-D]:|$)/g) || [];
            const options = optionsMatch.reduce((acc, option, index) => {
                acc[`option_${String.fromCharCode(65 + index)}`] = option.split(': ')[1];
                return acc;
            }, {});
            const correctAnswer = fullMatch.match(/Correct_Answer: (option_[A-D])/)[1];

            questions.push({
                Question: question,
                ...options,
                Correct_Answer: correctAnswer
            });
        }

        return questions;
    };

    const handleAnswerChange = (questionIndex, option) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionIndex]: option
        }));
    };

    const handleSubmitQuiz = () => {
        // Logic to submit answers if needed
        setResult("Your answers have been submitted. (This is a placeholder result.)");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold mb-6">Quiz Generator</h1>

            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Upload PDF</h2>
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="file-input file-input-bordered file-input-primary w-full mb-4" 
                />
                <input
                    type="number"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    min="1"
                    placeholder="Number of Questions"
                    className="input input-bordered w-full mb-4"
                />
                <button 
                    onClick={handleSubmitFile} 
                    className="btn btn-primary w-full"
                >
                    Generate Quiz
                </button>
            </div>

            {quiz.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-6">
                    <h2 className="text-xl font-semibold mb-4">Generated Quiz</h2>
                    {quiz.map((q, index) => (
                        <div key={index} className="mb-4">
                            <p className="font-medium mb-2">{q.Question}</p>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name={`question_${index}`}
                                        value="A"
                                        onChange={() => handleAnswerChange(index, 'A')}
                                        className="radio radio-primary"
                                    />
                                    <span className="ml-2">{q.option_A}</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name={`question_${index}`}
                                        value="B"
                                        onChange={() => handleAnswerChange(index, 'B')}
                                        className="radio radio-primary"
                                    />
                                    <span className="ml-2">{q.option_B}</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name={`question_${index}`}
                                        value="C"
                                        onChange={() => handleAnswerChange(index, 'C')}
                                        className="radio radio-primary"
                                    />
                                    <span className="ml-2">{q.option_C}</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name={`question_${index}`}
                                        value="D"
                                        onChange={() => handleAnswerChange(index, 'D')}
                                        className="radio radio-primary"
                                    />
                                    <span className="ml-2">{q.option_D}</span>
                                </label>
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={handleSubmitQuiz} 
                        className="btn btn-primary w-full mt-4"
                    >
                        Submit Answers
                    </button>
                </div>
            )}

            {result && (
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-6">
                    <h2 className="text-xl font-semibold mb-4">Result</h2>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
}
