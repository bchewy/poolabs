import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface TrendData {
  date: string;
  bristolScore?: number;
  hydrationIndex?: number;
  volumeEstimate?: string;
  flags: string[];
  eventCount: number;
}

export interface DailySummary {
  date: string;
  avgBristolScore: number;
  avgHydrationIndex: number;
  mostCommonVolume: string;
  flags: string[];
  eventCount: number;
  healthScore: number; // 0-100
}

export interface WeeklyTrends {
  weekStart: string;
  dailyData: DailySummary[];
  overallHealthScore: number;
  trendDirection: 'improving' | 'stable' | 'declining';
  alerts: string[];
  insights: {
    frequency: string;
    consistency: string;
    hydration: string;
    recommendations: string[];
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const deviceId = searchParams.get('deviceId');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch analysis data
    let query = supabase
      .from('analysis_results')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (deviceId && deviceId !== 'all') {
      query = query.eq('device_id', deviceId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Group data by date
    const dataByDate: { [key: string]: TrendData[] } = {};

    data?.forEach((analysis) => {
      const date = new Date(analysis.created_at).toISOString().split('T')[0];
      if (!dataByDate[date]) {
        dataByDate[date] = [];
      }

      dataByDate[date].push({
        date,
        bristolScore: analysis.bristol_score,
        hydrationIndex: analysis.hydration_index,
        volumeEstimate: analysis.volume_estimate,
        flags: analysis.flags || [],
        eventCount: 1
      });
    });

    // Generate daily summaries
    const dailySummaries: DailySummary[] = Object.entries(dataByDate).map(([date, entries]) => {
      const validBristolScores = entries.filter(e => e.bristolScore !== undefined).map(e => e.bristolScore!);
      const validHydrationIndices = entries.filter(e => e.hydrationIndex !== undefined).map(e => e.hydrationIndex!);

      const avgBristolScore = validBristolScores.length > 0
        ? validBristolScores.reduce((sum, score) => sum + score, 0) / validBristolScores.length
        : 0;

      const avgHydrationIndex = validHydrationIndices.length > 0
        ? validHydrationIndices.reduce((sum, index) => sum + index, 0) / validHydrationIndices.length
        : 0;

      // Calculate volume frequency
      const volumeCount: { [key: string]: number } = {};
      entries.forEach(e => {
        if (e.volumeEstimate) {
          volumeCount[e.volumeEstimate] = (volumeCount[e.volumeEstimate] || 0) + 1;
        }
      });
      const mostCommonVolume = Object.entries(volumeCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'medium';

      // Calculate health score (0-100)
      let healthScore = 50; // Base score

      // Bristol score component (ideal: 3-4)
      if (avgBristolScore >= 3 && avgBristolScore <= 4) {
        healthScore += 30;
      } else if (avgBristolScore >= 2 && avgBristolScore <= 6) {
        healthScore += 15;
      }

      // Hydration component (ideal: 0.6-0.8)
      if (avgHydrationIndex >= 0.6 && avgHydrationIndex <= 0.8) {
        healthScore += 20;
      } else if (avgHydrationIndex >= 0.4 && avgHydrationIndex <= 0.9) {
        healthScore += 10;
      }

      // Deduct for flags
      const allFlags = entries.flatMap(e => e.flags);
      const uniqueFlags = [...new Set(allFlags)];
      healthScore -= uniqueFlags.length * 5;

      healthScore = Math.max(0, Math.min(100, healthScore));

      return {
        date,
        avgBristolScore,
        avgHydrationIndex,
        mostCommonVolume,
        flags: uniqueFlags,
        eventCount: entries.length,
        healthScore
      };
    });

    // Fill in missing dates
    const filledSummaries: DailySummary[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const existing = dailySummaries.find(s => s.date === dateStr);
      if (existing) {
        filledSummaries.push(existing);
      } else {
        filledSummaries.push({
          date: dateStr,
          avgBristolScore: 0,
          avgHydrationIndex: 0,
          mostCommonVolume: 'medium',
          flags: [],
          eventCount: 0,
          healthScore: 50 // Neutral score
        });
      }
    }

    // Calculate weekly trends
    const weeklyTrends: WeeklyTrends[] = [];
    const weeksCount = Math.ceil(days / 7);

    for (let week = 0; week < weeksCount; week++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (week * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekData = filledSummaries.filter(summary => {
        const summaryDate = new Date(summary.date);
        return summaryDate >= weekStart && summaryDate <= weekEnd;
      });

      const overallHealthScore = weekData.length > 0
        ? weekData.reduce((sum, day) => sum + day.healthScore, 0) / weekData.length
        : 50;

      // Calculate trend direction
      const firstHalf = weekData.slice(0, Math.floor(weekData.length / 2));
      const secondHalf = weekData.slice(Math.floor(weekData.length / 2));

      const firstHalfAvg = firstHalf.length > 0
        ? firstHalf.reduce((sum, day) => sum + day.healthScore, 0) / firstHalf.length
        : overallHealthScore;
      const secondHalfAvg = secondHalf.length > 0
        ? secondHalf.reduce((sum, day) => sum + day.healthScore, 0) / secondHalf.length
        : overallHealthScore;

      let trendDirection: 'improving' | 'stable' | 'declining' = 'stable';
      if (secondHalfAvg > firstHalfAvg + 5) {
        trendDirection = 'improving';
      } else if (secondHalfAvg < firstHalfAvg - 5) {
        trendDirection = 'declining';
      }

      // Generate alerts
      const alerts: string[] = [];
      const allWeekFlags = weekData.flatMap(day => day.flags);

      // Check for concerning patterns
      const noMovementDays = weekData.filter(day => day.eventCount === 0).length;
      if (noMovementDays >= 3) {
        alerts.push('infrequent_bowel_movements');
      }

      const lowBristolDays = weekData.filter(day => day.avgBristolScore > 0 && day.avgBristolScore <= 2).length;
      if (lowBristolDays >= 2) {
        alerts.push('constipation_pattern');
      }

      const highBristolDays = weekData.filter(day => day.avgBristolScore >= 6).length;
      if (highBristolDays >= 2) {
        alerts.push('diarrhea_pattern');
      }

      const avgEventCount = weekData.reduce((sum, day) => sum + day.eventCount, 0) / weekData.length;
      if (avgEventCount > 3) {
        alerts.push('high_frequency');
      }

      // Generate insights
      const avgBristol = weekData
        .filter(day => day.avgBristolScore > 0)
        .reduce((sum, day) => sum + day.avgBristolScore, 0) /
        weekData.filter(day => day.avgBristolScore > 0).length || 0;

      const avgHydration = weekData
        .filter(day => day.avgHydrationIndex > 0)
        .reduce((sum, day) => sum + day.avgHydrationIndex, 0) /
        weekData.filter(day => day.avgHydrationIndex > 0).length || 0;

      const insights = {
        frequency: avgEventCount < 1 ? 'Low frequency - may indicate constipation' :
                   avgEventCount > 3 ? 'High frequency - monitor for diarrhea' :
                   'Normal frequency',
        consistency: avgBristol < 3 || avgBristol > 4 ? 'Irregular consistency - monitor diet' :
                     'Good consistency',
        hydration: avgHydration < 0.5 ? 'Low hydration - increase fluid intake' :
                   avgHydration > 0.8 ? 'Good hydration levels' :
                   'Adequate hydration',
        recommendations: generateRecommendations(alerts, avgBristol, avgHydration, avgEventCount)
      };

      weeklyTrends.push({
        weekStart: weekStart.toISOString().split('T')[0],
        dailyData: weekData,
        overallHealthScore,
        trendDirection,
        alerts,
        insights
      });
    }

    return NextResponse.json({
      dailySummaries: filledSummaries,
      weeklyTrends,
      overallStats: {
        totalDays: filledSummaries.length,
        totalEvents: filledSummaries.reduce((sum, day) => sum + day.eventCount, 0),
        avgHealthScore: filledSummaries.reduce((sum, day) => sum + day.healthScore, 0) / filledSummaries.length,
        currentTrend: weeklyTrends[weeklyTrends.length - 1]?.trendDirection || 'stable'
      }
    });

  } catch (error) {
    console.error('Trends API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trend data' },
      { status: 500 }
    );
  }
}

function generateRecommendations(alerts: string[], avgBristol: number, avgHydration: number, avgEventCount: number): string[] {
  const recommendations: string[] = [];

  if (alerts.includes('constipation_pattern')) {
    recommendations.push('Increase fiber intake with fruits, vegetables, and whole grains');
    recommendations.push('Drink more water throughout the day');
    recommendations.push('Consider gentle exercise like walking');
  }

  if (alerts.includes('diarrhea_pattern')) {
    recommendations.push('Stay hydrated with clear fluids');
    recommendations.push('Eat bland foods like bananas, rice, and toast');
    recommendations.push('Avoid dairy and fatty foods temporarily');
  }

  if (alerts.includes('infrequent_bowel_movements')) {
    recommendations.push('Establish a regular bathroom routine');
    recommendations.push('Increase physical activity');
    recommendations.push('Consider natural laxatives like prunes or fiber supplements');
  }

  if (avgHydration < 0.5) {
    recommendations.push('Increase water intake to at least 8 glasses per day');
  }

  if (avgEventCount > 3) {
    recommendations.push('Monitor food triggers that may cause high frequency');
  }

  if (recommendations.length === 0) {
    recommendations.push('Maintain current diet and hydration habits');
    recommendations.push('Continue regular monitoring');
  }

  return recommendations;
}