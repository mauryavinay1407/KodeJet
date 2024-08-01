import React, { useState, useEffect } from 'react';
import './App.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneLight, duotoneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCopy, FaSun, FaMoon, FaPlay } from 'react-icons/fa';
import axios from "axios";
import toast from 'react-hot-toast';

const App: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [status,setStatus]=useState('');
  const [jobId,setJobId]=useState('');
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

  const handleCompile = async () => {
    try {
      setOutput('');
      setStatus('');
      setJobId('');
      const response: any = await axios.post(`/api/run`, { language, code });

      setJobId(response.data.jobId);
      let intervalId: any;

      intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(`/api/status?id=${response.data.jobId}`);

       const { success, job, error } = dataRes;
                
        if (success) {
          const { status: jobStatus, output: jobOutput } = job;
          setStatus(jobStatus);
          if (jobStatus === "pending") return;
          setOutput(jobOutput);
          clearInterval(intervalId);
        } else { 
          setStatus("Error: Retry!");
          console.error(error);
          clearInterval(intervalId);
          setOutput(error);
        }

      }, 1000);
    } catch (err: any) {
      let { response } = err;
      if (response)
        setOutput(response.data.error.stderr)
      else
        setOutput("Error connecting to server")
      console.log(err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      toast.success('copied');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-8">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <header className="text-4xl font-bold text-gray-900 dark:text-gray-100 font-fira-code">
          KodeJet
        </header>
        <div className="flex items-center">
          <label htmlFor="language" className="text-lg font-medium mr-4 text-gray-900 dark:text-gray-100">
            Select Language:
          </label>
          <select
            id="language"
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="cpp">C++</option>
            <option value="py">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="c">C</option>
          </select>
          <button
            className="ml-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
        </div>
      </div>
      <main className="w-full max-w-4xl flex flex-col items-center">
        <textarea
          className="w-full h-64 p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-fira-code"
          placeholder="Write your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          className="px-4 py-2 flex justify-center items-center bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleCompile}
        >
          Compile & Run   <span className='m-2'><FaPlay/> </span>
        </button>
        <div className="w-full mt-8 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md relative">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Output</h2>
          <button
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={handleCopy}
          >
            <FaCopy size={24} />
          </button>
            <p>
          <SyntaxHighlighter language={language} style={darkMode ? duotoneDark : duotoneLight} >
            {jobId && `JobID: ${jobId}`}
          </SyntaxHighlighter>
            </p>
            <p>
          <SyntaxHighlighter language={language} style={darkMode ? duotoneDark : duotoneLight} >
            {status}
          </SyntaxHighlighter>
            </p>
            <p>
          <SyntaxHighlighter language={language} style={darkMode ? duotoneDark : duotoneLight} >
            {output}
          </SyntaxHighlighter>
            </p>

        </div>
      </main>
    </div>
  );
};

export default App;

