import HealthTrends from '@/components/HealthTrends';

export default function HealthTrendsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              Health Trends Dashboard
            </h1>
            <p className="text-amber-700">
              Monitor your digestive health patterns and trends over time
            </p>
          </div>
          <HealthTrends deviceId="all" />
        </div>
      </div>
    </div>
  );
}