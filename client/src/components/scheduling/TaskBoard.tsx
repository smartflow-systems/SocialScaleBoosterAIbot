import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Instagram, Facebook, Video, MessageCircle, Trash2, Clock, CheckCircle, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PostData } from './ComposePosts';

type TaskStatus = 'draft' | 'scheduled' | 'sent' | 'failed';

interface TaskBoardProps {
  tasks: PostData[];
  onSchedule?: (taskId: string, scheduledTime: Date) => void;
  onDelete?: (taskId: string) => void;
  onMarkSent?: (taskId: string) => void;
}

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Video,
  threads: MessageCircle,
};

const statusColors = {
  scheduled: 'bg-mint/20 border-mint/40 text-mint',
  draft: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  sent: 'bg-green-500/20 border-green-500/40 text-green-400',
  failed: 'bg-red-500/20 border-red-500/40 text-red-400',
};

const statusDotColors = {
  scheduled: 'bg-mint shadow-[0_0_8px_rgba(152,251,152,0.8)]',
  draft: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]',
  sent: 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]',
  failed: 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]',
};

export default function TaskBoard({ tasks = [], onSchedule, onDelete, onMarkSent }: TaskBoardProps) {
  const [activeTab, setActiveTab] = useState<TaskStatus>('scheduled');
  const [selectedTask, setSelectedTask] = useState<PostData | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('12:00');

  const filteredTasks = tasks.filter(task => task.status === activeTab);

  const handleScheduleTask = () => {
    if (!selectedTask?.id) return;

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(hours, minutes);

    if (scheduledDateTime < new Date()) {
      alert('Please select a future time');
      return;
    }

    onSchedule?.(selectedTask.id, scheduledDateTime);
    setShowScheduleDialog(false);
    setSelectedTask(null);
  };

  const getMetadata = (task: PostData) => {
    if (task.scheduledAt) {
      const date = new Date(task.scheduledAt);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${task.autoPost ? 'Auto' : 'Manual'}`;
    }
    return `— • ${task.autoPost ? 'Auto' : 'Manual'}`;
  };

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <div className="glass-card p-2">
        <div className="flex gap-2">
          {(['scheduled', 'draft', 'sent'] as TaskStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium
                transition-all duration-200
                ${activeTab === status
                  ? statusColors[status]
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                }
              `}
            >
              <div className={`w-2 h-2 rounded-full ${statusDotColors[status]}`}></div>
              <span className="capitalize">{status}</span>
              <Badge variant="outline" className="ml-1">
                {tasks.filter(t => t.status === status).length}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-gray-500 text-lg">No {activeTab} posts yet</div>
            <div className="text-gray-600 text-sm mt-2">
              {activeTab === 'draft' && 'Save drafts to come back to them later'}
              {activeTab === 'scheduled' && 'Schedule posts to automate your content'}
              {activeTab === 'sent' && 'Completed posts will appear here'}
            </div>
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const PlatformIcon = platformIcons[task.platform];
            return (
              <div key={task.id || index} className="glass-card p-5 hover:border-gold/40 transition-all">
                <div className="flex items-start justify-between gap-4">
                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <PlatformIcon className="w-5 h-5 text-gold flex-shrink-0" />
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gold uppercase text-sm">
                          {task.kind}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-sm capitalize">
                          @{task.platform}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {getMetadata(task)}
                    </div>

                    <p className="text-white line-clamp-2 mb-3">
                      {task.content || <span className="text-gray-500 italic">(no caption)</span>}
                    </p>

                    {(task.mediaUrl || task.linkUrl || task.firstComment) && (
                      <div className="flex flex-wrap gap-2">
                        {task.mediaUrl && (
                          <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-400">
                            📷 Media
                          </Badge>
                        )}
                        {task.linkUrl && (
                          <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-400">
                            🔗 Link
                          </Badge>
                        )}
                        {task.firstComment && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 border-green-500/30 text-green-400">
                            💬 Comment
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {task.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedTask(task);
                          setShowScheduleDialog(true);
                        }}
                        className="bg-gold text-black hover:bg-yellow-500 whitespace-nowrap"
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Schedule
                      </Button>
                    )}
                    {task.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => task.id && onMarkSent?.(task.id)}
                        className="bg-green-500 text-white hover:bg-green-600 whitespace-nowrap"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Sent
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => task.id && onDelete?.(task.id)}
                      className="whitespace-nowrap"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="bg-[#0D0D0D] border-gold/30">
          <DialogHeader>
            <DialogTitle className="text-gold">Schedule Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border border-gold/20 bg-black/40"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
            <div className="space-y-2">
              <Label>Select Time</Label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-black/40 border-gold/20 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleDialog(false)}
              className="border-gold/30 text-gold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleScheduleTask}
              className="bg-gold text-black hover:bg-yellow-500"
            >
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
