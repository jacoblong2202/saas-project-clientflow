"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTimelineEvents, createTimelineEvent, updateTimelineEvent } from "@/lib/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Loader2,
  AlertCircle,
  Plus,
  X,
  Check,
  Circle,
  Edit3,
  Save,
  Calendar,
} from 'lucide-react';

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  is_checked: boolean;
}

interface ProjectPhase {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'upcoming';
  startDate: string;
  endDate: string;
  progress: number;
}

export default function ProjectTimelinePage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  
  // Timeline overview state
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [overviewStats, setOverviewStats] = useState({
    completedEvents: 3,
    totalEvents: 12,
    daysRemaining: 2,
    progressPercentage: 25
  });
  const [phases, setPhases] = useState<ProjectPhase[]>([
    {
      id: '1',
      name: 'Planning',
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-01-07',
      progress: 100
    },
    {
      id: '2',
      name: 'Development',
      status: 'current',
      startDate: '2024-01-08',
      endDate: '2024-01-28',
      progress: 60
    },
    {
      id: '3',
      name: 'Review',
      status: 'upcoming',
      startDate: '2024-01-29',
      endDate: '2024-02-04',
      progress: 0
    },
    {
      id: '4',
      name: 'Launch',
      status: 'upcoming',
      startDate: '2024-02-05',
      endDate: '2024-02-11',
      progress: 0
    }
  ]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getTimelineEvents(projectId);
      
      if (error) throw error;
      
      // Order by created_at ASC (oldest first)
      const sortedEvents = (data || []).sort((a: any, b: any) => 
        new Date(a.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setEvents(sortedEvents);
      
      // Update stats based on real data
      const completedCount = sortedEvents.filter(e => e.is_checked).length;
      const totalCount = sortedEvents.length;
      setOverviewStats(prev => ({
        ...prev,
        completedEvents: completedCount,
        totalEvents: totalCount,
        progressPercentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
      }));
    } catch (e: any) {
      setError(e.message || "Failed to load timeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchEvents();
  }, [projectId]);

  const handleAddEvent = async () => {
    if (!newEventTitle.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await createTimelineEvent({
        project_id: projectId,
        title: newEventTitle.trim(),
        description: newEventDescription.trim() || undefined,
        is_checked: false,
      });

      if (error) throw error;

      // Close modal and clear form
      setIsModalOpen(false);
      setNewEventTitle('');
      setNewEventDescription('');
      
      // Refetch events to show the new one
      await fetchEvents();
    } catch (e: any) {
      setError(e.message || "Failed to add event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleEvent = async (eventId: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      // Optimistically update local state immediately
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, is_checked: !event.is_checked }
          : event
      ));

      // Update database
      const { error } = await updateTimelineEvent(eventId, {
        is_checked: !event.is_checked,
      });

      if (error) {
        // Revert optimistic update on error
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, is_checked: event.is_checked }
            : event
        ));
        throw error;
      }
      
      // Update stats
      const completedCount = events.filter(e => e.id !== eventId ? e.is_checked : !event.is_checked).length;
      const totalCount = events.length;
      setOverviewStats(prev => ({
        ...prev,
        completedEvents: completedCount,
        progressPercentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
      }));
    } catch (e: any) {
      setError(e.message || "Failed to update event");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewEventTitle('');
    setNewEventDescription('');
  };

  const handleSaveOverview = () => {
    setIsEditingOverview(false);
    // TODO: Save to database
  };

  const getPhaseColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500';
      default: return 'bg-gray-200';
    }
  };

  const getPhaseTextColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-gray-900';
      case 'current': return 'text-gray-900';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Project Timeline Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Project Overview</h2>
            <button
              onClick={() => setIsEditingOverview(!isEditingOverview)}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              {isEditingOverview ? (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  Edit
                </>
              )}
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Project Progress</span>
              </div>
              {isEditingOverview ? (
                <input
                  type="number"
                  value={overviewStats.progressPercentage}
                  onChange={(e) => setOverviewStats(prev => ({ ...prev, progressPercentage: parseInt(e.target.value) || 0 }))}
                  className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 w-20"
                  min="0"
                  max="100"
                />
              ) : (
                <span className="text-sm text-gray-500">{overviewStats.progressPercentage}% Complete</span>
              )}
            </div>
            
            {/* Horizontal Timeline */}
            <div className="relative">
              <div className="flex items-center justify-between">
                {phases.map((phase, index) => (
                  <div key={phase.id} className="flex flex-col items-center">
                    <div className={`w-8 h-8 ${getPhaseColor(phase.status)} rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isEditingOverview ? 'cursor-pointer hover:opacity-80' : ''
                    }`}>
                      {phase.status === 'completed' ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    {isEditingOverview ? (
                      <input
                        type="text"
                        value={phase.name}
                        onChange={(e) => setPhases(prev => prev.map(p => 
                          p.id === phase.id ? { ...p, name: e.target.value } : p
                        ))}
                        className="text-xs font-medium text-gray-900 text-center bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    ) : (
                      <span className={`text-xs font-medium ${getPhaseTextColor(phase.status)}`}>
                        {phase.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {dayjs(phase.startDate).format('MMM D')} - {dayjs(phase.endDate).format('MMM D')}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Connecting lines */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
                {phases.map((phase, index) => (
                  <div
                    key={phase.id}
                    className={`absolute h-full ${
                      phase.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{
                      left: `${(index / (phases.length - 1)) * 100}%`,
                      width: index < phases.length - 1 ? `${100 / (phases.length - 1)}%` : '0%'
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Timeline Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                {isEditingOverview ? (
                  <input
                    type="number"
                    value={overviewStats.completedEvents}
                    onChange={(e) => setOverviewStats(prev => ({ ...prev, completedEvents: parseInt(e.target.value) || 0 }))}
                    className="text-lg font-semibold text-gray-900 text-center bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-16"
                  />
                ) : (
                  <div className="text-lg font-semibold text-gray-900">{overviewStats.completedEvents}</div>
                )}
                <div className="text-xs text-gray-500">Events Completed</div>
              </div>
              <div className="text-center">
                {isEditingOverview ? (
                  <input
                    type="number"
                    value={overviewStats.totalEvents}
                    onChange={(e) => setOverviewStats(prev => ({ ...prev, totalEvents: parseInt(e.target.value) || 0 }))}
                    className="text-lg font-semibold text-gray-900 text-center bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-16"
                  />
                ) : (
                  <div className="text-lg font-semibold text-gray-900">{overviewStats.totalEvents}</div>
                )}
                <div className="text-xs text-gray-500">Total Events</div>
              </div>
              <div className="text-center">
                {isEditingOverview ? (
                  <input
                    type="number"
                    value={overviewStats.daysRemaining}
                    onChange={(e) => setOverviewStats(prev => ({ ...prev, daysRemaining: parseInt(e.target.value) || 0 }))}
                    className="text-lg font-semibold text-gray-900 text-center bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-16"
                  />
                ) : (
                  <div className="text-lg font-semibold text-gray-900">{overviewStats.daysRemaining}</div>
                )}
                <div className="text-xs text-gray-500">Days Remaining</div>
              </div>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-600 mb-8">Add your first timeline item below.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Event
              </button>
            </div>
          </div>
        ) : (
          /* Timeline Events */
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Project Timeline</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Event
              </button>
            </div>
            
            {/* Vertical Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {events.map((event, idx) => (
                  <div key={event.id} className="relative flex items-start gap-4">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        event.is_checked 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-white border-blue-500'
                      }`}></div>
                    </div>
                    
                    {/* Event content */}
                    <div className={`flex-1 bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-opacity ${
                      event.is_checked ? 'opacity-50' : ''
                    }`}>
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleEvent(event.id)}
                          className={`flex-shrink-0 mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            event.is_checked 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {event.is_checked && <Check className="h-3 w-3" />}
                        </button>
                        
                        {/* Event details */}
                        <div className="flex-1">
                          <div className={`font-medium text-gray-900 text-lg ${
                            event.is_checked ? 'line-through text-gray-500' : ''
                          }`}>
                            {event.title}
                          </div>
                          
                          {event.description && (
                            <div className={`text-gray-600 text-sm mt-1 ${
                              event.is_checked ? 'line-through text-gray-400' : ''
                            }`}>
                              {event.description}
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-400 mt-2">
                            {dayjs(event.created_at).fromNow()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Timeline Event</h3>
              <button
                onClick={handleCloseModal}
                disabled={submitting}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  disabled={submitting}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="Enter event description"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!newEventTitle.trim() || submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Event'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 