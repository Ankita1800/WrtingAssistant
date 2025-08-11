// src/components/WritingAssistant.jsx
'use client';

import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const WritingAssistant = () => {
  // State for user inputs
  const [prompt, setPrompt] = useState('');
  const [writingLevel, setWritingLevel] = useState('Medium');
  const [wordCount, setWordCount] = useState(150);

  // State for application logic
  const [generatedText, setGeneratedText] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load history from local storage on initial component mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('ai-writing-history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
    }
  }, []);

  // Clean up speech synthesis when the component is unmounted
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // --- API and Feature Handlers ---

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedText('');

    // Ensure speech is stopped before generating new text
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const fullPrompt = `Generate a text of approximately ${wordCount} words with a ${writingLevel} writing level about: "${prompt}"`;

    try {
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = await response.text();
      setGeneratedText(text);

      const newHistoryEntry = { prompt, writingLevel, wordCount, generatedText: text, id: Date.now() };
      const updatedHistory = [newHistoryEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('ai-writing-history', JSON.stringify(updatedHistory));
    } catch (error)
    {
      console.error("Error generating text:", error);
      setGeneratedText("An error occurred while generating text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ai-writing-history');
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!generatedText) return;

    const utterance = new SpeechSynthesisUtterance(generatedText);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };


  // --- JSX for Rendering ---

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
      {/* Main Content Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Your Prompt</h2>
          <textarea
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            rows="5"
            placeholder="Enter your writing prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Writing Level</label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                value={writingLevel}
                onChange={(e) => setWritingLevel(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Word Count</label>
              <input
                type="number"
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                min="50"
                max="500"
              />
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>

        {/* Generated Text Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Generated Text</h2>
            <button
              onClick={handleSpeak}
              disabled={!generatedText && !isSpeaking}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
            >
              {isSpeaking ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.858l4.707-4.707a1 1 0 011.414 0V19.707a1 1 0 01-1.414 0L5.858 15z" /></svg>
              )}
            </button>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            {generatedText || "Your generated text will appear here."}
          </div>
        </div>
      </div>

      {/* History Column */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">History</h3>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              title="Clear all history"
            >
              Clear All
            </button>
          )}
        </div>
        <ul className="space-y-4">
          {history.length > 0 ? (
            history.map((item) => (
              <li key={item.id} className="border-b dark:border-gray-700 pb-2">
                <p className="font-semibold truncate text-gray-800 dark:text-gray-200">{item.prompt}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.writingLevel} | {item.wordCount} words</p>
              </li>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No search history yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};
export default WritingAssistant;