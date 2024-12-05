import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import RepoListPage from './pages/RepoListPage';
import PageNotFound from './pages/PageNotFound';
import ServerNotFound from './pages/ServerNotFound';
import LoginPage from './pages/LoginPage';
import PromptPage from './pages/PromptPage';
import ModernFolderSelector from './features/repo/new';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RepoListPage />} />
          <Route path='/repo/:id' element={<PromptPage />} />
        
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/server-error" element={<ServerNotFound />} />
          
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </div>
    </Router>
  );
  // <ModernFolderSelector />)
}



export default App;
