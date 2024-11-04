// External dependencies
import React from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { User, Send, Trash2 } from "lucide-react";

// Internal UI components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Queries and stores
import {
  NewTaskComment,
  TaskComment,
  useCreateTaskComment,
  useDeleteTaskComment,
  useTaskComments,
} from "../queries/comment.queries";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Interface definitions
 */
interface TaskCommentsProps {
  taskId: string;
}

interface CommentFormData {
  content: string;
}

/**
 * CommentForm Component
 * Renders the form for adding new comments
 */
const CommentForm: React.FC<{
  onSubmit: (data: CommentFormData) => Promise<void>;
  isPending: boolean;
}> = ({ onSubmit, isPending }) => {
  const form = useForm<CommentFormData>({
    defaultValues: { content: "" },
  });

  const handleSubmit = (data: CommentFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-2"
      aria-label="Add comment form"
    >
      <textarea
        {...form.register("content", { required: true })}
        rows={3}
        className="flex-grow resize-none rounded-lg border px-3 py-2 text-gray-700 focus:border-stone-500 focus:outline-none"
        placeholder="Add a comment..."
        aria-label="Comment content"
        aria-required="true"
        aria-invalid={!!form.formState.errors.content}
      />
      <Button
        type="submit"
        variant="outline"
        className="flex max-w-fit items-center gap-2"
        disabled={isPending || !form.formState.isValid}
        aria-label={isPending ? "Sending comment..." : "Send comment"}
      >
        <Send className="h-5 w-5" aria-hidden="true" />
        {isPending ? "Sending..." : "Send"}
      </Button>
    </form>
  );
};

/**
 * CommentItem Component
 * Renders an individual comment
 */
const CommentItem: React.FC<{
  comment: TaskComment;
}> = ({ comment }) => {
  const { mutateAsync: deleteComment, isPending } = useDeleteTaskComment();

  const handleDelete = () => {
    deleteComment({ id: comment.id, taskId: comment.taskId });
  };

  return (
    <article
      className="p-4 transition duration-150 ease-in-out hover:bg-gray-50"
      aria-label={`Comment by ${comment.authorName}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Avatar className="size-6 mt-2">
            <AvatarImage
              src={comment.authorAvatarUrl ?? ""}
              className="size-6 object-cover"
              alt={`${comment.authorName}'s avatar`}
            />
            <AvatarFallback
              aria-label={`${comment.authorName}'s avatar fallback`}
            >
              <User
                className="size-6 rounded-full bg-gray-100 p-1 text-gray-400"
                aria-hidden="true"
              />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              {comment.authorName}
            </h3>
            <div className="flex items-center gap-2">
              <time
                dateTime={new Date(comment.createdAt).toISOString()}
                className="text-sm text-gray-500"
                aria-label={`Posted on ${format(
                  new Date(comment.createdAt),
                  "MMMM d, yyyy 'at' h:mm a",
                )}`}
              >
                {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </time>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="size-3" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
        </div>
      </div>
    </article>
  );
};

/**
 * TaskCommentsView Component
 * Main component for displaying and managing task comments
 *
 * @component
 * @param {TaskCommentsProps} props - Component props
 */
export const TaskCommentsView: React.FC<TaskCommentsProps> = ({ taskId }) => {
  const { data: comments, isLoading } = useTaskComments(taskId);
  const { userProfile } = useAuthStore();
  const { mutateAsync: createComment, isPending } = useCreateTaskComment();

  const handleSubmit = async (data: CommentFormData) => {
    if (!userProfile) return;

    const newComment: NewTaskComment = {
      taskId,
      content: data.content,
      userId: userProfile.id,
    };

    createComment(newComment);
  };

  if (isLoading) {
    return (
      <Skeleton
        className="h-40 w-full"
        role="progressbar"
        aria-label="Loading comments"
      />
    );
  }

  return (
    <section className="overflow-hidden" aria-label="Task comments section">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <CommentForm onSubmit={handleSubmit} isPending={isPending} />
      </div>
      <div
        className="divide-y divide-gray-200"
        role="log"
        aria-label="Comments list"
      >
        {comments
          ?.filter((comment) => !comment.isDeleted)
          .map((comment) => <CommentItem key={comment.id} comment={comment} />)}
      </div>
    </section>
  );
};

export default TaskCommentsView;
