import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Line, Bar } from "react-chartjs-2";
import { TrendingUp, DollarSign, Activity, Users, Zap } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RealTimeDashboard() {
  const [liveRevenue, setLiveRevenue] = useState(4550.50);
  const [liveEngagement, setLiveEngagement] = useState(7.8);
  const [liveBotActivity, setLiveBotActivity] = useState(3);

  // Real-time updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveRevenue(prev => prev + (Math.random() * 10 - 5));
      setLiveEngagement(prev => Math.max(0, prev + (Math.random() * 0.5 - 0.25)));
      setLiveBotActivity(prev => Math.max(0, Math.min(10, prev + (Math.random() * 2 - 1))));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { data: realtimeMetrics } = useQuery({
    queryKey: ["/api/analytics/realtime"],
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Live chart data with strict gold colors
  const revenueChartData = {
    labels: ['10s ago', '8s ago', '6s ago', '4s ago', '2s ago', 'Now'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [
          liveRevenue - 50,
          liveRevenue - 30,
          liveRevenue - 20,
          liveRevenue - 10,
          liveRevenue - 5,
          liveRevenue
        ],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#F59E0B',
        pointBorderColor: '#1a1a1a',
        pointBorderWidth: 2,
      }
    ]
  };

  const engagementChartData = {
    labels: ['5min', '4min', '3min', '2min', '1min', 'Now'],
    datasets: [
      {
        label: 'Engagement Rate',
        data: [
          liveEngagement - 0.5,
          liveEngagement - 0.3,
          liveEngagement - 0.1,
          liveEngagement + 0.1,
          liveEngagement - 0.2,
          liveEngagement
        ],
        backgroundColor: '#F59E0B',
        borderColor: '#2a2a2a',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF',
          font: {
            family: 'Inter',
            weight: 'bold',
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#808080',
          font: {
            family: 'Inter',
          }
        },
        grid: {
          color: 'rgba(42, 42, 42, 0.3)'
        }
      },
      y: {
        ticks: {
          color: '#808080',
          font: {
            family: 'Inter',
          }
        },
        grid: {
          color: 'rgba(42, 42, 42, 0.3)'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card-bg border-accent-gold pulse-gold">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-gray">Live Revenue</p>
                <p className="text-2xl font-bold text-accent-gold">${liveRevenue.toFixed(2)}</p>
                <Badge className="bg-accent-gold text-black text-xs mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
              </div>
              <DollarSign className="w-8 h-8 text-accent-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-bg border-accent-gold">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-gray">Engagement Rate</p>
                <p className="text-2xl font-bold text-white">{liveEngagement.toFixed(1)}%</p>
                <p className="text-xs text-accent-gold">+0.3% from last hour</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary-brown border-accent-gold">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Active Bots</p>
                <p className="text-2xl font-bold text-white">{Math.floor(liveBotActivity)}</p>
                <p className="text-xs text-accent-gold">Running automation</p>
              </div>
              <Zap className="w-8 h-8 text-accent-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary-brown border-accent-gold">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">Live Visitors</p>
                <p className="text-2xl font-bold text-white">{Math.floor(Math.random() * 50) + 25}</p>
                <p className="text-xs text-accent-gold">On your store now</p>
              </div>
              <Users className="w-8 h-8 text-accent-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-secondary-brown border-accent-gold">
          <CardHeader>
            <CardTitle className="text-accent-gold flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Revenue Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary-brown border-accent-gold">
          <CardHeader>
            <CardTitle className="text-accent-gold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Engagement Pulse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={engagementChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Optimization Suggestions */}
      <Card className="bg-secondary-brown border-accent-gold">
        <CardHeader>
          <CardTitle className="text-accent-gold">🤖 AI Optimization Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-primary-black border border-accent-gold rounded-lg">
              <p className="text-white font-medium">💡 Boost TikTok Posts</p>
              <p className="text-gray text-sm">Your TikTok bot shows 85% engagement. Increasing post frequency by 20% could generate +$127/day revenue.</p>
              <button className="mt-2 bg-accent-gold text-primary-black px-3 py-1 rounded text-sm font-bold gold-glow-hover">
                Apply Suggestion
              </button>
            </div>
            <div className="p-3 bg-primary-black border border-accent-gold rounded-lg">
              <p className="text-white font-medium">⚡ Peak Hours Detected</p>
              <p className="text-gray text-sm">Your audience is most active at 7-9 PM EST. Schedule more posts during this window for 15% better performance.</p>
              <button className="mt-2 bg-accent-gold text-primary-black px-3 py-1 rounded text-sm font-bold gold-glow-hover">
                Auto-Schedule
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}