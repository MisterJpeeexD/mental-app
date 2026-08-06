import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Sin `globals: true` en vite.config.js, Testing Library no registra su
// limpieza automática y el DOM se acumula entre tests.
afterEach(cleanup);
