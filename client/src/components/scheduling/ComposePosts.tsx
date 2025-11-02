import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Instagram, Facebook, Video, MessageCircle, Image, Link, Clock } from 'lucide-react';

type PostKind = 'post' | 'reel' | 'story';
type Platform = 'instagram' | 'facebook' | 'tiktok' | 'threads';

interface ComposePostsProps {
  onSaveDraft?: (post: PostData) => void;
  onSchedule?: (post: PostData, scheduledTime: Date) => void;
}

export interface PostData {
  id?: string;
  platform: Platform;
  kind: PostKind;
  content: string;
  mediaUrl?: string;
  autoPost: boolean;
  firstComment?: string;
  linkUrl?: string;
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
}

export default function ComposePosts({ onSaveDraft, onSchedule }: ComposePostsProps) {
  const [kind, setKind] = useState<PostKind>('post');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [autoPost, setAutoPost] = useState(true);
  const [firstComment, setFirstComment] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('12:00');

  const postKinds: { value: PostKind; label: string }[] = [
    { value: 'post', label: 'Post' },
    { value: 'reel', label: 'Reel' },
    { value: 'story', label: 'Story' }
  ];

  const platforms = [
    { value: 'instagram' as Platform, label: 'Instagram', icon: Instagram },
    { value: 'facebook' as Platform, label: 'Facebook', icon: Facebook },
    { value: 'tiktok' as Platform, label: 'TikTok', icon: Video },
    { value: 'threads' as Platform, label: 'Threads', icon: MessageCircle }
  ];

  const createPostData = (): PostData => ({
    platform,
    kind,
    content,
    mediaUrl: mediaUrl || undefined,
    autoPost,
    firstComment: firstComment || undefined,
    linkUrl: linkUrl || undefined,
    status: 'draft'
  });

  const handleSaveDraft = () => {
    onSaveDraft?.(createPostData());
    resetForm();
  };

  const handleSchedule = () => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(hours, minutes);

    if (scheduledDateTime < new Date()) {
      alert('Please select a future time');
      return;
    }

    const postData = createPostData();
    onSchedule?.(postData, scheduledDateTime);
    setShowSchedule(false);
    resetForm();
  };

  const resetForm = () => {
    setContent('');
    setMediaUrl('');
    setFirstComment('');
    setLinkUrl('');
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gold">Create Post</h3>
        <div className="flex gap-2">
          {platforms.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.value}
                onClick={() => setPlatform(p.value)}
                className={`p-2 rounded-lg transition-all ${
                  platform === p.value
                    ? 'bg-gold/20 text-gold border border-gold/40'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                }`}
                title={p.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Post Type Selector */}
      <div className="flex gap-2">
        {postKinds.map((pk) => (
          <button
            key={pk.value}
            onClick={() => setKind(pk.value)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              kind === pk.value
                ? 'bg-gold/20 text-gold border border-gold/40'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
            }`}
          >
            {pk.label}
          </button>
        ))}
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <Label className="text-gray-300">Caption</Label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your caption..."
          className="min-h-[120px] bg-black/40 border-gold/20 focus:border-gold/40 text-white placeholder:text-gray-500 resize-none"
        />
        <div className="text-xs text-gray-500">
          {content.length} characters
        </div>
      </div>

      {/* Media URL */}
      <div className="space-y-2">
        <Label className="text-gray-300 flex items-center gap-2">
          <Image className="w-4 h-4" />
          Media URL (optional)
        </Label>
        <Input
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="bg-black/40 border-gold/20 focus:border-gold/40 text-white placeholder:text-gray-500"
        />
      </div>

      {/* Auto Post Toggle */}
      <div className="flex items-center justify-between glass-card p-4">
        <div className="space-y-0.5">
          <Label className="text-gray-300">Automatic Posting</Label>
          <div className="text-xs text-gray-500">Post automatically at scheduled time</div>
        </div>
        <Switch
          checked={autoPost}
          onCheckedChange={setAutoPost}
          className="data-[state=checked]:bg-gold"
        />
      </div>

      {/* First Comment */}
      <div className="space-y-2">
        <Label className="text-gray-300">First Comment (optional)</Label>
        <Input
          value={firstComment}
          onChange={(e) => setFirstComment(e.target.value)}
          placeholder="Add a first comment..."
          className="bg-black/40 border-gold/20 focus:border-gold/40 text-white placeholder:text-gray-500"
        />
      </div>

      {/* Link URL */}
      <div className="space-y-2">
        <Label className="text-gray-300 flex items-center gap-2">
          <Link className="w-4 h-4" />
          Link URL (optional)
        </Label>
        <Input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://yourwebsite.com"
          className="bg-black/40 border-gold/20 focus:border-gold/40 text-white placeholder:text-gray-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gold/20">
        <Button
          onClick={handleSaveDraft}
          variant="outline"
          className="flex-1 border-gold/30 text-gold hover:bg-gold/10"
        >
          Save Draft
        </Button>

        <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
          <DialogTrigger asChild>
            <Button className="flex-1 bg-gradient-to-r from-gold to-yellow-600 text-black hover:from-yellow-600 hover:to-gold font-semibold">
              <Clock className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </DialogTrigger>
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
                onClick={() => setShowSchedule(false)}
                className="border-gold/30 text-gold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSchedule}
                className="bg-gold text-black hover:bg-yellow-500"
              >
                Confirm Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
