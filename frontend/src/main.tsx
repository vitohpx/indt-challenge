import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.render(
    <Router>
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </Router>,
    rootElement
  );
} else {
  console.error("Element with ID 'root' not found");
}
