// DesktopContext.js
// Shared React context so any content component can trigger window opens
// without prop-drilling through Window → content.
import { createContext, useContext } from 'react';

export const DesktopContext = createContext({
  openWindow: () => {},
  closeWindow: () => {},
  minimizeWindow: () => {},
});

export function useDesktop() {
  return useContext(DesktopContext);
}
