import * as React from 'react';
import { createRoot } from 'react-dom/client';
import UTIF from 'utif';
import { Athena } from './athena';
import './styles.css';

// The ported logic uses window.UTIF (for decoding TIFF logos) and window.React
// (the design's icon factory calls React.createElement off the global).
(window as any).UTIF = UTIF;
(window as any).React = React;

// Design-time props from the original component's data-props defaults.
const props = { accentColor: '#3fb950', density: 'compact', showThumbnails: true };

createRoot(document.getElementById('root')!).render(<Athena {...props} />);
