import Dashboard from './components/Dashboard';

// Main App component serves as the root of the application's UI.
function App() {
  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <header className="bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 8l1.414-1.414M14.586 14.586L16 16m-7.029-7.029L10.414 6M16 8l-1.414-1.414M6 16l1.414 1.414M12 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            AlgoMentor AI
          </h1>
          <p className="text-sm text-gray-400">Your Educational Trading Co-pilot</p>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        <Dashboard />
      </main>
      <footer className="text-center p-4 text-gray-600 text-xs">
        <p>AlgoMentor AI © 2024. All data is simulated for educational purposes only.</p>
      </footer>
    </div>
  );
}

export default App;
