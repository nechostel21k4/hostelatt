/**
 * Suppress specific Recharts warnings that clutter the console
 * during rapid dashboard updates.
 */
export const setupLoggers = () => {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && /width\(-1\) and height\(-1\) of chart should be greater than 0/.test(args[0])) {
      return;
    }
    originalError(...args);
  };

  console.warn = (...args: any[]) => {
    if (typeof args[0] === 'string' && /width\(-1\) and height\(-1\) of chart should be greater than 0/.test(args[0])) {
      return;
    }
    originalWarn(...args);
  };
};
