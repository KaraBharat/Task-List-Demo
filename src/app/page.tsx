// External library imports
import Link from "next/link";

// Internal component imports
import { Button } from "@/components/ui/button";

/**
 * Home Page Component
 * Serves as the landing page of the application
 * @returns {JSX.Element} The rendered Home component
 */
export default function Home(): JSX.Element {
  return (
    // Main container with full screen height and centered content
    <main
      className="flex h-screen flex-col items-center justify-center gap-8"
      role="main"
    >
      {/* Navigation link to tasks page */}
      <Link
        className="text-stone-500 transition-colors hover:text-stone-700"
        href="/tasks"
        aria-label="Navigate to tasks page"
      >
        <Button>Go To Tasks</Button>
      </Link>

      <Link
        className="text-stone-500 transition-colors hover:text-stone-700"
        href="/tasks-infinite"
        aria-label="Navigate to tasks infinite list page"
      >
        <Button>Go To Tasks (Infinite List)</Button>
      </Link>
    </main>
  );
}
