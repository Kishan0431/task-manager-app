import { http, HttpResponse } from "msw";

type RegisterBody = {
  username: string;
  email: string;
  password: string;
};

type LoginBody = {
  username: string;
  password: string;
};

type Task = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  username: string; // 🟡 Tracks task owner
};

// ⬇️ Utility: get/set users from localStorage
const getUsers = (): RegisterBody[] => {
  const stored = localStorage.getItem("mock_users");
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users: RegisterBody[]) => {
  localStorage.setItem("mock_users", JSON.stringify(users));
};

// ⬇️ Utility: get/set tasks from localStorage
const getTasks = (): Task[] => {
  const stored = localStorage.getItem("mock_tasks");
  return stored ? JSON.parse(stored) : [];
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem("mock_tasks", JSON.stringify(tasks));
};

// ⬇️ Counter for unique task IDs
let taskIdCounter =
  getTasks().reduce((max, task) => Math.max(max, task.id), 0) + 1;

export const handlers = [
  // ✅ Register
  http.post("/register", async ({ request }) => {
    const body = (await request.json()) as RegisterBody;
    const users = getUsers();

    const exists = users.some((u) => u.username === body.username);
    if (exists) {
      return HttpResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }

    const updatedUsers = [...users, body];
    saveUsers(updatedUsers);

    return HttpResponse.json(
      { message: "Registered successfully" },
      { status: 201 }
    );
  }),

  // ✅ Login
  http.post("/login", async ({ request }) => {
    const body = (await request.json()) as LoginBody;
    const users = getUsers();

    const user = users.find(
      (u) => u.username === body.username && u.password === body.password
    );

    if (!user) {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return HttpResponse.json({ username: user.username }, { status: 200 });
  }),

  // ✅ Get tasks for a specific user
  http.get("/tasks", ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    const tasks = getTasks();
    const userTasks = tasks.filter((t) => t.username === username);

    return HttpResponse.json(userTasks, { status: 200 });
  }),

  // ✅ Add a new task for the current user
  http.post("/tasks", async ({ request }) => {
    const body = (await request.json()) as Omit<Task, "id">;
    const newTask: Task = { ...body, id: taskIdCounter++ };

    const tasks = getTasks();
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);

    return HttpResponse.json(newTask, { status: 201 });
  }),

  // ✅ Update a task (username must match)
  http.put("/tasks/:id", async ({ params, request }) => {
    const id = Number(params.id);
    const updatedData = (await request.json()) as Omit<Task, "id">;

    let tasks = getTasks();
    tasks = tasks.map((t) => (t.id === id ? { ...updatedData, id } : t));
    saveTasks(tasks);

    return HttpResponse.json({ ...updatedData, id }, { status: 200 });
  }),

  // ✅ Delete a task (no user check here, could add)
  http.delete("/tasks/:id", ({ params }) => {
    const id = Number(params.id);

    let tasks = getTasks();
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks(tasks);

    return HttpResponse.json({ message: "Task deleted" }, { status: 200 });
  }),
];
