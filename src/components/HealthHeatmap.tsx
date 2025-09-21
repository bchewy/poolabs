'use client';

import { useState, useEffect } from 'react';
import { DailySummary } from '@/app/api/trends/route';

interface HealthHeatmapProps {
  data: DailySummary[];
  onDayClick?: (day: DailySummary) => void;
  className?: string;
}

interface HeatmapDay {
  date: string;
  healthScore: number;
  eventCount: number;
  hasData: boolean;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HealthHeatmap({ data, onDayClick, className = '' }: HealthHeatmapProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[][]>([]);

  useEffect(() => {
    generateHeatmapData();
  }, [data, currentMonth]);

  const generateHeatmapData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Create map of health scores by date
    const healthDataMap = new Map<string, { healthScore: number; eventCount: number }>();
    data.forEach(day => {
      healthDataMap.set(day.date, {
        healthScore: day.healthScore,
        eventCount: day.eventCount
      });
    });

    // Generate calendar grid
    const calendar: HeatmapDay[][] = [];
    let week: HeatmapDay[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      week.push({
        date: '',
        healthScore: 50,
        eventCount: 0,
        hasData: false
      });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = healthDataMap.get(dateStr);

      week.push({
        date: dateStr,
        healthScore: dayData?.healthScore || 50,
        eventCount: dayData?.eventCount || 0,
        hasData: !!dayData
      });

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // Add remaining empty cells to complete last week
    while (week.length < 7) {
      week.push({
        date: '',
        healthScore: 50,
        eventCount: 0,
        hasData: false
      });
    }
    calendar.push(week);

    setHeatmapData(calendar);
  };

  const getHealthColor = (score: number): string => {
    if (!score || score === 50) return 'bg-gray-200 dark:bg-gray-700';
    if (score >= 80) return 'bg-green-500 dark:bg-green-600';
    if (score >= 65) return 'bg-green-400 dark:bg-green-500';
    if (score >= 50) return 'bg-yellow-400 dark:bg-yellow-500';
    if (score >= 35) return 'bg-orange-400 dark:bg-orange-500';
    return 'bg-red-400 dark:bg-red-500';
  };

  const getHealthLabel = (score: number): string => {
    if (!score || score === 50) return 'No data';
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 35) return 'Poor';
    return 'Concerning';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Health Calendar
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
          <span>Less healthy</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-400 dark:bg-red-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-orange-400 dark:bg-orange-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-yellow-400 dark:bg-yellow-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-400 dark:bg-green-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-sm"></div>
          </div>
          <span>More healthy</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        {heatmapData.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                onClick={() => day.hasData && onDayClick?.(data.find(d => d.date === day.date)!)}
                className={`
                  aspect-square rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md
                  ${getHealthColor(day.healthScore)}
                  ${day.hasData ? 'hover:ring-2 hover:ring-blue-400' : 'cursor-default'}
                  ${day.eventCount > 1 ? 'ring-1 ring-blue-300 dark:ring-blue-600' : ''}
                `}
                title={
                  day.date
                    ? `${day.date.split('-')[1]}/${day.date.split('-')[2]}\nHealth: ${getHealthLabel(day.healthScore)} (${day.healthScore}/100)\nEvents: ${day.eventCount}`
                    : 'No data'
                }
              >
                <div className="flex items-center justify-center h-full">
                  {day.date && (
                    <span className={`text-xs font-medium ${
                      day.healthScore >= 65 ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {new Date(day.date).getDate()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Color Legend */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-sm"></div>
            <span className="text-gray-600 dark:text-gray-400">Excellent (80-100)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 dark:bg-green-500 rounded-sm"></div>
            <span className="text-gray-600 dark:text-gray-400">Good (65-79)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 dark:bg-yellow-500 rounded-sm"></div>
            <span className="text-gray-600 dark:text-gray-400">Fair (50-64)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-400 dark:bg-orange-500 rounded-sm"></div>
            <span className="text-gray-600 dark:text-gray-400">Poor (35-49)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 dark:bg-red-500 rounded-sm"></div>
            <span className="text-gray-600 dark:text-gray-400">Concerning (0-34)</span>
          </div>
        </div>
      </div>
    </div>
  );
}