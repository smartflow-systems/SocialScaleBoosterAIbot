import { useState } from 'react';
import {
  Bot, Calendar, BarChart3, Store, Users, Zap, Settings,
  Plus, Instagram, Facebook,  MessageCircle, Video,
  Home, FileText, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Channel {
  id: string;
  platform: 'instagram' | 'facebook' | 'tiktok' | 'threads';
  handle: string;
  type: 'business' | 'personal';
  badge?: number;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarItem {
  label: string;
  icon: any;
  badge?: string | number;
  onClick?: () => void;
  active?: boolean;
  subtitle?: string;
}

interface SFSSidebarProps {
  onNavigate?: (section: string) => void;
  activeSection?: string;
  channels?: Channel[];
  onCreatePost?: () => void;
}

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Video,
  threads: MessageCircle,
};

export default function SFSSidebar({
  onNavigate,
  activeSection = 'bots',
  channels = [],
  onCreatePost
}: SFSSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const mainSections: SidebarSection[] = [
    {
      title: 'Create',
      items: [
        {
          label: 'Create Post',
          icon: Plus,
          badge: 'New',
          onClick: onCreatePost
        },
        {
          label: 'Calendar',
          icon: Calendar,
          badge: 'Soon',
          onClick: () => onNavigate?.('calendar')
        }
      ]
    },
    {
      title: 'Dashboard',
      items: [
        {
          label: 'My Bots',
          icon: Bot,
          onClick: () => onNavigate?.('bots'),
          active: activeSection === 'bots'
        },
        {
          label: 'Analytics',
          icon: BarChart3,
          onClick: () => onNavigate?.('analytics'),
          active: activeSection === 'analytics'
        },
        {
          label: 'Scheduling',
          icon: Calendar,
          onClick: () => onNavigate?.('scheduling'),
          active: activeSection === 'scheduling'
        },
        {
          label: 'Marketplace',
          icon: Store,
          onClick: () => onNavigate?.('marketplace'),
          active: activeSection === 'marketplace'
        }
      ]
    }
  ];

  const connectPlatforms = [
    { label: 'Instagram', icon: Instagram, platform: 'instagram' },
    { label: 'Facebook', icon: Facebook, platform: 'facebook' },
    { label: 'TikTok', icon: Video, platform: 'tiktok' },
    { label: 'Threads', icon: MessageCircle, platform: 'threads' }
  ];

  return (
    <div className={`h-screen bg-gradient-to-b from-black to-[#0D0D0D] border-r border-gold/20 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
      {/* Logo/Brand */}
      <div className="p-4 glass-card m-3 mb-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-mint shadow-[0_0_8px_rgba(152,251,152,0.8)]"></div>
          {!collapsed && (
            <>
              <span className="font-semibold text-white">Glass Circuit</span>
            </>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {/* Main Sections */}
        {mainSections.map((section, idx) => (
          <div key={idx} className="mb-4">
            {!collapsed && (
              <div className="px-3 mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {section.title}
                </span>
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <SidebarLink
                  key={itemIdx}
                  {...item}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Channels Section */}
        {channels.length > 0 && (
          <div className="mb-4">
            {!collapsed && (
              <div className="px-3 mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Channels
                </span>
              </div>
            )}
            <div className="space-y-1">
              {channels.map((channel) => {
                const Icon = platformIcons[channel.platform];
                return (
                  <SidebarLink
                    key={channel.id}
                    label={`@${channel.handle}`}
                    subtitle={channel.type}
                    icon={Icon}
                    badge={channel.badge}
                    collapsed={collapsed}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Connect Platforms */}
        <div className="mb-4">
          {!collapsed && (
            <div className="px-3 mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Connect
              </span>
            </div>
          )}
          <div className="space-y-1">
            {connectPlatforms.map((platform, idx) => (
              <SidebarLink
                key={idx}
                label={`Connect ${platform.label}`}
                icon={platform.icon}
                badge="Add"
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Footer/Settings */}
      <div className="p-3 border-t border-gold/20">
        <SidebarLink
          label="Settings"
          icon={Settings}
          collapsed={collapsed}
          onClick={() => onNavigate?.('settings')}
        />
      </div>
    </div>
  );
}

function SidebarLink({
  label,
  subtitle,
  icon: Icon,
  badge,
  onClick,
  active,
  collapsed
}: SidebarItem & { collapsed?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-all duration-200 group glass-card
        ${active
          ? 'bg-gradient-to-r from-gold/20 to-gold/10 border-gold/40 shadow-[0_0_12px_rgba(255,215,0,0.3)]'
          : 'hover:bg-white/5 hover:border-gold/30'
        }
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-gold' : 'text-gray-400'} group-hover:text-gold transition-colors`} />

      {!collapsed && (
        <>
          <div className="flex-1 text-left min-w-0">
            <div className={`text-sm font-medium truncate ${active ? 'text-gold' : 'text-white'}`}>
              {label}
            </div>
            {subtitle && (
              <div className="text-xs text-gray-500 truncate">
                {subtitle}
              </div>
            )}
          </div>

          {badge && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-0.5 bg-white/10 border-gold/30 text-gold"
            >
              {badge}
            </Badge>
          )}
        </>
      )}
    </button>
  );
}
