"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Pencil } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Plus, CheckCircle, Clock, ListTodo } from "lucide-react"; // ✅ icons



// ✅ Dynamic imports (no SSR) to avoid "window is not defined"
const DragDropContext = dynamic(
  () => import("@hello-pangea/dnd").then((mod) => mod.DragDropContext),
  { ssr: false }
);
const Droppable = dynamic(
  () => import("@hello-pangea/dnd").then((mod) => mod.Droppable),
  { ssr: false }
);
const Draggable = dynamic(
  () => import("@hello-pangea/dnd").then((mod) => mod.Draggable),
  { ssr: false }
);

const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });


// 🔹 Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🔹 Types
type Task = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "todo" | "inprogress" | "completed";
  project_id: string;
};

type TaskColumns = {
  todo: Task[];
  inprogress: Task[];
  completed: Task[];
};

type Project = {
  id: string;
  name: string;
  tasks: TaskColumns;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    "All" | "High" | "Medium" | "Low"
  >("All");
  const [autoSort, setAutoSort] = useState(false);

  // 🔹 Form states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "High" | "Medium" | "Low"
  >("Medium");
  const [newTaskColumn, setNewTaskColumn] =
    useState<keyof TaskColumns>("todo");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [editingTaskPriority, setEditingTaskPriority] = useState<
    "High" | "Medium" | "Low"
  >("Medium");

  const [newProjectName, setNewProjectName] = useState("");

  // 🔹 Fetch projects & tasks
   useEffect(() => {
    const fetchProjects = async () => {
      const { data: projectsData } = await supabase.from("projects").select("*");
      if (projectsData) {
        const projectsWithTasks: Project[] = [];

        for (const project of projectsData) {
          const { data: tasksData } = await supabase
            .from("tasks")
            .select("*")
            .eq("project_id", project.id)
            .order("position", { ascending: true });

          const tasks: TaskColumns = {
            todo: [],
            inprogress: [],
            completed: [],
          };

          (tasksData || []).forEach((task: any) => {
            if (
              task.status === "todo" ||
              task.status === "inprogress" ||
              task.status === "completed"
            ) {
              tasks[task.status as keyof TaskColumns].push(task as Task);
            }
          });

          projectsWithTasks.push({ ...project, tasks });
        }

        setProjects(projectsWithTasks);
        if (!activeProjectId && projectsWithTasks.length > 0) {
          setActiveProjectId(projectsWithTasks[0].id);
        }
      }
    };

    fetchProjects();
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;

  // 🔹 Drag end with persistence
  const handleDragEnd = async (result: any) => {
    if (!result.destination || !activeProject) return;

    const { source, destination } = result;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== activeProjectId) return project;

        const newTasks: TaskColumns = { ...project.tasks };

        const sourceCol = Array.from(
          newTasks[source.droppableId as keyof TaskColumns]
        );
        const destCol = Array.from(
          newTasks[destination.droppableId as keyof TaskColumns]
        );

        const [moved] = sourceCol.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
          // Reorder in same column
          sourceCol.splice(destination.index, 0, moved);
          newTasks[source.droppableId as keyof TaskColumns] = sourceCol;
        } else {
          // Move across columns
          moved.status = destination.droppableId as Task["status"];
          destCol.splice(destination.index, 0, moved);
          newTasks[source.droppableId as keyof TaskColumns] = sourceCol;
          newTasks[destination.droppableId as keyof TaskColumns] = destCol;
        }

        // 🔹 Update DB positions
        const updates = [sourceCol, destCol].flat().map((task, idx) => ({
          id: task.id,
          status: task.status,
          position: idx,
        }));

        updates.forEach(async (u) => {
          await supabase
            .from("tasks")
            .update({ status: u.status, position: u.position })
            .eq("id", u.id);
        });

        return { ...project, tasks: newTasks };
      })
    );
  };

  // 🔹 Columns
  const columns = [
  { id: "todo", title: "Yet To Start", icon: Plus, color: "text-red-500" },
  { id: "inprogress", title: "In Progress", icon: Clock, color: "text-blue-500" },
  { id: "completed", title: "Completed", icon: CheckCircle, color: "text-green-500" },
];

  // 🔹 Stats
  const totalTasks = activeProject
    ? Object.values(activeProject.tasks).flat().length
    : 0;
  const completedTasks = activeProject?.tasks.completed.length ?? 0;
  const inProgressTasks = activeProject?.tasks.inprogress.length ?? 0;
  const todoTasks = activeProject?.tasks.todo.length ?? 0;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 🔹 Priority
  const priorityColors: Record<string, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  const filterTasks = (tasks: Task[]) => {
    let result = tasks.filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (priorityFilter !== "All") {
      result = result.filter((t) => t.priority === priorityFilter);
    }
    if (autoSort) {
      result = [...result].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }
    return result;
  };

  // 🔹 Task CRUD
  const addTask = async () => {
    if (!newTaskTitle.trim() || !activeProjectId) return;
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: newTaskTitle,
          priority: newTaskPriority,
          status: newTaskColumn,
          project_id: activeProjectId,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? {
                ...p,
                tasks: {
                  ...p.tasks,
                  [newTaskColumn]: [...p.tasks[newTaskColumn], data as Task],
                },
              }
            : p
        )
      );
    }

    setNewTaskTitle("");
    setNewTaskPriority("Medium");
    setNewTaskColumn("todo");
    setIsDialogOpen(false);
  };

  const updateTask = async () => {
    if (!editingTaskId) return;
    await supabase
      .from("tasks")
      .update({ title: editingTaskTitle, priority: editingTaskPriority })
      .eq("id", editingTaskId);

    setProjects((prev) =>
      prev.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              tasks: Object.fromEntries(
                Object.entries(project.tasks).map(([col, tasks]) => [
                  col,
                  tasks.map((t) =>
                    t.id === editingTaskId
                      ? {
                          ...t,
                          title: editingTaskTitle,
                          priority: editingTaskPriority,
                        }
                      : t
                  ),
                ])
              ) as TaskColumns,
            }
          : project
      )
    );

    setEditingTaskId(null);
  };

  const deleteTask = async (taskId: string) => {
    await supabase.from("tasks").delete().eq("id", taskId);
    setProjects((prev) =>
      prev.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              tasks: Object.fromEntries(
                Object.entries(project.tasks).map(([col, tasks]) => [
                  col,
                  tasks.filter((t) => t.id !== taskId),
                ])
              ) as TaskColumns,
            }
          : project
      )
    );
  };

  // 🔹 Project CRUD
  const addProject = async () => {
    if (!newProjectName.trim()) return;
    const { data, error } = await supabase
      .from("projects")
      .insert([{ name: newProjectName }])
      .select()
      .single();

    if (!error && data) {
      const newProject: Project = {
        id: data.id,
        name: data.name,
        tasks: { todo: [], inprogress: [], completed: [] },
      };
      setProjects((prev) => [...prev, newProject]);
      setActiveProjectId(newProject.id);
    }

    setNewProjectName("");
  };

  const updateProject = async (id: string, newName: string) => {
    await supabase.from("projects").update({ name: newName }).eq("id", id);
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  };

  const deleteProject = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id && projects.length > 1) {
      setActiveProjectId(projects[0].id);
    }
  };

  // --- UI ---
  return (
<div className="flex gap-6 min-h-screen p-6 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* 🔹 Left: Kanban */}
      
<div className="flex-1">
  {/* Add Task */}
  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogTrigger asChild>
    <Button
      className="mb-4 w-full rounded-xl shadow-lg hover:scale-105 transition
                 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                 bg-[length:200%_200%] animate-gradient-text text-white border-0"
    >
      + Add Task
    </Button>
  </DialogTrigger><DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">Add New Task</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          placeholder="Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="rounded-lg"
        />
        <select
          value={newTaskColumn}
          onChange={(e) =>
            setNewTaskColumn(e.target.value as keyof TaskColumns)
          }
          className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700"
        >
          {columns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          value={newTaskPriority}
          onChange={(e) =>
            setNewTaskPriority(e.target.value as "High" | "Medium" | "Low")
          }
          className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700"
        >
          <option value="High">🔥 High</option>
          <option value="Medium">⚡ Medium</option>
          <option value="Low">🌱 Low</option>
        </select>
       <Button
  onClick={addTask}
  className="w-full rounded-lg 
             bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
             bg-[length:200%_200%] animate-gradient-text text-white border-0 shadow-lg hover:scale-105 transition"
>
  Add Task
</Button>

      </div>
    </DialogContent>
  </Dialog>

  {/* Filters */}
  <div className="flex flex-wrap gap-2 mb-6">
    <Input
      placeholder="🔍 Search tasks..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="rounded-lg"
    />
    <select
      value={priorityFilter}
      onChange={(e) =>
        setPriorityFilter(
          e.target.value as "All" | "High" | "Medium" | "Low"
        )
      }
      className="border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700"
    >
      <option value="All">All Priorities</option>
      <option value="High">🔥 High</option>
      <option value="Medium">⚡Medium</option>
      <option value="Low">🌱 Low</option>
    </select>
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={autoSort}
        onChange={(e) => setAutoSort(e.target.checked)}
        className="rounded"
      />
      Sort by priority
    </label>
  </div>

  {/* Kanban */}
  <DragDropContext onDragEnd={handleDragEnd}>
    <div className="grid grid-cols-3 gap-6">
      {columns.map((col) => (
        <Droppable key={col.id} droppableId={col.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl shadow-inner min-h-[450px] flex flex-col"
            >
<h2 className="font-semibold mb-4 text-lg flex items-center gap-2">
                   <col.icon className={`w-5 h-5 ${col.color}`} />
  {col.title}
                
                </h2>
              {activeProject &&
                filterTasks(activeProject.tasks[col.id as keyof TaskColumns]).map(
                  (task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 mb-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700"
                        >
                          {editingTaskId === task.id ? (
                            <div className="space-y-3">
                              <Input
                                value={editingTaskTitle}
                                onChange={(e) => setEditingTaskTitle(e.target.value)}
                                className="rounded-lg"
                              />
                              <select
                                value={editingTaskPriority}
                                onChange={(e) =>
                                  setEditingTaskPriority(
                                    e.target.value as "High" | "Medium" | "Low"
                                  )
                                }
                                className="w-full border rounded-lg px-3 py-2"
                              >
                                <option value="High">🔥 High</option>
                                <option value="Medium">⚡ Medium</option>
                                <option value="Low">🌱 Low</option>
                              </select>
                              <Button onClick={updateTask} size="sm" className="rounded-lg">
                                Save
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <span className="text-sm font-medium">{task.title}</span>
                              <div className="mt-2 flex items-center gap-2">
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded-lg ${priorityColors[task.priority]}`}
                                >
                                  {task.priority}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingTaskId(task.id);
                                    setEditingTaskTitle(task.title);
                                    setEditingTaskPriority(task.priority);
                                  }}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </Card>
                      )}
                    </Draggable>
                  )
                )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  </DragDropContext>
</div>


      {/* 🔹 Right Panel */}
      <aside className="w-80 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
  {/* Project Selector */}
  <div className="mb-6">
    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      Select Project
    </label>
    <select
      value={activeProjectId ?? ""}
      onChange={(e) => setActiveProjectId(e.target.value)}
      className="w-full border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
    >
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  </div>

  {/* Project Title */}
  <h3 className="text-lg font-semibold mb-4">
    📂 Project: <span className="text-red-600 dark:text-blue-400">{activeProject?.name}</span>
  </h3>

  {/* Progress */}
  <div className="flex justify-center items-center mb-6">
    <PieChart width={200} height={200}>
      <defs>
        <linearGradient id="completedGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#16a34a" stopOpacity={1} />
        </linearGradient>
        <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#2563eb" stopOpacity={1} />
        </linearGradient>
        <linearGradient id="todoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="5%" stopColor="#f87171" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#dc2626" stopOpacity={1} />
        </linearGradient>
      </defs>

      <Pie
        data={[
          { name: "Completed", value: completedTasks, fill: "url(#completedGradient)" },
          { name: "In Progress", value: inProgressTasks, fill: "url(#progressGradient)" },
          { name: "Todo", value: todoTasks, fill: "url(#todoGradient)" },
        ]}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={55}
        outerRadius={85}
        paddingAngle={4}
        cornerRadius={10}
        isAnimationActive={true}
         labelLine={false}
    label={({ cx, cy }) => (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-l font-bold fill-black-700 dark:fill-gray-200"
      >
        {progress}%
      </text>
    )}
        
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          padding: "8px 12px",
        }}
      />
    </PieChart>
  </div>

 {/* Stats */}
{/* Stats */}
<div className="grid grid-cols-2 gap-4 mb-6">
  {/* Total */}
  <div className="flex items-center gap-3 p-4 rounded-xl shadow-sm bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700 hover:shadow-md transition cursor-pointer">
    <ListTodo className="w-6 h-6 text-gray-500 dark:text-gray-400" />
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
      <p className="text-lg font-semibold">{totalTasks}</p>
    </div>
  </div>

  {/* In Progress */}
  <div className="flex items-center gap-2 p-4 rounded-xl shadow-sm bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700 hover:shadow-md transition cursor-pointer">
    <Clock className="w-6 h-6 text-blue-500" />
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">In Progress</p>
      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{inProgressTasks}</p>
    </div>
  </div>

  {/* Waiting */}
  <div className="flex items-center gap-3 p-4 rounded-xl shadow-sm bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700 hover:shadow-md transition cursor-pointer">
    <Plus className="w-6 h-6 text-red-500" />
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">Waiting</p>
      <p className="text-lg font-semibold text-red-600 dark:text-red-400">{todoTasks}</p>
    </div>
  </div>

  {/* Completed */}
  <div className="flex items-center gap-3 p-4 rounded-xl shadow-sm bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700 hover:shadow-md transition cursor-pointer">
    <CheckCircle className="w-6 h-6 text-green-500" />
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
      <p className="text-lg font-semibold text-green-600 dark:text-green-400">{completedTasks}</p>
    </div>
  </div>
</div>

  {/* Project Manager */}
  <Dialog>
  <DialogTrigger asChild>
    <Button
      className="w-full rounded-lg 
                 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                 bg-[length:200%_200%] animate-gradient-text text-white border-0 shadow-lg
                 hover:scale-105 transition"
    >
      ⚙️ Manage Projects
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold">Projects</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="New project name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="rounded-lg"
        />
        <Button
          onClick={addProject}
          className="rounded-lg 
                     bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                     bg-[length:200%_200%] animate-gradient-text text-white border-0 shadow-lg
                     hover:scale-105 transition"
        >
          Add
        </Button>
      </div>
      <ul className="space-y-2">
        {projects.map((p) => (
          <li
            key={p.id}
            className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <span>{p.name}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline"  onClick={() => { const newName = prompt("Rename project:", p.name); if (newName) updateProject(p.id, newName); }} className="rounded-md" > Edit </Button>
               <Button size="sm" variant="destructive" onClick={() => deleteProject(p.id)} className="rounded-md" > Delete </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </DialogContent>
</Dialog>

</aside>
    </div>
  );
}
