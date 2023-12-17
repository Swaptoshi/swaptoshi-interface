import React from 'react';
import useLocalStorage from 'use-local-storage';

const ThemeContext = React.createContext();

export function useTheme() {
	return React.useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
	const [theme, setTheme] = useLocalStorage('theme', 'system');

	const context = React.useMemo(() => [theme, setTheme], [setTheme, theme]);

	return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>;
}
