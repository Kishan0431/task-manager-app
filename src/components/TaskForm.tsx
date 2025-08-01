import { useState, useEffect } from "react";
import type { Task } from "../features/tasks/taskSlice";

type Props = {
  onSubmit: (task: Omit<Task, "id">) => void;
  initialData?: Task;
  username: string;
};

export const TaskForm = ({ onSubmit, initialData, username }: Props) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [status, setStatus] = useState<"pending" | "completed">(
    initialData?.status || "pending"
  );

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, status, username }); // 🔑 Include username here
    setTitle("");
    setDescription("");
    setStatus("pending");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title..."
        className="w-full px-3 py-2 rounded-lg bg-gradient-to-br from-white via-[#fef9f4] to-white border border-orange-200 text-gray-800 placeholder:text-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300 transition-all duration-300 hover:shadow-md"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter task description..."
        className="w-full px-3 py-2 rounded-lg bg-gradient-to-br from-white via-[#fef9f4] to-white border border-orange-200 text-gray-800 placeholder:text-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300 transition-all duration-300 hover:shadow-md resize-none"
        required
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as "pending" | "completed")}
        className="w-full px-3 py-2 rounded-lg bg-gradient-to-br from-white via-[#fef9f4] to-white border border-orange-200 text-gray-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300 transition-all duration-300 hover:shadow-md"
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <button
        type="submit"
        className="relative animate-text-glow flex items-center gap-1 text-sm text-white bg-red-500 px-3 py-1.5 cursor-pointer rounded overflow-hidden shadow-md hover:shadow-red-500/50 hover:scale-105 transition-transform duration-300 group"
      >
        {initialData ? "Update Task" : "Add Task"}
        {/* Shimmer Line */}
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-full transition-transform duration-700 ease-in-out rotate-[25deg]" />
        {/* Glow Border Pulse */}
        <span className="absolute inset-0 rounded border border-transparent group-hover:border-white/30 group-hover:animate-pulse pointer-events-none" />
      </button>
    </form>
  );
};
