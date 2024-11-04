"use client";

// External dependencies
import React from "react";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import {
  User,
  Calendar,
  List,
  Clock,
  Hash,
  ChevronRight,
  X,
  ChevronLeft,
  ClockArrowUp,
  FileClock,
} from "lucide-react";

// Internal UI components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskType } from "./task-type";
import { TaskStatus } from "./task-status";
import { TaskPriority } from "./task-priority";
import { TaskCommentsView } from "./task-comments";
import TaskActions from "./task-actions";

// Utilities and hooks
import { cn } from "@/lib/utils";
import { useTask } from "../queries/task.queries";

/**
 * Dynamically import TipTap editor to avoid SSR issues
 */
const MinimalTiptapEditor = dynamic(
  () =>
    import("@/components/minimal-tiptap").then(
      (mod) => mod.MinimalTiptapEditor,
    ),
  { ssr: false },
);

/**
 * Interface definitions
 */
interface Props {
  taskId: string;
  detailPage?: boolean;
  onClose?: () => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  children?: React.ReactNode;
}

/**
 * Section Component
 * Renders a section with title and content
 */
const Section: React.FC<SectionProps> = ({
  title,
  icon,
  children,
  className,
}) => (
  <div
    className={cn("flex flex-col", className)}
    role="region"
    aria-label={title}
  >
    <h3 className="mb-3 flex items-center space-x-2 text-lg font-semibold text-stone-700">
      {React.cloneElement(icon as React.ReactElement, { "aria-hidden": true })}
      <span>{title}</span>
    </h3>
    {children}
  </div>
);

/**
 * DetailItem Component
 * Renders a detail field with icon, label, and value
 */
const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  label,
  value,
  children,
}) => (
  <div
    className="flex items-start space-x-3"
    role="group"
    aria-labelledby={`${label}-label`}
  >
    <div className="mt-1 flex-shrink-0" aria-hidden="true">
      {icon}
    </div>
    <div className="flex flex-col justify-center gap-2">
      <div id={`${label}-label`} className="text-sm font-medium text-stone-500">
        {label}
      </div>
      <div className="flex items-center space-x-2">
        {children}
        <div className="text-base text-stone-800">{value}</div>
      </div>
    </div>
  </div>
);

/**
 * TaskDetails Component
 * Main component for displaying detailed task information
 */
export const TaskDetails: React.FC<Props> = ({
  taskId,
  onClose,
  detailPage = false,
}) => {
  const { data: task, isLoading } = useTask(taskId);

  const handleDelete = () => {
    onClose?.();
  };

  if (isLoading) {
    return <TaskDetailsSkeleton />;
  }

  if (!task || task.isDeleted) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="p-4 text-center text-stone-500" role="alert">
          {detailPage ? "Task not found or deleted" : "No task selected"}
        </div>
      </div>
    );
  }

  return (
    <article
      className="relative w-full rounded-lg bg-white p-4"
      role="article"
      aria-label={`Task details for ${task.title}`}
    >
      {/* Header Actions */}
      <div className="absolute right-8 top-2 flex items-center gap-2">
        <TaskActions taskId={task.id} onDelete={handleDelete} />
        {onClose && (
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex items-center gap-2"
            aria-label="Close task details"
          >
            <X className="hidden h-4 w-4 md:block" aria-hidden="true" />
            <ChevronLeft
              className="block h-4 w-4 md:hidden"
              aria-hidden="true"
            />
            <span className="md:hidden">Back</span>
          </Button>
        )}
      </div>

      {/* Task Header */}
      <header className="flex flex-col items-start gap-2">
        <div className="flex items-center space-x-2 text-sm text-stone-500">
          <Hash className="h-4 w-4" aria-hidden="true" />
          <span>{task.key}</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <TaskType type={task.type || ""} />
        </div>
        <h2 className="text-2xl font-bold text-stone-800">{task.title}</h2>
        <div className="flex items-center gap-2">
          <TaskStatus status={task.status || ""} />
          <TaskPriority priority={task.priority || ""} />
        </div>
      </header>

      {/* Main Content */}
      <div className="h-[calc(100vh-10rem)] overflow-y-auto">
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-4">
          {/* Description Section */}
          <div className="flex w-full flex-col gap-2">
            <Section
              className="min-h-80"
              title="Description"
              icon={<List className="h-5 w-5" />}
            >
              <MinimalTiptapEditor
                key={task.description}
                value={task.description}
                onChange={() => {}}
                className="w-full"
                output="html"
                placeholder="Item description"
                editorClassName="focus:outline-none"
                editable={false}
                hideToolbar={true}
                bordered={false}
                editorContentClassName="p-0"
                aria-label="Task description"
              />
            </Section>
          </div>

          {/* Details Section */}
          <div className="w-full space-y-6 md:w-2/5">
            {/* Assignee */}
            <DetailItem
              icon={<User className="h-5 w-5 text-blue-500" />}
              label="Assignee"
              value={task.assigneeName || "Unassigned"}
            >
              <Avatar className="size-6">
                <AvatarImage
                  src={task.assigneeAvatarUrl || ""}
                  alt={`${task.assigneeName || "Unassigned"}'s avatar`}
                  className="size-6 object-cover"
                />
                <AvatarFallback>
                  {task.assigneeName?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
            </DetailItem>

            {/* Reporter */}
            <DetailItem
              icon={<User className="h-5 w-5 text-gray-400" />}
              label="Reporter"
              value={task.reporterName || "Unassigned"}
            >
              <Avatar className="size-6">
                <AvatarImage
                  src={task.reporterAvatarUrl || ""}
                  alt={`${task.reporterName || "Unassigned"}'s avatar`}
                  className="size-6 object-cover"
                />
                <AvatarFallback>
                  {task.reporterName?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
            </DetailItem>

            {/* Other Details */}
            <DetailItem
              icon={<Calendar className="h-5 w-5 text-green-500" />}
              label="Due Date"
              value={
                task.dueDate
                  ? format(new Date(task.dueDate), "MMM d, yyyy")
                  : "No due date"
              }
            />
            <DetailItem
              icon={<Clock className="h-5 w-5 text-yellow-500" />}
              label="Created"
              value={format(new Date(task.createdAt), "MMM d, yyyy")}
            />
            <DetailItem
              icon={<Hash className="h-5 w-5 text-sky-500" />}
              label="Story Points"
              value={task.storyPoints?.toString() || "0"}
            />
            <DetailItem
              icon={<ClockArrowUp className="h-5 w-5 text-yellow-500" />}
              label="Time Estimated"
              value={`${task.timeEstimate?.toString() || "0"} hrs`}
            />
            <DetailItem
              icon={<FileClock className="h-5 w-5 text-red-500" />}
              label="Time Spent"
              value={`${task.timeSpent?.toString() || "0"} hrs`}
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <TaskCommentsView taskId={task.id} />
        </div>
      </div>
    </article>
  );
};

export const TaskDetailsSkeleton = () => (
  <div className="relative w-full rounded-lg bg-white p-4">
    <div className="flex flex-col items-start gap-2">
      {/* Header */}
      <div className="flex items-center space-x-2 text-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Title */}
      <Skeleton className="h-8 w-3/4" />

      {/* Status and Priority */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>

    <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-4">
      {/* Description Section */}
      <div className="flex w-full flex-col gap-12">
        <div className="min-h-80">
          <div className="mb-3 flex items-center space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      </div>

      {/* Details Section */}
      <div className="w-full space-y-6 md:w-2/5">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="h-5 w-5" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Comments Section */}
    <div className="mt-6">
      <Skeleton className="h-40 w-full" />
    </div>
  </div>
);
