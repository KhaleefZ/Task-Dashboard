"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel } from "@/components/ui/menubar"
import { ClientDate } from "@/components/ClientDate"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  BarChart3,
  Settings,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
  Copy,
  Bell,
  Moon,
  Sun,
  UserCircle,
  Clock,
  Target,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Eye,
  Archive,
  Save,
} from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignee: string
  dueDate: string
  project: string
  tags?: string[]
}

interface DashboardSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  darkMode: boolean
  defaultProject: string
  autoAssign: boolean
}

interface Project {
  id: string
  name: string
  description: string
  color: "blue" | "green" | "purple" | "orange" | "red"
  deadline: string
  status: "active" | "on-hold" | "completed"
  progress: number
  tasks: number
  completedTasks: number
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design system updates",
    description: "Update color tokens and component styles for better accessibility",
    status: "in-progress",
    priority: "high",
    assignee: "Sarah Chen",
    dueDate: "2024-01-15",
    project: "Design System",
    tags: ["design", "ui", "accessibility"],
  },
  {
    id: "2",
    title: "API integration",
    description: "Connect frontend with new backend endpoints for user management",
    status: "todo",
    priority: "medium",
    assignee: "Mike Johnson",
    dueDate: "2024-01-20",
    project: "Backend",
    tags: ["api", "backend", "integration"],
  },
  {
    id: "3",
    title: "User testing",
    description: "Conduct usability tests for new dashboard features",
    status: "completed",
    priority: "low",
    assignee: "Emma Davis",
    dueDate: "2024-01-10",
    project: "Research",
    tags: ["testing", "ux", "research"],
  },
  {
    id: "4",
    title: "Mobile responsiveness",
    description: "Optimize dashboard for mobile and tablet devices",
    status: "todo",
    priority: "high",
    assignee: "Alex Kim",
    dueDate: "2024-01-18",
    project: "Frontend",
    tags: ["mobile", "responsive", "css"],
  },
  {
    id: "5",
    title: "Performance optimization",
    description: "Improve page load times and reduce bundle size",
    status: "in-progress",
    priority: "medium",
    assignee: "Jordan Lee",
    dueDate: "2024-01-25",
    project: "Frontend",
    tags: ["performance", "optimization"],
  },
]

export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [activeView, setActiveView] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dueDate")
  const [savedViews, setSavedViews] = useState<{ name: string; config: any }[]>([])
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] = useState(false)
  const [advancedFilter, setAdvancedFilter] = useState<string>("none")
  const availableTags = ["ui","backend","urgent","research"]
  const [notifications, setNotifications] = useState(3)
  const [notificationList, setNotificationList] = useState([
    {
      id: 1,
      title: "Task deadline approaching",
      message: "Design system updates due in 2 days",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "New task assigned",
      message: "Mobile responsiveness task assigned to you",
      time: "4 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Project milestone reached",
      message: "Frontend project 75% complete",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      title: "Team meeting reminder",
      message: "Weekly standup in 30 minutes",
      time: "30 minutes ago",
      read: false,
    },
    { id: 5, title: "Code review requested", message: "Please review PR #123", time: "3 hours ago", read: true },
  ])

  const [settings, setSettings] = useState<DashboardSettings>({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    defaultProject: "General",
    autoAssign: false,
  })

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignee: "",
    dueDate: "",
    project: "",
    tags: [],
  })

  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false)
  const [projectAction, setProjectAction] = useState("")

  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    description: "",
    color: "blue",
    deadline: "",
    status: "active",
  })

  const markNotificationAsRead = (id: number) => {
    setNotificationList((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    setNotifications((prev) => Math.max(0, prev - 1))
  }

  const clearAllNotifications = () => {
    setNotificationList((prev) => prev.map((notif) => ({ ...notif, read: true })))
    setNotifications(0)
  }

  const handleProjectAction = (project: string, action: string) => {
    setSelectedProject(project)
    setProjectAction(action)
    setIsProjectDialogOpen(true)
  }

  const executeProjectAction = () => {
    if (projectAction === "archive") {
      // Archive project logic
      console.log(`Archiving project: ${selectedProject}`)
    } else if (projectAction === "edit") {
      // Edit project logic
      console.log(`Editing project: ${selectedProject}`)
    } else if (projectAction === "view") {
      // View project logic
      console.log(`Viewing project: ${selectedProject}`)
    }
    setIsProjectDialogOpen(false)
    setSelectedProject(null)
    setProjectAction("")
  }

  const toggleTheme = () => {
    const newDarkMode = !settings.darkMode
    setSettings({ ...settings, darkMode: newDarkMode })
    document.documentElement.classList.toggle("dark", newDarkMode)
  }

  const updateSetting = (key: keyof DashboardSettings, value: boolean | string) => {
    setSettings({ ...settings, [key]: value })
  }

  const saveSettings = () => {
    // Simulate API call to save settings
    console.log("[v0] Saving settings:", settings)
    // Show success message or toast
    alert("Settings saved successfully!")
  }

  const createTask = () => {
    if (!newTask.title || !newTask.assignee || !newTask.dueDate || !newTask.project) {
      alert("Please fill in all required fields")
      return
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      description: newTask.description || "",
      status: (newTask.status as Task["status"]) || "todo",
      priority: (newTask.priority as Task["priority"]) || "medium",
      assignee: newTask.assignee!,
      dueDate: newTask.dueDate!,
      project: newTask.project!,
      tags: newTask.tags || [],
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignee: "",
      dueDate: "",
      project: "",
      tags: [],
    })
    setIsCreateDialogOpen(false)
  }

  const updateTask = () => {
    if (!editingTask) return

    setTasks(tasks.map((task) => (task.id === editingTask.id ? editingTask : task)))
    setEditingTask(null)
    setIsEditDialogOpen(false)
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const duplicateTask = (task: Task) => {
    const duplicatedTask: Task = {
      ...task,
      id: Date.now().toString(),
      title: `${task.title} (Copy)`,
    }
    setTasks([...tasks, duplicatedTask])
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "completed" ? "todo" : task.status === "todo" ? "in-progress" : "completed"
          return { ...task, status: newStatus }
        }
        return task
      }),
    )
  }

  const changeTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority

    // View-based filtering
    const matchesView =
      activeView === "all" ||
      (activeView === "todo" && task.status === "todo") ||
      (activeView === "in-progress" && task.status === "in-progress") ||
      (activeView === "completed" && task.status === "completed")

    return matchesSearch && matchesStatus && matchesPriority && matchesView
  })

  const sortedTasks = [...filteredTasks].sort((a,b) => {
    switch (sortBy) {
      case 'title': return a.title.localeCompare(b.title)
      case 'priority': return a.priority.localeCompare(b.priority)
      case 'status': return a.status.localeCompare(b.status)
      case 'dueDate':
      default: return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
  })

  const toggleTaskSelection = (id: string) => {
    setSelectedTasks(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const clearSelection = () => setSelectedTasks(new Set())
  const bulkChangeStatus = (status: Task['status']) => {
    if (!selectedTasks.size) return
    setTasks(ts => ts.map(t => selectedTasks.has(t.id) ? { ...t, status } : t))
    clearSelection()
  }
  const bulkDelete = () => {
    if (!selectedTasks.size) return
    setTasks(ts => ts.filter(t => !selectedTasks.has(t.id)))
    clearSelection()
  }
  const bulkAddTag = (tag: string) => {
    if (!selectedTasks.size) return
    setTasks(ts => ts.map(t => selectedTasks.has(t.id) ? { ...t, tags: t.tags?.includes(tag) ? t.tags : [...(t.tags||[]), tag] } : t))
  }
  const applyAdvancedFilter = (key: string) => {
    setAdvancedFilter(key)
    if (key === 'highDueSoon') {
      setFilterPriority('high'); setSortBy('dueDate')
    } else if (key === 'completedRecent') {
      setFilterStatus('completed'); setSortBy('dueDate')
    } else if (key === 'inProgress') {
      setFilterStatus('in-progress')
    } else {
      setFilterStatus('all'); setFilterPriority('all')
    }
  }
  const saveCurrentView = () => {
    const name = prompt('Name this view:')
    if (!name) return
    setSavedViews(v => [...v, { name, config: { filterStatus, filterPriority, sortBy, activeView } }])
  }
  const loadView = (view: { name: string; config: { filterStatus: string; filterPriority: string; sortBy: string; activeView: string } }) => {
    setFilterStatus(view.config.filterStatus)
    setFilterPriority(view.config.filterPriority)
    setSortBy(view.config.sortBy)
    setActiveView(view.config.activeView)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    }
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, count: null },
    { id: "tasks", label: "All Tasks", icon: CheckSquare, count: tasks.length },
    { id: "projects", label: "Projects", icon: FolderOpen, count: new Set(tasks.map((t) => t.project)).size },
    { id: "reports", label: "Analytics", icon: BarChart3, count: null },
    { id: "settings", label: "Settings", icon: Settings, count: null },
  ]

  const [projects, setProjects] = useState<Project[]>([])

  const createProject = () => {
    if (!newProject.name || !newProject.deadline) {
      alert("Please fill in all required fields")
      return
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name!,
      description: newProject.description || "",
      color: (newProject.color as Project["color"]) || "blue",
      deadline: newProject.deadline!,
      status: (newProject.status as Project["status"]) || "active",
      progress: 0,
      tasks: 0,
      completedTasks: 0,
    }

    setProjects([...projects, project])
    setNewProject({
      name: "",
      description: "",
      color: "blue",
      deadline: "",
      status: "active",
    })
    setIsCreateProjectDialogOpen(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-72 bg-gradient-to-b from-sidebar to-sidebar/95 border-r border-sidebar-border shadow-lg">
        <div className="p-6 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">TASK MANAGEMENT SYSTEM</h1>
              <p className="text-xs text-sidebar-foreground/60">Project Management</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-sidebar-border/50">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-sidebar-accent/50">
              <div className="text-lg font-bold text-sidebar-foreground">
                {tasks.filter((t) => t.status === "todo").length}
              </div>
              <div className="text-xs text-sidebar-foreground/60">To Do</div>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <div className="text-lg font-bold text-blue-600">
                {tasks.filter((t) => t.status === "in-progress").length}
              </div>
              <div className="text-xs text-sidebar-foreground/60">Active</div>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10">
              <div className="text-lg font-bold text-green-600">
                {tasks.filter((t) => t.status === "completed").length}
              </div>
              <div className="text-xs text-sidebar-foreground/60">Done</div>
            </div>
          </div>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                  activeTab === item.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg scale-[1.02]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.01]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== null && (
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border/50 bg-sidebar/95">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/30">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground truncate">Khaleel</div>
              <div className="text-xs text-sidebar-foreground/60">Project Manager</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
  <header className="bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">
                  {activeTab === "dashboard" && "Dashboard"}
                  {activeTab === "tasks" && "All Tasks"}
                  {activeTab === "projects" && "Projects"}
                  {activeTab === "reports" && "Analytics"}
                  {activeTab === "settings" && "Settings"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === "dashboard" && "Overview of your tasks and projects"}
                  {activeTab === "tasks" && `${filteredTasks.length} tasks found`}
                  {activeTab === "projects" && "Manage your project portfolio"}
                  {activeTab === "reports" && "Insights and performance metrics"}
                  {activeTab === "settings" && "Configure your preferences"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Menubar className="hidden lg:flex">
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem onClick={() => setIsCreateDialogOpen(true)}>New Task...</MenubarItem>
                    <MenubarItem onClick={() => setIsCreateProjectDialogOpen(true)}>New Project...</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={saveCurrentView}>Save View</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>View</MenubarTrigger>
                  <MenubarContent>
                    <MenubarLabel>Sort By</MenubarLabel>
                    <MenubarItem onClick={() => setSortBy('dueDate')}>Due Date</MenubarItem>
                    <MenubarItem onClick={() => setSortBy('title')}>Title</MenubarItem>
                    <MenubarItem onClick={() => setSortBy('priority')}>Priority</MenubarItem>
                    <MenubarItem onClick={() => setSortBy('status')}>Status</MenubarItem>
                    <MenubarSeparator />
                    <MenubarLabel>Saved Views</MenubarLabel>
                    {savedViews.length === 0 && <MenubarItem disabled>No views</MenubarItem>}
                    {savedViews.map(v => <MenubarItem key={v.name} onClick={() => loadView(v)}>{v.name}</MenubarItem>)}
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Help</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem onClick={() => setIsShortcutsOpen(true)}>Keyboard Shortcuts</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks, projects, people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-background/50"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                        {notifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-96">
                  <div className="flex items-center justify-between p-3 border-b">
                    <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                    <Button variant="ghost" size="sm" onClick={clearAllNotifications} className="text-xs">
                      Mark all read
                    </Button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificationList.map((notif) => (
                      <DropdownMenuItem
                        key={notif.id}
                        className={`p-4 cursor-pointer ${!notif.read ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
                        onClick={() => markNotificationAsRead(notif.id)}
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{notif.title}</div>
                            {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                          <div className="text-sm text-muted-foreground">{notif.message}</div>
                          <div className="text-xs text-muted-foreground mt-1">{notif.time}</div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  {notificationList.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">No notifications</div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {settings.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    <span className="hidden md:inline">Khaleel</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsTeamDialogOpen(true)}>Team Management</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Create Task Button */}
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                {/* ... existing dialog content ... */}
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>Add a new task to your project. Fill in the details below.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Enter task description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={newTask.status}
                          onValueChange={(value) => setNewTask({ ...newTask, status: value as Task["status"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task["priority"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="assignee">Assignee *</Label>
                      <Input
                        id="assignee"
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                        placeholder="Enter assignee name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Due Date *</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="project">Project *</Label>
                      <Input
                        id="project"
                        value={newTask.project}
                        onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                        placeholder="Enter project name"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={createTask} className="bg-gradient-to-r from-primary to-secondary">
                      Create Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {(activeTab === "dashboard" || activeTab === "tasks") && (
            <div className="px-6 pb-4 border-t border-border/50">
              <div className="flex items-center justify-between mt-4">
                <Tabs value={activeView} onValueChange={setActiveView} className="w-auto">
                  <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                    <TabsTrigger value="all" className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      All
                    </TabsTrigger>
                    <TabsTrigger value="todo" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      To Do
                    </TabsTrigger>
                    <TabsTrigger value="in-progress" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Active
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Done
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                  {/* Status Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Filter className="h-4 w-4" />
                        Status: {filterStatus === "all" ? "All" : filterStatus}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("todo")}>To Do</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("in-progress")}>In Progress</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("completed")}>Completed</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Priority Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <AlertCircle className="h-4 w-4" />
                        Priority: {filterPriority === "all" ? "All" : filterPriority}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterPriority("all")}>All</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority("high")}>High</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority("medium")}>Medium</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority("low")}>Low</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Advanced Filter Presets */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Filter className="h-4 w-4" />
                        Preset: {advancedFilter === 'none' ? 'None' : advancedFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Advanced Presets</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => applyAdvancedFilter('none')}>Reset</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => applyAdvancedFilter('highDueSoon')}>High & Due Soon</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => applyAdvancedFilter('completedRecent')}>Recently Completed</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => applyAdvancedFilter('inProgress')}>In Progress Only</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-background to-muted/20">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="gradient-border hover:shadow-lg transition-all duration-300">
                  <div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
                        <CheckSquare className="h-5 w-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary">{tasks.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600">+2</span> from last week
                      </p>
                    </CardContent>
                  </div>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {tasks.filter((t) => t.status === "in-progress").length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-blue-600">Active</span> right now
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-green-200 dark:border-green-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {tasks.filter((t) => t.status === "completed").length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-600">+1</span> this week
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-purple-200 dark:border-purple-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Recent Tasks
                      </CardTitle>
                      <CardDescription>
                        {filteredTasks.length} of {tasks.length} tasks shown
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-purple-600">
                        {Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100)}%
                      </div>
                      <Progress
                        value={(tasks.filter((t) => t.status === "completed").length / tasks.length) * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Recent Tasks
                      </CardTitle>
                      <CardDescription>
                        {filteredTasks.length} of {tasks.length} tasks shown
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Recent Tasks</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">Sort: {sortBy}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => setSortBy('dueDate')}>Due Date</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy('title')}>Title</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy('priority')}>Priority</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSortBy('status')}>Status</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">Views</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={saveCurrentView}>Save Current</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {savedViews.length === 0 && <DropdownMenuItem disabled>No saved views</DropdownMenuItem>}
                        {savedViews.map(v => <DropdownMenuItem key={v.name} onClick={() => loadView(v)}>{v.name}</DropdownMenuItem>)}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-3">
                    {sortedTasks.slice(0, 5).map((task) => (
                      <ContextMenu key={task.id}>
                        <ContextMenuTrigger>
                          <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-all duration-200 hover:shadow-md group">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => toggleTaskStatus(task.id)}
                                className="transition-transform hover:scale-110"
                              >
                                {task.status === "completed" ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground hover:border-primary transition-colors" />
                                )}
                              </button>
                              <div className="space-y-1">
                                <h4 className="font-medium group-hover:text-primary transition-colors">{task.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {task.assignee}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <ClientDate date={task.dueDate} />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <FolderOpen className="h-3 w-3" />
                                    {task.project}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getPriorityColor(task.priority)} variant="secondary">
                                {task.priority}
                              </Badge>
                              <Badge className={getStatusColor(task.status)} variant="secondary">
                                {task.status.replace("-", " ")}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingTask(task)
                                      setIsEditDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Task
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => duplicateTask(task)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => changeTaskStatus(task.id, "todo")}>
                                    Mark as To Do
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => changeTaskStatus(task.id, "in-progress")}>
                                    Mark as In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => changeTaskStatus(task.id, "completed")}>
                                    Mark as Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive" onClick={() => deleteTask(task.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Task
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                          <ContextMenuItem
                            onClick={() => {
                              setEditingTask(task)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            Edit Task
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6 animate-fade-in">
              <div className="grid gap-4">
                    {sortedTasks.map((task) => (
                  <ContextMenu key={task.id}>
                    <ContextMenuTrigger>
                      <Card className="hover:shadow-lg transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <button
                                onClick={() => toggleTaskStatus(task.id)}
                                className="transition-transform hover:scale-110"
                              >
                                {task.status === "completed" ? (
                                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                                ) : (
                                  <div className="h-6 w-6 rounded-full border-2 border-muted-foreground hover:border-primary transition-colors" />
                                )}
                              </button>
                              <input type="checkbox" aria-label="Select task" checked={selectedTasks.has(task.id)} onChange={() => toggleTaskSelection(task.id)} className="accent-primary h-4 w-4" />
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                    {task.title}
                                  </h3>
                                  <Badge className={getPriorityColor(task.priority)} variant="secondary">
                                    {task.priority}
                                  </Badge>
                                  <Badge className={getStatusColor(task.status)} variant="secondary">
                                    {task.status.replace("-", " ")}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground">{task.description}</p>
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {task.assignee}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <ClientDate date={task.dueDate} />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <FolderOpen className="h-4 w-4" />
                                    {task.project}
                                  </div>
                                  {task.tags && task.tags.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      {task.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingTask(task)
                                    setIsEditDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Task
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => duplicateTask(task)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => changeTaskStatus(task.id, "todo")}>
                                  Mark as To Do
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changeTaskStatus(task.id, "in-progress")}>
                                  Mark as In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changeTaskStatus(task.id, "completed")}>
                                  Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => deleteTask(task.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Task
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => {
                          setEditingTask(task)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        Edit Task
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => duplicateTask(task)}>Duplicate Task</ContextMenuItem>
                      <ContextMenuItem onClick={() => deleteTask(task.id)} className="text-destructive">
                        Delete Task
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
                {sortedTasks.length === 0 && (
                  <Card className="p-12 text-center">
              {selectedTasks.size > 0 && (
                <div className="sticky bottom-4 left-0 right-0 flex items-center justify-between bg-card border shadow-lg rounded-xl p-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="text-sm">{selectedTasks.size} selected</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => bulkChangeStatus('todo')}>To Do</Button>
                    <Button variant="outline" size="sm" onClick={() => bulkChangeStatus('in-progress')}>In Progress</Button>
                    <Button variant="outline" size="sm" onClick={() => bulkChangeStatus('completed')}>Completed</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">Add Tag</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {availableTags.map(tag => (
                          <DropdownMenuItem key={tag} onClick={() => bulkAddTag(tag)}>#{tag}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="destructive" size="sm" onClick={bulkDelete}>Delete</Button>
                    <Button variant="ghost" size="sm" onClick={clearSelection}>Clear</Button>
                  </div>
                </div>
              )}

              {/* Keyboard Shortcuts Dialog */}
              <Dialog open={isShortcutsDialogOpen} onOpenChange={setIsShortcutsDialogOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                    <DialogDescription>Boost productivity with these shortcuts.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between"><span>Create Task</span><kbd className="px-2 py-0.5 rounded bg-muted text-xs">N</kbd></div>
                    <div className="flex justify-between"><span>Search</span><kbd className="px-2 py-0.5 rounded bg-muted text-xs">/</kbd></div>
                    <div className="flex justify-between"><span>Toggle Theme</span><kbd className="px-2 py-0.5 rounded bg-muted text-xs">T</kbd></div>
                    <div className="flex justify-between"><span>Next View</span><kbd className="px-2 py-0.5 rounded bg-muted text-xs">Alt+→</kbd></div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Floating Quick Add Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-xl" variant="default">
                    <Plus className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-44">
                  <DropdownMenuLabel>Quick Add</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsCreateDialogOpen(true)}>Task</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsCreateProjectDialogOpen(true)}>Project</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => saveCurrentView()}>Save View</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsShortcutsDialogOpen(true)}>Shortcuts</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
                    <div className="space-y-4">
                      <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold">No tasks found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters or create a new task.</p>
                      </div>
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Task
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
                  <p className="text-muted-foreground">Manage your project portfolio</p>
                </div>
                <Button
                  onClick={() => setIsCreateProjectDialogOpen(true)}
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from(new Set(tasks.map((t) => t.project))).map((project) => {
                  const projectTasks = tasks.filter((t) => t.project === project)
                  const completedTasks = projectTasks.filter((t) => t.status === "completed")
                  const progress = (completedTasks.length / projectTasks.length) * 100

                  return (
                    <Card key={project} className="hover:shadow-lg transition-all duration-300 group">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <FolderOpen className="h-5 w-5 text-primary" />
                            {project}
                          </CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleProjectAction(project, "view")}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Project
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleProjectAction(project, "edit")}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Project
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleProjectAction(project, "archive")}
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                Archive Project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription>
                          {projectTasks.length} tasks • {Math.round(progress)}% complete
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Progress value={progress} className="h-2" />
                          <div className="grid grid-cols-3 gap-2 text-center text-sm">
                            <div>
                              <div className="font-semibold text-gray-600">
                                {projectTasks.filter((t) => t.status === "todo").length}
                              </div>
                              <div className="text-xs text-muted-foreground">To Do</div>
                            </div>
                            <div>
                              <div className="font-semibold text-blue-600">
                                {projectTasks.filter((t) => t.status === "in-progress").length}
                              </div>
                              <div className="text-xs text-muted-foreground">Active</div>
                            </div>
                            <div>
                              <div className="font-semibold text-green-600">{completedTasks.length}</div>
                              <div className="text-xs text-muted-foreground">Done</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Recent Tasks</h4>
                            {projectTasks.slice(0, 3).map((task) => (
                              <div key={task.id} className="flex items-center gap-2 text-sm">
                                {task.status === "completed" ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                                )}
                                <span className="flex-1 truncate">{task.title}</span>
                                <Badge
                                  className={`${getPriorityColor(task.priority)} text-xs`}
                                  variant="secondary"
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Analytics</h2>
                  <p className="text-muted-foreground">Insights and performance metrics</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100)}%
                    </div>
                    <Progress
                      value={(tasks.filter((t) => t.status === "completed").length / tasks.length) * 100}
                      className="h-2 mt-2"
                    />
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{new Set(tasks.map((t) => t.project)).size}</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all teams</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      {tasks.filter((t) => t.priority === "high").length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {new Set(tasks.map((t) => t.assignee)).size}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Active contributors</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Task Status Distribution</CardTitle>
                    <CardDescription>Visual breakdown of task statuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        {/* Simple donut chart representation */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="8"
                            strokeDasharray={`${(tasks.filter((t) => t.status === "completed").length / tasks.length) * 251.2} 251.2`}
                            strokeLinecap="round"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            strokeDasharray={`${(tasks.filter((t) => t.status === "in-progress").length / tasks.length) * 251.2} 251.2`}
                            strokeDashoffset={`-${(tasks.filter((t) => t.status === "completed").length / tasks.length) * 251.2}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{tasks.length}</div>
                            <div className="text-sm text-muted-foreground">Total Tasks</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">
                          Completed ({tasks.filter((t) => t.status === "completed").length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">
                          In Progress ({tasks.filter((t) => t.status === "in-progress").length})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span className="text-sm">To Do ({tasks.filter((t) => t.status === "todo").length})</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Priority Distribution</CardTitle>
                    <CardDescription>Task breakdown by priority level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["high", "medium", "low"].map((priority) => {
                        const count = tasks.filter((t) => t.priority === priority).length
                        const percentage = (count / tasks.length) * 100
                        const colors = {
                          high: "bg-red-500",
                          medium: "bg-yellow-500",
                          low: "bg-green-500",
                        }
                        return (
                          <div key={priority} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${colors[priority as keyof typeof colors]}`}></div>
                                <span className="capitalize">{priority} Priority</span>
                              </div>
                              <span className="font-medium">
                                {count} tasks ({Math.round(percentage)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${colors[priority as keyof typeof colors]}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>Task completion by team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(tasks.map((t) => t.assignee))).map((assignee) => {
                      const assigneeTasks = tasks.filter((t) => t.assignee === assignee)
                      const completedTasks = assigneeTasks.filter((t) => t.status === "completed")
                      const completionRate = (completedTasks.length / assigneeTasks.length) * 100

                      return (
                        <div key={assignee} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                                <span className="text-xs text-primary-foreground font-medium">
                                  {assignee
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <span>{assignee}</span>
                            </div>
                            <span>
                              {completedTasks.length}/{assigneeTasks.length} tasks ({Math.round(completionRate)}%)
                            </span>
                          </div>
                          <Progress value={completionRate} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <div className="text-sm text-muted-foreground">Receive task updates via email</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting("emailNotifications", !settings.emailNotifications)}
                        className={settings.emailNotifications ? "bg-primary text-primary-foreground" : ""}
                      >
                        {settings.emailNotifications ? "On" : "Off"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Push Notifications</Label>
                        <div className="text-sm text-muted-foreground">Receive browser notifications</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting("pushNotifications", !settings.pushNotifications)}
                        className={settings.pushNotifications ? "bg-primary text-primary-foreground" : ""}
                      >
                        {settings.pushNotifications ? "On" : "Off"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize your dashboard appearance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Dark Mode</Label>
                        <div className="text-sm text-muted-foreground">Toggle dark/light theme</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                        className={settings.darkMode ? "bg-primary text-primary-foreground" : ""}
                      >
                        {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Project Settings</CardTitle>
                    <CardDescription>Configure default project settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultProject">Default Project</Label>
                      <Select
                        value={settings.defaultProject}
                        onValueChange={(value) => updateSetting("defaultProject", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          {Array.from(new Set(tasks.map((t) => t.project))).map((project) => (
                            <SelectItem key={project} value={project}>
                              {project}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auto-assign Tasks</Label>
                        <div className="text-sm text-muted-foreground">Automatically assign new tasks to you</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSetting("autoAssign", !settings.autoAssign)}
                        className={settings.autoAssign ? "bg-primary text-primary-foreground" : ""}
                      >
                        {settings.autoAssign ? "On" : "Off"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <UserCircle className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Users className="h-4 w-4 mr-2" />
                      Team Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced Settings
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button onClick={saveSettings} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update the task details below.</DialogDescription>
            </DialogHeader>
            {editingTask && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editingTask.status}
                      onValueChange={(value) => setEditingTask({ ...editingTask, status: value as Task["status"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      value={editingTask.priority}
                      onValueChange={(value) => setEditingTask({ ...editingTask, priority: value as Task["priority"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-assignee">Assignee *</Label>
                  <Input
                    id="edit-assignee"
                    value={editingTask.assignee}
                    onChange={(e) => setEditingTask({ ...editingTask, assignee: e.target.value })}
                    placeholder="Enter assignee name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-dueDate">Due Date *</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-project">Project *</Label>
                  <Input
                    id="edit-project"
                    value={editingTask.project}
                    onChange={(e) => setEditingTask({ ...editingTask, project: e.target.value })}
                    placeholder="Enter project name"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={updateTask} className="bg-gradient-to-r from-primary to-secondary">
                Update Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {projectAction === "view" && `View Project: ${selectedProject}`}
                {projectAction === "edit" && `Edit Project: ${selectedProject}`}
                {projectAction === "archive" && `Archive Project: ${selectedProject}`}
              </DialogTitle>
              <DialogDescription>
                {projectAction === "view" && "Project details and statistics"}
                {projectAction === "edit" && "Modify project settings and details"}
                {projectAction === "archive" && "Are you sure you want to archive this project?"}
              </DialogDescription>
            </DialogHeader>

            {projectAction === "view" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <div className="p-2 bg-muted rounded">{selectedProject}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="p-2 bg-muted rounded">Active</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <div className="p-2 bg-muted rounded">Project description and details would go here.</div>
                </div>
              </div>
            )}

            {projectAction === "edit" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input id="projectName" defaultValue={selectedProject ?? ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDesc">Description</Label>
                  <Input id="projectDesc" placeholder="Enter project description" />
                </div>
              </div>
            )}

            {projectAction === "archive" && (
              <div className="space-y-4">
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="text-sm">
                    This action will archive the project and all its tasks. You can restore it later from the archived
                    projects section.
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={executeProjectAction}>
                {projectAction === "view" && "Close"}
                {projectAction === "edit" && "Save Changes"}
                {projectAction === "archive" && "Archive Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profile Settings</DialogTitle>
              <DialogDescription>Manage your personal information and preferences</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue="Khaleel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="khaleel@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Project Manager" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about yourself" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsProfileDialogOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Team Management</DialogTitle>
              <DialogDescription>Manage team members and their roles</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Team Members</h4>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Khaleel", role: "Project Manager", email: "khaleel@example.com", status: "Active" },
                  { name: "Sarah Johnson", role: "Developer", email: "sarah@example.com", status: "Active" },
                  { name: "Mike Chen", role: "Designer", email: "mike@example.com", status: "Active" },
                  { name: "Emma Davis", role: "QA Tester", email: "emma@example.com", status: "Inactive" },
                ].map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-primary-foreground">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
                      <span className="text-sm text-muted-foreground">{member.role}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit Role</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTeamDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to your portfolio. Fill in the details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea
                  id="projectDescription"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="projectColor">Color Theme</Label>
                  <Select
                    value={newProject.color}
                    onValueChange={(value) => setNewProject({ ...newProject, color: value as Project["color"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="projectStatus">Status</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value) => setNewProject({ ...newProject, status: value as Project["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="projectDeadline">Deadline *</Label>
                <Input
                  id="projectDeadline"
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={createProject} className="bg-gradient-to-r from-primary to-secondary">
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
