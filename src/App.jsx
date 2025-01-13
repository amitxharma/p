import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import PasteViewer from './PasteViewer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the main page */}
        <Route path="/" element={<Home />} />

        {/* Route for viewing content by short URL */}
        <Route path="/:shortUrl" element={<PasteViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
