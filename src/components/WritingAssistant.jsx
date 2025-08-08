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


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Add dark mode classes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Generating... Please Wait' : 'Generated.'}
          </button>
        </div>
        {/* Add dark mode classes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Generated Text</h2>
          {/* Add dark mode classes for prose */}
          <div className="prose dark:prose-invert max-w-none">
            {generatedText || "Your generated text will appear here."}
          </div>
        </div>
      </div>

      {/* History Section */}
      {/* Add dark mode classes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">History</h3>
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