"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, TrendingUp, Timer, Edit2, GripVertical, Trash2, Palette, ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface PipelineItem {
  id: number;
  name: string;
  company: string;
  email: string;
  value: string;
  date?: string;
  status?: string;
}

// Update column type to include bg and badge
interface PipelineColumn {
  id: string;
  title: string;
  color: string;
  items: PipelineItem[];
  bg?: string;
  badge?: string;
}

// Helper for animated numbers
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number | string, prefix?: string, suffix?: string }) {
  const [display, setDisplay] = useState(typeof value === 'number' ? 0 : value);
  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 800;
      const step = Math.ceil(end / (duration / 16));
      let current = start;
      const interval = setInterval(() => {
        current += step;
        if (current >= end) {
          setDisplay(end);
          clearInterval(interval);
        } else {
          setDisplay(current);
        }
      }, 16);
      return () => clearInterval(interval);
    } else {
      setDisplay(value);
    }
  }, [value]);
  return <span>{prefix}{typeof display === 'number' ? display.toLocaleString() : display}{suffix}</span>;
}

// Move defaultColumns and defaultColumnOrder above PipelinePage
const defaultColumns: { [key: string]: PipelineColumn } = {
  leads: {
    id: 'leads',
    title: 'Leads',
    color: 'bg-yellow-100 text-yellow-800',
    items: [
      { id: 1, name: 'Sarah Johnson', company: 'TechStart Inc', email: 'sarah@techstart.com', value: '£5,000' },
      { id: 2, name: 'Mike Chen', company: 'Design Studio', email: 'mike@designstudio.com', value: '£3,500' },
      { id: 3, name: 'Emily Davis', company: 'Marketing Pro', email: 'emily@marketingpro.com', value: '£7,200' },
      { id: 4, name: 'Alex Rodriguez', company: 'Consulting Co', email: 'alex@consulting.com', value: '£4,800' }
    ],
    bg: 'bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  discovery: {
    id: 'discovery',
    title: 'Discovery',
    color: 'bg-blue-100 text-blue-800',
    items: [
      { id: 5, name: 'David Wilson', company: 'StartupXYZ', email: 'david@startupxyz.com', value: '£6,000', date: 'Today 2:00 PM' },
      { id: 6, name: 'Lisa Thompson', company: 'Agency Plus', email: 'lisa@agencyplus.com', value: '£4,200', date: 'Tomorrow 10:00 AM' },
      { id: 7, name: 'Robert Kim', company: 'Digital Solutions', email: 'robert@digitalsolutions.com', value: '£8,500', date: 'Tomorrow 3:30 PM' }
    ],
    bg: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-800'
  },
  clients: {
    id: 'clients',
    title: 'Clients',
    color: 'bg-green-100 text-green-800',
    items: [
      { id: 8, name: 'Jennifer Lee', company: 'Acme Corp', email: 'jennifer@acme.com', value: '£12,000', status: 'Active' },
      { id: 9, name: 'Tom Anderson', company: 'Global Tech', email: 'tom@globaltech.com', value: '£9,500', status: 'Active' },
      { id: 10, name: 'Maria Garcia', company: 'Creative Agency', email: 'maria@creativeagency.com', value: '£15,000', status: 'Active' },
      { id: 11, name: 'James Brown', company: 'Innovation Labs', email: 'james@innovationlabs.com', value: '£11,200', status: 'Active' },
      { id: 12, name: 'Anna White', company: 'Growth Co', email: 'anna@growthco.com', value: '£7,800', status: 'Active' }
    ],
    bg: 'bg-green-50',
    badge: 'bg-green-100 text-green-800'
  }
};
const defaultColumnOrder = ['leads', 'discovery', 'clients'];

export default function PipelinePage() {
  // REMOVE stages state, use columns/columnOrder only
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newStage, setNewStage] = useState('');
  // Editable title state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  // Add Lead modal state
  const [showAddLead, setShowAddLead] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadValue, setLeadValue] = useState("");
  const [leadStage, setLeadStage] = useState(defaultColumnOrder[0]);
  const [formError, setFormError] = useState<string | null>(null);
  // Add per-column add lead modal state
  const [showColumnAddLead, setShowColumnAddLead] = useState<string | null>(null);
  // Add delete column modal state
  const [deleteColumnId, setDeleteColumnId] = useState<string | null>(null);
  // Add color edit modal state
  const [editColorColumnId, setEditColorColumnId] = useState<string | null>(null);
  const pastelOptions = [
    { id: 'bg-yellow-50', label: 'Yellow', badge: 'bg-yellow-100 text-yellow-800' },
    { id: 'bg-blue-50', label: 'Blue', badge: 'bg-blue-100 text-blue-800' },
    { id: 'bg-green-50', label: 'Green', badge: 'bg-green-100 text-green-800' },
    { id: 'bg-pink-50', label: 'Pink', badge: 'bg-pink-100 text-pink-800' },
    { id: 'bg-purple-50', label: 'Purple', badge: 'bg-purple-100 text-purple-800' },
    { id: 'bg-gray-50', label: 'Gray', badge: 'bg-gray-100 text-gray-800' },
  ];

  // Columns and order state
  const [columns, setColumns] = useState<{ [key: string]: PipelineColumn }>(defaultColumns);
  const [columnOrder, setColumnOrder] = useState<string[]>(defaultColumnOrder);

  // Move getPastelBg and getBadgeColor inside the component
  function getPastelBg(columnId: string, colorOverride?: string) {
    const color = colorOverride || columns[columnId]?.bg;
    if (color) return color;
    switch (columnId) {
      case 'leads':
        return 'bg-yellow-50';
      case 'discovery':
        return 'bg-blue-50';
      case 'clients':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  }
  function getBadgeColor(columnId: string, badgeOverride?: string) {
    const badge = badgeOverride || columns[columnId]?.badge;
    if (badge) return badge;
    switch (columnId) {
      case 'leads':
        return 'bg-yellow-100 text-yellow-800';
      case 'discovery':
        return 'bg-blue-100 text-blue-800';
      case 'clients':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function resetLeadForm() {
    setLeadName("");
    setLeadCompany("");
    setLeadEmail("");
    setLeadValue("");
    setLeadStage(columnOrder[0]);
    setFormError(null);
  }

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // On mount, update from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pipelineStages');
      if (saved) {
        setColumns(JSON.parse(saved));
      }
    }
  }, []);

  // Persist stages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pipelineStages', JSON.stringify(columns));
    }
  }, [columns]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Handle drag end for columns (initial, cards next)
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = columnOrder.findIndex(s => s === active.id);
    const newIndex = columnOrder.findIndex(s => s === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
      // TODO: Save to backend
    }
  }

  // Add new column
  function addStage() {
    if (newStage.trim()) {
      setColumnOrder((prevStages: string[]) => [
        ...prevStages,
        newStage.toLowerCase().replace(/\s+/g, '-')
      ]);
      setColumns(prev => ({
        ...prev,
        [newStage.toLowerCase().replace(/\s+/g, '-')]: {
          id: newStage.toLowerCase().replace(/\s+/g, '-'),
          title: newStage,
          color: 'bg-gray-100 text-gray-800',
          items: [],
          bg: 'bg-gray-50',
          badge: 'bg-gray-100 text-gray-800'
        }
      }));
      setShowModal(false);
      setNewStage('');
      // localStorage handled by useEffect
    }
  }

  // Handle title edit save
  function saveTitle(stageId: string) {
    setColumns(prev => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        title: editingTitle
      }
    }));
    setEditingId(null);
    setEditingTitle("");
  }

  // Helper to get column id for a card
  function getColumnIdForCard(cardId: number) {
    for (const colId of columnOrder) {
      if (columns[colId].items.some(item => item.id === cardId)) {
        return colId;
      }
    }
    return null;
  }

  function handleDeleteColumn(columnId: string) {
    setColumns(prev => {
      const newCols = { ...prev };
      delete newCols[columnId];
      return newCols;
    });
    setColumnOrder(prev => prev.filter(id => id !== columnId));
    setDeleteColumnId(null);
  }

  // --- Card DnD ---
  function onDragEnd(result: DropResult) {
    const { source, destination, type, draggableId } = result;
    if (!destination) return;
    if (type === 'column') {
      const newOrder = Array.from(columnOrder);
      const [moved] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, moved);
      setColumnOrder(newOrder);
      return;
    }
    if (type === 'card') {
      const sourceColId = source.droppableId;
      const destColId = destination.droppableId;
      if (!columns[sourceColId] || !columns[destColId]) return;
      if (sourceColId === destColId && source.index === destination.index) return;
      // Remove from source
      const sourceItems = Array.from(columns[sourceColId].items);
      const [card] = sourceItems.splice(source.index, 1);
      // Insert into dest
      const destItems = Array.from(columns[destColId].items);
      destItems.splice(destination.index, 0, card);
      setColumns(prev => ({
        ...prev,
        [sourceColId]: { ...prev[sourceColId], items: sourceItems },
        [destColId]: { ...prev[destColId], items: destItems }
      }));
      return;
    }
  }

  // --- Add Lead Modal Logic ---
  function openAddLeadModal(columnId?: string) {
    if (columnId) {
      setShowColumnAddLead(columnId);
    } else {
      setShowAddLead(true);
    }
    resetLeadForm();
    setLeadStage(columnId || columnOrder[0]);
  }
  function closeAddLeadModal() {
    setShowAddLead(false);
    setShowColumnAddLead(null);
    resetLeadForm();
  }
  function handleAddLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadName.trim() || !leadCompany.trim() || !leadEmail.trim() || !leadValue.trim()) {
      setFormError("All fields are required.");
      return;
    }
    if (!validateEmail(leadEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    // Create new card object
    const newId = Math.max(0, ...Object.values(columns).flatMap(s => s.items.map(i => i.id))) + 1;
    const newCard: PipelineItem = {
      id: newId,
      name: leadName,
      company: leadCompany,
      email: leadEmail,
      value: `£${Number(leadValue).toLocaleString()}`
    };
    setColumns(prev => ({
      ...prev,
      [leadStage]: {
        ...prev[leadStage],
        items: [...prev[leadStage].items, newCard]
      }
    }));
    closeAddLeadModal();
  }

  // Add move column left/right handlers
  function moveColumnLeft(columnId: string) {
    setColumnOrder(prev => {
      const idx = prev.indexOf(columnId);
      if (idx > 0) {
        const newOrder = [...prev];
        [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
        return newOrder;
      }
      return prev;
    });
  }
  function moveColumnRight(columnId: string) {
    setColumnOrder(prev => {
      const idx = prev.indexOf(columnId);
      if (idx < prev.length - 1) {
        const newOrder = [...prev];
        [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
        return newOrder;
      }
      return prev;
    });
  }

  // --- Pipeline Overview Stats (dynamic) ---
  const allItems = Object.values(columns).flatMap(col => col.items);
  const totalProspects = allItems.length;
  const pipelineValue = allItems.reduce((sum, item) => {
    // Extract number from value string (e.g., '£5,000')
    const num = parseFloat(item.value.replace(/[^\d.]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const clients = columns['clients']?.items || [];
  const conversionRate = totalProspects > 0 ? (clients.length / totalProspects) * 100 : 0;
  function formatGBP(value: number) {
    return '£' + value.toLocaleString('en-GB', { maximumFractionDigits: 0 });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-gray-600 mt-2">
            Track your leads and manage your sales process
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <Dialog open={showAddLead} onOpenChange={setShowAddLead}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" variant="default" size="sm">
                <Plus className="w-4 h-4" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogDescription>Fill in the details to add a new lead to your pipeline.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    className="w-full border border-gray-200 rounded px-3 py-2"
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input
                    className="w-full border border-gray-200 rounded px-3 py-2"
                    value={leadCompany}
                    onChange={e => setLeadCompany(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    className="w-full border border-gray-200 rounded px-3 py-2"
                    type="email"
                    value={leadEmail}
                    onChange={e => setLeadEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deal Value (£)</label>
                  <input
                    className="w-full border border-gray-200 rounded px-3 py-2"
                    type="number"
                    min="0"
                    value={leadValue}
                    onChange={e => setLeadValue(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stage</label>
                  <select
                    className="w-full border border-gray-200 rounded px-3 py-2"
                    value={leadStage}
                    onChange={e => setLeadStage(e.target.value)}
                  >
                    {columnOrder.map(stageId => (
                      <option key={stageId} value={stageId}>{columns[stageId].title}</option>
                    ))}
                  </select>
                </div>
                {formError && <div className="text-red-600 text-sm">{formError}</div>}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Add Lead</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button className="flex items-center gap-2" variant="outline" size="sm" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Add Column
          </Button>
        </div>
      </div>

      {/* Pipeline Overview Card (moved to top) */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="grid grid-cols-4 md:grid-cols-4 gap-2">
          <div className="flex items-center gap-2 p-3 rounded-lg">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Total Prospects</div>
              <div className="text-xl font-semibold text-neutral-800"><AnimatedNumber value={totalProspects} /></div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Pipeline Value</div>
              <div className="text-xl font-semibold text-neutral-800"><AnimatedNumber value={formatGBP(pipelineValue)} /></div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
              <div className="text-xl font-semibold text-neutral-800"><AnimatedNumber value={conversionRate.toFixed(1)} suffix="%" /></div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Avg. Sales Cycle</div>
              <div className="text-xl font-semibold text-neutral-800">12.5 days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <div
              className="flex gap-4 overflow-x-auto"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {columnOrder.map((columnId, index) => {
                const column = columns[columnId];
                return (
                  <Draggable draggableId={column.id} index={index} key={column.id}>
                    {(dragProvided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        className={`min-w-[300px] flex-grow max-w-full transition-transform duration-200`}
                        data-column-id={column.id}
                      >
                        {/* Card wrapper for pastel bg */}
                        <div className={`rounded-xl p-0.5 sm:p-1.5 h-full ${getPastelBg(column.id, column.bg)} transition`}>
                          <div className="space-y-4 h-full">
                            {/* Column Header (drag handle) */}
                            <div
                              className="flex items-center justify-between group hover:bg-muted/10 transition rounded-t px-3 py-2 cursor-grab active:cursor-grabbing"
                              {...dragProvided.dragHandleProps}
                            >
                              <div className="flex items-center space-x-2 min-w-0">
                                {/* Move left button */}
                                <button
                                  type="button"
                                  className={`p-1 rounded hover:bg-muted/20 transition ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}`}
                                  onClick={() => moveColumnLeft(column.id)}
                                  disabled={index === 0}
                                  aria-label="Move column left"
                                >
                                  <ArrowLeft className="w-4 h-4" />
                                </button>
                                {/* Move right button */}
                                <button
                                  type="button"
                                  className={`p-1 rounded hover:bg-muted/20 transition ${index === columnOrder.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}`}
                                  onClick={() => moveColumnRight(column.id)}
                                  disabled={index === columnOrder.length - 1}
                                  aria-label="Move column right"
                                >
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                                <GripVertical className="w-4 h-4 text-muted-foreground mr-1 shrink-0" />
                                {/* Removed top title and edit icon here */}
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(column.id, column.badge)} shrink-0`}>{column.items.length}</span>
                              </div>
                              {/* Responsive actions: show inline if wide, else collapse to dropdown */}
                              <div className="flex items-center gap-1">
                                <div className="hidden md:flex gap-1">
                                  {/* Edit color button */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-1"
                                    onClick={() => setEditColorColumnId(column.id)}
                                    aria-label="Edit column color"
                                  >
                                    <Palette className="w-4 h-4" />
                                  </Button>
                                  {/* Per-column Add Lead button */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-2"
                                    onClick={() => openAddLeadModal(column.id)}
                                    aria-label="Add lead to column"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                  {/* Delete column button */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-1 text-red-500 hover:bg-red-100"
                                    onClick={() => setDeleteColumnId(column.id)}
                                    aria-label="Delete column"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                {/* Dropdown for small screens or crowded columns */}
                                <div className="md:hidden">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" aria-label="More actions">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => setEditColorColumnId(column.id)}>
                                        <Palette className="w-4 h-4 mr-2" /> Edit Color
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => openAddLeadModal(column.id)}>
                                        <Plus className="w-4 h-4 mr-2" /> Add Lead
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => setDeleteColumnId(column.id)} className="text-red-500">
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete Column
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                            {/* Column Name below header buttons (now only editable here, larger font, no pencil in header) */}
                            <div
                              className="w-full flex justify-center mt-1 mb-2 group/colname relative"
                            >
                              {editingId === column.id ? (
                                <input
                                  className="text-xl font-bold text-neutral-700 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-white px-1 py-0.5 min-w-[80px] max-w-[90%] text-center truncate"
                                  value={editingTitle}
                                  autoFocus
                                  onChange={e => setEditingTitle(e.target.value)}
                                  onBlur={() => saveTitle(column.id)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                      saveTitle(column.id);
                                    } else if (e.key === 'Escape') {
                                      setEditingId(null);
                                      setEditingTitle("");
                                    }
                                  }}
                                  style={{margin: 0}}
                                />
                              ) : (
                                <span
                                  className="block text-xl font-bold text-neutral-700 truncate max-w-[90%] text-center cursor-pointer relative group-hover/colname:underline"
                                  title={column.title}
                                  tabIndex={0}
                                  onClick={() => {
                                    setEditingId(column.id);
                                    setEditingTitle(column.title);
                                  }}
                                  onFocus={() => {
                                    setEditingId(column.id);
                                    setEditingTitle(column.title);
                                  }}
                                >
                                  {column.title}
                                </span>
                              )}
                            </div>
                            {/* Column Cards */}
                            <Droppable droppableId={column.id} type="card">
                              {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
                                <div
                                  ref={dropProvided.innerRef}
                                  {...dropProvided.droppableProps}
                                  className={`space-y-3 min-h-[40px] transition-all duration-200 ease-in-out ${dropSnapshot.isDraggingOver ? 'ring-2 ring-dashed ring-primary bg-primary/5 rounded-lg' : ''}`}
                                  data-stage-id={column.id}
                                >
                                  {column.items.map((item: PipelineItem, cardIdx: number) => (
                                    <Draggable draggableId={`card-${item.id}`} index={cardIdx} key={item.id}>
                                      {(cardProvided: DraggableProvided, cardSnapshot: DraggableStateSnapshot) => (
                                        <div
                                          ref={cardProvided.innerRef}
                                          {...cardProvided.draggableProps}
                                          {...cardProvided.dragHandleProps}
                                          className={`border-0 shadow-sm hover:shadow-md transition-shadow transition-transform duration-200 ease-in-out cursor-pointer bg-white rounded-lg ${cardSnapshot.isDragging ? 'scale-105 shadow-xl z-30' : ''}`}
                                        >
                                          <CardContent className="p-4">
                                            <div className="space-y-2">
                                              <div className="flex items-start justify-between">
                                                <div>
                                                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                  <div className="text-sm text-gray-500">{item.company}</div>
                                                </div>
                                                <div className="text-xs text-gray-400">{item.value}</div>
                                              </div>
                                              <div className="text-xs text-gray-400">{item.email}</div>
                                            </div>
                                          </CardContent>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {dropProvided.placeholder}
                                </div>
                              )}
                            </Droppable>
                            {/* Per-column Add Lead Modal */}
                            <Dialog open={showColumnAddLead === column.id} onOpenChange={open => !open && setShowColumnAddLead(null)}>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add New Lead</DialogTitle>
                                  <DialogDescription>Fill in the details to add a new lead to this column.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddLeadSubmit} className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                      className="w-full border border-gray-200 rounded px-3 py-2"
                                      value={leadName}
                                      onChange={e => setLeadName(e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Company</label>
                                    <input
                                      className="w-full border border-gray-200 rounded px-3 py-2"
                                      value={leadCompany}
                                      onChange={e => setLeadCompany(e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                      className="w-full border border-gray-200 rounded px-3 py-2"
                                      type="email"
                                      value={leadEmail}
                                      onChange={e => setLeadEmail(e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Deal Value (£)</label>
                                    <input
                                      className="w-full border border-gray-200 rounded px-3 py-2"
                                      type="number"
                                      min="0"
                                      value={leadValue}
                                      onChange={e => setLeadValue(e.target.value)}
                                      required
                                    />
                                  </div>
                                  {/* Hidden select to ensure correct column is used */}
                                  <input type="hidden" value={column.id} name="leadStage" />
                                  {formError && <div className="text-red-600 text-sm">{formError}</div>}
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button type="button" variant="ghost" onClick={closeAddLeadModal}>Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Add Lead</Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {/* Delete column confirmation dialog */}
        <Dialog open={!!deleteColumnId} onOpenChange={open => !open && setDeleteColumnId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Column</DialogTitle>
              <DialogDescription>Are you sure you want to delete this column? All leads in this column will be lost.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost" onClick={() => setDeleteColumnId(null)}>Cancel</Button>
              </DialogClose>
              <Button type="button" variant="destructive" onClick={() => handleDeleteColumn(deleteColumnId!)}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Edit color dialog */}
        <Dialog open={!!editColorColumnId} onOpenChange={open => !open && setEditColorColumnId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Column Color</DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-2 py-2">
              {pastelOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`rounded-lg px-3 py-2 border transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${getPastelBg(editColorColumnId!, opt.id)} ${columns[editColorColumnId!]?.bg === opt.id ? 'ring-2 ring-blue-500 border-blue-400' : 'border-gray-200'}`}
                  onClick={() => {
                    setColumns(prev => ({
                      ...prev,
                      [editColorColumnId!]: {
                        ...prev[editColorColumnId!],
                        bg: opt.id,
                        badge: opt.badge
                      }
                    }));
                    setEditColorColumnId(null);
                  }}
                  aria-label={`Set color ${opt.label}`}
                >
                  <span className={`inline-block w-4 h-4 rounded-full mr-2 align-middle ${opt.badge}`}></span>
                  {opt.label}
                  {columns[editColorColumnId!]?.bg === opt.id && <span className="ml-2 text-blue-600 font-bold">✓</span>}
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </DragDropContext>
      {/* Add Column Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Add New Column</h3>
            <input
              className="w-full border border-gray-200 rounded px-3 py-2 mb-4"
              placeholder="Column name"
              value={newStage}
              onChange={e => setNewStage(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={addStage}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 