'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Info, HelpCircle, AlertTriangle, Heart, Activity, Calendar, Target, Droplets, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import HealthHeatmap from './HealthHeatmap';
import { DailySummary, WeeklyTrends } from '@/app/api/trends/route';

interface HealthTrendsProps {
  deviceId?: string;
  className?: string;
}

interface TrendDataPoint {
  date: string;
  healthScore: number;
  bristolScore: number;
  hydrationIndex: number;
  eventCount: number;
}

// Custom Tooltip Component
const InfoTooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [show, setShow] = useState(false);

  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine === '') return <div key={index} className="h-2"></div>;
      return <div key={index} className="text-xs whitespace-nowrap">{trimmedLine}</div>;
    });
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help inline-flex items-center gap-1"
      >
        {children}
      </div>
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 w-80">
          <div className="space-y-1">
            {formatContent(content)}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

function HealthTrends({ deviceId = 'all', className = '' }: HealthTrendsProps) {
  const [trendData, setTrendData] = useState<{
    dailySummaries: DailySummary[];
    weeklyTrends: WeeklyTrends[];
    overallStats: {
      totalDays: number;
      totalEvents: number;
      avgHealthScore: number;
      currentTrend: 'improving' | 'stable' | 'declining';
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7' | '30' | '90'>('30');
  const [selectedDay, setSelectedDay] = useState<DailySummary | null>(null);

  useEffect(() => {
    fetchTrendData();
  }, [selectedTimeRange, deviceId]);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        days: selectedTimeRange,
        deviceId: deviceId
      });

      const response = await fetch(`/api/trends?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trend data');
      }

      const data = await response.json();
      setTrendData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trend data');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getTrendColor = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'declining':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score >= 65) return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    if (score >= 35) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const formatChartData = (): TrendDataPoint[] => {
    if (!trendData?.dailySummaries) return [];

    return trendData.dailySummaries.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      healthScore: day.healthScore,
      bristolScore: day.avgBristolScore,
      hydrationIndex: day.avgHydrationIndex * 100, // Convert to percentage
      eventCount: day.eventCount
    }));
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 font-medium">Error loading health trends</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trendData) {
    return null;
  }

  const chartData = formatChartData();
  const latestWeek = trendData.weeklyTrends[trendData.weeklyTrends.length - 1];
  const currentWeek = new Date();
  const weekStart = new Date(currentWeek);
  weekStart.setDate(currentWeek.getDate() - currentWeek.getDay());

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Health Trends</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor digestive health patterns and trends
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as '7' | '30' | '90')}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Health Score</p>
                  <InfoTooltip content="Overall digestive health score (0-100) based on stool consistency, hydration, and absence of concerning symptoms.">
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </InfoTooltip>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${getHealthScoreColor(trendData.overallStats.avgHealthScore).split(' ')[0]}`}>
                    {Math.round(trendData.overallStats.avgHealthScore)}
                  </p>
                  <span className="text-sm text-gray-500">/100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Trend</p>
                  <InfoTooltip content="Trend direction based on recent health scores. Improving = getting better, Stable = consistent, Declining = needs attention.">
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </InfoTooltip>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(trendData.overallStats.currentTrend)}
                  <p className={`text-lg font-semibold capitalize ${getTrendColor(trendData.overallStats.currentTrend).split(' ')[0]}`}>
                    {trendData.overallStats.currentTrend}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                  <InfoTooltip content="Total number of bowel movements recorded in the selected time period. Helps track regularity and patterns.">
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </InfoTooltip>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {trendData.overallStats.totalEvents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Frequency</p>
                  <InfoTooltip content="🚽 Daily Bowel Movement Frequency: Normal range is 1-3 times per day. Less than 1 may indicate constipation; more than 3 could suggest diarrhea or rapid transit. Regular patterns are key to digestive health!">
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </InfoTooltip>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(trendData.overallStats.totalEvents / trendData.overallStats.totalDays).toFixed(1)}/day
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {latestWeek?.alerts && latestWeek.alerts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Health Alerts</h3>
                <InfoTooltip content="Automatically detected health concerns based on patterns in your data. These alerts may indicate issues that need medical attention.">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </InfoTooltip>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {latestWeek.alerts.map((alert, index) => (
                <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 capitalize">
                    {alert.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score Trend */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Health Score Trend</h3>
            <InfoTooltip content={`💚 Health Score Guide (0-100)

🟢 80-100: EXCELLENT ✓
🔵 65-79: GOOD ✓
🟡 50-64: FAIR ⚠️
🟠 35-49: POOR ⚠️
🔴 0-34: CRITICAL ❌

💡 Combines stool consistency,
   hydration, and health flags`}>
              <div className="cursor-help">
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </div>
            </InfoTooltip>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'healthScore') {
                      const getHealthCategory = (score: number) => {
                        if (score >= 80) return {
                          label: 'Excellent',
                          color: '#10b981',
                          description: 'Optimal digestive health with no concerns',
                          recommendations: ['Maintain current habits', 'Continue regular monitoring']
                        };
                        if (score >= 65) return {
                          label: 'Good',
                          color: '#3b82f6',
                          description: 'Healthy digestive function with minor room for improvement',
                          recommendations: ['Stay hydrated', 'Maintain fiber intake']
                        };
                        if (score >= 50) return {
                          label: 'Fair',
                          color: '#eab308',
                          description: 'Some digestive concerns that need attention',
                          recommendations: ['Increase water intake', 'Add more fiber to diet', 'Consider probiotics']
                        };
                        if (score >= 35) return {
                          label: 'Poor',
                          color: '#f97316',
                          description: 'Significant digestive issues requiring intervention',
                          recommendations: ['Consult healthcare provider', 'Dietary changes needed', 'Monitor closely']
                        };
                        return {
                          label: 'Critical',
                          color: '#ef4444',
                          description: 'Severe digestive health concerns requiring immediate attention',
                          recommendations: ['Seek medical attention', 'Urgent dietary review', 'Professional consultation needed']
                        };
                      };

                      const category = getHealthCategory(value);
                      return [
                        <div key="health-score-tooltip" className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-lg">{value}/100</span>
                            <div className="flex items-center gap-1">
                              <div
                                className="w-3 h-3 rounded-full border border-white"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-sm font-medium" style={{ color: category.color }}>
                                {category.label}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs opacity-90">{category.description}</div>
                          <div className="space-y-1">
                            <div className="text-xs font-medium opacity-75">Recommendations:</div>
                            {category.recommendations.map((rec, idx) => (
                              <div key={idx} className="text-xs opacity-90 flex items-start gap-1">
                                <span className="text-green-400 mt-0.5">•</span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>,
                        'Health Score'
                      ];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="healthScore"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bristol Score Trend */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bristol Score Trend</h3>
            <InfoTooltip content={`🚽 Bristol Stool Scale Guide

🟢 Types 3-4: OPTIMAL ✓
🟡 Types 1-2: CONSTIPATION ⚠️
🔴 Types 5-7: DIARRHEA ⚠️

💡 Hover bars for detailed insights`}>
              <div className="cursor-help">
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </div>
            </InfoTooltip>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  domain={[0, 7]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number, name: string) => {
                    const bristolInfo: Record<number, { label: string; description: string; color: string; health: string }> = {
                      1: {
                        label: 'Type 1: Hard Lumps',
                        description: 'Severe constipation. Difficult to pass, indicates very slow transit time.',
                        color: '#ef4444',
                        health: 'Needs attention'
                      },
                      2: {
                        label: 'Type 2: Lumpy Sausage',
                        description: 'Constipation. Indicates lack of fiber and dehydration.',
                        color: '#f97316',
                        health: 'Mild concern'
                      },
                      3: {
                        label: 'Type 3: Cracked Sausage',
                        description: 'Optimal. Normal healthy stool with slight cracks on surface.',
                        color: '#10b981',
                        health: 'Healthy'
                      },
                      4: {
                        label: 'Type 4: Smooth Sausage',
                        description: 'Perfect health. Ideal stool shape and consistency.',
                        color: '#059669',
                        health: 'Excellent'
                      },
                      5: {
                        label: 'Type 5: Soft Blobs',
                        description: 'Borderline loose. May indicate lack of fiber.',
                        color: '#eab308',
                        health: 'Normal'
                      },
                      6: {
                        label: 'Type 6: Mushy',
                        description: 'Loose stool. Borderline diarrhea, may indicate mild infection.',
                        color: '#f97316',
                        health: 'Mild concern'
                      },
                      7: {
                        label: 'Type 7: Liquid',
                        description: 'Diarrhea. Indicates rapid transit through intestines.',
                        color: '#ef4444',
                        health: 'Needs attention'
                      }
                    };

                    const info = bristolInfo[value as keyof typeof bristolInfo];
                    if (!info) {
                      return [`${value} - Unknown score`, 'Bristol Score'];
                    }

                    return [
                      <div key="bristol-tooltip" className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white"
                            style={{ backgroundColor: info.color }}
                          />
                          <span className="font-semibold">{info.label}</span>
                        </div>
                        <div className="text-xs opacity-90">{info.description}</div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">Health:</span>
                          <span className={`text-xs font-medium ${
                            info.health === 'Excellent' || info.health === 'Healthy' ? 'text-green-400' :
                            info.health === 'Normal' ? 'text-yellow-400' :
                            'text-orange-400'
                          }`}>
                            {info.health}
                          </span>
                        </div>
                      </div>,
                      'Bristol Score'
                    ];
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar
                  dataKey="bristolScore"
                  fill="#10b981"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <HealthHeatmap
        data={trendData.dailySummaries}
        onDayClick={(day) => setSelectedDay(day)}
      />

      {/* Insights Section */}
      {latestWeek && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Health Assessment</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Frequency</span>
                  <span className="text-sm text-gray-900 dark:text-white">{latestWeek.insights.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Consistency</span>
                  <span className="text-sm text-gray-900 dark:text-white">{latestWeek.insights.consistency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Hydration</span>
                  <span className="text-sm text-gray-900 dark:text-white">{latestWeek.insights.hydration}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recommendations</h4>
              <ul className="space-y-1">
                {latestWeek.insights.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(selectedDay.date).toLocaleDateString()}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Health Score</span>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedDay.healthScore}/100
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Events</span>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedDay.eventCount}
                </p>
              </div>
              {selectedDay.flags.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Flags</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedDay.flags.map((flag, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}export default HealthTrends;