// External library imports
import Link from 'next/link';

// Internal component imports
import { Button } from '@/components/ui/button';

/**
 * Home Page Component
 * Serves as the landing page of the application
 * @returns {JSX.Element} The rendered Home component
 */
export default function Home(): JSX.Element {
  return (
    // Main container with full screen height and centered content
    <main 
      className="flex h-screen flex-col items-center justify-center"
      role="main"
    >
      {/* Navigation link to tasks page */}
      <Link 
        className="text-stone-500 hover:text-stone-700 transition-colors"
        href="/tasks"
        aria-label="Navigate to tasks page"
      >
        <Button>Go To Tasks</Button>
      </Link>
    </main>
  );
}