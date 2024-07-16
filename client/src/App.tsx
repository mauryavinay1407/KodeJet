import React, { useState, useEffect } from 'react';
import './App.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneLight, duotoneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from "axios"

const App: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleCompile =async() => {
    // Placeholder for compile functionality
    try {
     const response:any= await axios.post(`http://localhost:3000/run`,
        {
          language,
          code
        }
      )
      console.log(response);
      setOutput(response.data.jobId);
    } catch (err:any) {
      let {response}=err;
      if(response)
      setOutput(response.data.error.stderr)
    else
    setOutput("Error connecting to server")
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-8">
      <header className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        KodeJet
      </header>
      <main className="w-full max-w-4xl flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <label htmlFor="language" className="text-lg font-medium mr-4 text-gray-900 dark:text-gray-100">
            Select Language:
          </label>
          <select
            id="language"
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="py">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
          <button
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <textarea
          className="w-full h-64 p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-fira-code"
          placeholder="Write your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleCompile}
        >
          Compile & Run
        </button>
        <div className="w-full mt-8 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Output</h2>
          <SyntaxHighlighter language={language} style={darkMode ? duotoneDark : duotoneLight}>
            {output}
          </SyntaxHighlighter>
        </div>
      </main>
    </div>
  );
};

export default App;
