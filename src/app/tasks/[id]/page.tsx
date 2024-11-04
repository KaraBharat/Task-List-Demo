// Types
type Params = Promise<{ id: string }>;

// Internal components
import { TaskDetails } from "@/features/tasks/components/task-details";

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
}

/**
 * Task Details Page Component
 * Displays detailed information for a specific task
 *
 * @param {TaskPageProps} props - Component props containing task ID
 */
export default async function TaskPage({ params }: { params: Params }) {
  const { id } = await params;

  // Handle missing task ID
  if (!id) {
    return (
      <div
        role="alert"
        className="flex items-center justify-center p-4 text-red-600"
      >
        No task id provided
      </div>
    );
  }

  return (
    <main
      role="main"
      aria-label={`Task details for task ${id}`}
      className="flex h-full w-full items-center justify-center p-4 md:p-8"
    >
      {/* Content container with responsive max-width */}
      <div
        className="flex h-full w-full items-center justify-center md:max-w-7xl"
        role="region"
        aria-label="Task details content"
      >
        <TaskDetails taskId={id} detailPage={true} />
      </div>
    </main>
  );
}
