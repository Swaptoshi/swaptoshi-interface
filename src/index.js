import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-json-view-lite/dist/index.css';
import './theme';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

import ThemeProvider from './context/ThemeProvider';
import ScrollToTop from './utils/route/scrollToTop';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<HashRouter>
			<ScrollToTop />
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</HashRouter>
	</React.StrictMode>,
);
