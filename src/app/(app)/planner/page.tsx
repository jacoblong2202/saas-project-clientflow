import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PlannerPage() {
  const weeklyGoals = [
    { id: 1, title: "Close 3 new client deals", completed: 2, total: 3, priority: "high" },
    { id: 2, title: "Complete website redesign for TechStart", completed: 1, total: 1, priority: "medium" },
    { id: 3, title: "Follow up with 15 prospects", completed: 8, total: 15, priority: "high" },
    { id: 4, title: "Prepare Q1 presentation", completed: 0, total: 1, priority: "low" }
  ];

  const dailyTasks = [
    { id: 1, title: "Call Sarah Johnson - TechStart proposal", time: "9:00 AM", completed: true },
    { id: 2, title: "Review marketing campaign performance", time: "10:30 AM", completed: false },
    { id: 3, title: "Send follow-up emails to prospects", time: "2:00 PM", completed: false },
    { id: 4, title: "Update client project timelines", time: "3:30 PM", completed: false },
    { id: 5, title: "Prepare for tomorrow's team meeting", time: "5:00 PM", completed: false }
  ];

  const notes = [
    { id: 1, title: "Client Meeting Notes", content: "Sarah from TechStart mentioned they're looking to scale their marketing efforts. Need to prepare a comprehensive proposal.", date: "Today" },
    { id: 2, title: "Project Ideas", content: "Consider creating a client onboarding automation system to reduce manual work and improve client satisfaction.", date: "Yesterday" },
    { id: 3, title: "Follow-up Reminders", content: "Call Mike from Design Studio next week to discuss their new project requirements.", date: "2 days ago" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agency Planner</h1>
          <p className="text-gray-600 mt-2">
            Organize your goals, tasks, and notes for better productivity
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Task
          </Button>
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Goals */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
            <CardDescription>
              Track your progress on key objectives this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyGoals.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(goal.priority)}`}>
                      {goal.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(goal.completed / goal.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {goal.completed}/{goal.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Tasks */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Daily Tasks</CardTitle>
            <CardDescription>
              Today's priority tasks and appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">{task.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Notes & Ideas</CardTitle>
          <CardDescription>
            Keep track of important thoughts and meeting notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{note.title}</h3>
                  <span className="text-xs text-gray-500">{note.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{note.content}</p>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-600">Weekly Goals</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600">Daily Tasks</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">Completed Today</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Active Notes</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 