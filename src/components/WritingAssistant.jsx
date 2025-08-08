// src/components/WritingAssistant.jsx
'use client';

// ... (keep the existing import and state logic)
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const WritingAssistant = () => {
  // ... (all your existing useState and useEffect hooks should remain here)
  const [prompt, setPrompt] = useState('');
  const [writingLevel, setWritingLevel] = useState('Medium');
  const [wordCount, setWordCount] = useState(150);
  const [generatedText, setGeneratedText] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedHistory = localStorage.getItem('ai-writing-history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleGenerate = async () => {
    // ... (keep the existing handleGenerate function)
    setIsLoading(true);
    setGeneratedText('');
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
    } catch (error) {
      console.error("Error generating text:", error);
      setGeneratedText("An error occurred while generating text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistoryItem = (itemId) => {
    const updatedHistory = history.filter(item => item.id !== itemId);
    setHistory(updatedHistory);
    localStorage.setItem('ai-writing-history', JSON.stringify(updatedHistory));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('ai-writing-history');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add dark mode classes */}
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Your Prompt</h2>
            <textarea
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
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
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-md disabled:from-blue-300 disabled:to-indigo-300 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Generating... Please Wait' : 'Generated'}
            </button>
          </div>
          {/* Add dark mode classes */}
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Generated Text</h2>
            {/* Add dark mode classes for prose */}
            <div className="prose dark:prose-invert max-w-none">
              {generatedText || "Your generated text will appear here."}
            </div>
          </div>
        </div>

        {/* History Section */}
        {/* Add dark mode classes */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">History</h3>
            {history.length > 0 && (
              <button
                onClick={handleClearAllHistory}
                className="text-sm bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-3 py-1 rounded-md transition-all duration-200"
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
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold truncate text-gray-800 dark:text-gray-200">{item.prompt}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.writingLevel} | {item.wordCount} words</p>
                    </div>
                    <button
                      onClick={() => handleDeleteHistoryItem(item.id)}
                      className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete this item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No search history yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};


export default WritingAssistant;