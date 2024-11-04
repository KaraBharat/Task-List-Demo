// Types
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// External imports
import { Inter } from 'next/font/google';

// Styles
import './globals.css';

// Internal components
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';

// Providers
import { QueryProviders } from '@/providers/query.provider';
import { SheetProvider } from '@/providers/sheet.provider';

// Font configuration
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Optimize font loading
});

/**
 * Metadata configuration for the application
 */
export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Task Manager - Manage your tasks efficiently',
  viewport: 'width=device-width, initial-scale=1',
};

/**
 * Root Layout Component
 * Provides the base structure and providers for the entire application
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} The root layout structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html 
      lang="en"
      className="h-full"
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
      </head>
      <QueryProviders>
        <TooltipProvider>
          <body 
            className={`${inter.className} antialiased min-h-full`}
            // Improve accessibility for screen readers
            aria-hidden="false"
          >
            {/* Main content area */}
            <main id="main-content">
              {children}
            </main>
            
            {/* Global UI components */}
            <SheetProvider />
            <Toaster />
          </body>
        </TooltipProvider>
      </QueryProviders>
    </html>
  );
}