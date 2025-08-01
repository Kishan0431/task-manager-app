import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { logout } from "../features/auth/authSlice";
import {
  fetchTasks,
  addTask,
  deleteTask,
  updateTask,
} from "../features/tasks/taskSlice";
import type { Task } from "../features/tasks/taskSlice";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle, FaTrash, FaEdit } from "react-icons/fa";
import { TaskForm } from "../components/TaskForm";
import { FiEdit3 } from "react-icons/fi";

export const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const [editTaskData, setEditTaskData] = useState<Task | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleAddTask = (task: Omit<Task, "id">) => {
    if (user?.username) {
      dispatch(addTask({ ...task, username: user.username }));
    }
  };

  const handleUpdateTask = (task: Omit<Task, "id">) => {
    if (editTaskData && user?.username) {
      dispatch(
        updateTask({ ...task, id: editTaskData.id, username: user.username })
      );
      setEditTaskData(null);
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTask(id));
  };

  useEffect(() => {
    if (user?.username) {
      dispatch(fetchTasks(user.username));
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen bg-gradient-to-t from-orange-50 via-yellow-50 to-rose-100 p-6">
      {/* Header */}
      <header className="sticky top-2 z-50 bg-white/50 backdrop-blur-xl shadow-sm flex justify-between items-center mb-6 px-6 py-4 rounded-2xl border border-orange-100">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-4xl text-orange-500" />
          <div className="leading-tight">
            <h1 className="text-xl font-semibold text-black">
              Hello,{" "}
              <span className="text-orange-600">
                {user?.username || "Guest"}
              </span>
            </h1>
            <p className="text-sm text-gray-600">
              Wishing you a productive day!
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-black hover:bg-gray-800 p-3 rounded-full transition-colors duration-200 cursor-pointer"
          title="Logout"
        >
          <FaSignOutAlt className="text-white text-xl" />
        </button>
      </header>

      {/* Task Form */}
      <div className="mb-8 p-1">
        <TaskForm
          onSubmit={(taskData) => {
            if (editTaskData) {
              handleUpdateTask(taskData);
            } else {
              handleAddTask(taskData);
            }
          }}
          initialData={editTaskData || undefined}
          username={user?.username || ""}
        />
      </div>

      {/* Task Cards */}
      <section className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center sm:text-left flex items-center gap-2">
          <FiEdit3 className="text-orange-500 text-2xl" />
          Here’s What You’re Working On
        </h2>

        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-600 text-center">
            No tasks found. Add a new one!
          </p>
        ) : (
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(tasks) &&
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gradient-to-br from-[#FFF9F0] via-[#FFF3E0] to-[#FFF7E8] border border-[#FFE4B5] rounded-xl p-4 sm:p-5 transition-transform hover:scale-[1.01] duration-300 ease-in-out w-full"
                >
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors break-words max-w-[75%]">
                      {task.title}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                        task.status === "completed"
                          ? "bg-green-700 text-white"
                          : "bg-yellow-400 text-white"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 break-words">
                    {task.description}
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setEditTaskData(task)}
                      className="hover:text-orange-700 transition"
                      title="Edit Task"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete Task"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
};
