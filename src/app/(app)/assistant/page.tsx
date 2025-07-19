import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AssistantPage() {
  const conversations = [
    {
      id: 1,
      type: "user",
      message: "Help me create a proposal for a new client who needs website redesign services.",
      timestamp: "2 minutes ago"
    },
    {
      id: 2,
      type: "assistant",
      message: "I'll help you create a comprehensive website redesign proposal. Here's a structured approach:\n\n1. **Project Overview**: Start with a brief summary of the client's needs\n2. **Scope of Work**: Detail the specific services you'll provide\n3. **Timeline**: Include milestones and delivery dates\n4. **Investment**: Break down costs clearly\n5. **Next Steps**: Outline the proposal process\n\nWould you like me to help you draft any specific section?",
      timestamp: "1 minute ago"
    },
    {
      id: 3,
      type: "user",
      message: "Can you help me write the project overview section?",
      timestamp: "Just now"
    },
    {
      id: 4,
      type: "assistant",
      message: "Here's a professional project overview for your website redesign proposal:\n\n**Project Overview**\n\nWe understand that [Client Name] is seeking to modernize their online presence with a comprehensive website redesign that reflects their brand evolution and business growth. This project will transform their current website into a modern, user-friendly platform that drives engagement, improves conversion rates, and positions them as a leader in their industry.\n\nOur approach combines strategic design thinking with technical excellence to deliver a website that not only looks stunning but also performs exceptionally well across all devices and platforms.",
      timestamp: "Just now"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-600 mt-2">
          Get help with proposals, client communication, and business strategy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg h-[600px] flex flex-col">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                ClientFlow Assistant
              </CardTitle>
              <CardDescription>
                Ask me anything about client management, proposals, or business strategy
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div key={conversation.id} className={`flex ${conversation.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${conversation.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-4`}>
                      <div className="whitespace-pre-wrap text-sm">{conversation.message}</div>
                      <div className={`text-xs mt-2 ${conversation.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {conversation.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Create a client proposal",
                "Draft follow-up email",
                "Generate meeting agenda",
                "Write project timeline",
                "Create invoice template",
                "Draft contract terms"
              ].map((action) => (
                <button
                  key={action}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  {action}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>
                Your recent AI interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Proposal for TechStart", date: "2 hours ago" },
                { title: "Email template for follow-ups", date: "1 day ago" },
                { title: "Contract negotiation tips", date: "2 days ago" },
                { title: "Client onboarding process", date: "3 days ago" }
              ].map((conversation) => (
                <div key={conversation.title} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{conversation.title}</p>
                    <p className="text-xs text-gray-500">{conversation.date}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>AI Capabilities</CardTitle>
              <CardDescription>
                What I can help you with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "📝 Writing proposals and contracts",
                "📧 Drafting professional emails",
                "📊 Creating project timelines",
                "💰 Pricing strategy advice",
                "🎯 Client communication tips",
                "📈 Business growth strategies"
              ].map((capability) => (
                <div key={capability} className="flex items-center text-sm text-gray-600">
                  <span>{capability}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 