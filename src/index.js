import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import ThemeProvider from './context/ThemeProvider';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-json-view-lite/dist/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<HashRouter>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</HashRouter>
		,
	</React.StrictMode>,
);
