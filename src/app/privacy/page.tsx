"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield, Lock, Eye, EyeOff, Key, Activity, AlertTriangle,
  CheckCircle, RefreshCw, Database, Network, Server, Fingerprint,
  BarChart3, TrendingUp, Clock, Users, FileText, Hash
} from "lucide-react";
import EncryptionDemo from "@/components/EncryptionDemo";

interface PrivacyMetrics {
  encryptionScore: number;
  dataMinimization: number;
  accessControl: number;
  auditCompleteness: number;
  overallScore: number;
}

interface AuditEvent {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  resource: string;
  location: string;
  risk: "low" | "medium" | "high";
}

interface DataFlow {
  id: string;
  from: string;
  to: string;
  status: "encrypted" | "anonymized" | "raw";
  timestamp: Date;
}

export default function PrivacyDashboard() {
  const [metrics, setMetrics] = useState<PrivacyMetrics>({
    encryptionScore: 0,
    dataMinimization: 0,
    accessControl: 0,
    auditCompleteness: 0,
    overallScore: 0
  });

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [dataFlows, setDataFlows] = useState<DataFlow[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time privacy metrics
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        setMetrics(prev => ({
          encryptionScore: Math.min(100, prev.encryptionScore + Math.random() * 2),
          dataMinimization: Math.min(100, prev.dataMinimization + Math.random() * 1.5),
          accessControl: Math.min(100, prev.accessControl + Math.random() * 1.8),
          auditCompleteness: Math.min(100, prev.auditCompleteness + Math.random() * 1.2),
          overallScore: Math.min(100, prev.overallScore + Math.random() * 1)
        }));

        // Add new audit events
        if (Math.random() > 0.7) {
          const newEvent: AuditEvent = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            action: ["Data Access", "Encryption", "Audit Log", "Policy Update", "Access Revoked"][Math.floor(Math.random() * 5)],
            user: ["System", "Device API", "Health AI", "Caregiver Portal"][Math.floor(Math.random() * 4)],
            resource: ["Health Data", "Encryption Keys", "Audit Logs", "User Profile"][Math.floor(Math.random() * 4)],
            location: ["Device", "Cloud Storage", "AI Service", "Database"][Math.floor(Math.random() * 4)],
            risk: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high"
          };

          setAuditEvents(prev => [newEvent, ...prev.slice(0, 9)]);
        }

        // Update data flows
        setDataFlows(prev => {
          const flows = [...prev];
          if (flows.length > 8) flows.pop();

          if (Math.random() > 0.6) {
            flows.unshift({
              id: Math.random().toString(36).substr(2, 9),
              from: ["Device", "Database", "AI Service"][Math.floor(Math.random() * 3)],
              to: ["Cloud Storage", "Analytics", "Caregiver"][Math.floor(Math.random() * 3)],
              status: ["encrypted", "anonymized", "raw"][Math.floor(Math.random() * 3)] as "encrypted" | "anonymized" | "raw",
              timestamp: new Date()
            });
          }

          return flows;
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "encrypted": return "bg-green-500";
      case "anonymized": return "bg-blue-500";
      case "raw": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Privacy & Security Center
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time monitoring of your health data privacy
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isLive ? 'Live' : 'Paused'}
                </span>
              </div>
              <button
                onClick={() => setIsLive(!isLive)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {isLive ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Privacy Score Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(metrics.encryptionScore)}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Encryption</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.encryptionScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(metrics.dataMinimization)}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Minimization</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.dataMinimization}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(metrics.accessControl)}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Access Control</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.accessControl}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(metrics.auditCompleteness)}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Audit Trail</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.auditCompleteness}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {Math.round(metrics.overallScore)}%
                  </p>
                  <p className="text-xs text-green-100">Overall Score</p>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.overallScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Audit Log */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Live Audit Log
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Real-time</span>
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {auditEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className={`w-2 h-2 rounded-full ${getRiskColor(event.risk).split(' ')[0]}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {event.user} • {event.resource} • {event.location}
                    </p>
                  </div>
                </div>
              ))}
              {auditEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Waiting for events...</p>
                </div>
              )}
            </div>
          </div>

          {/* Data Flow Visualization */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Network className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Data Flow Monitor
              </h2>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {dataFlows.map((flow) => (
                <div
                  key={flow.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {flow.from}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(flow.status)}`}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {flow.status}
                      </span>
                      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    <div className="text-right mt-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {flow.to}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {dataFlows.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Monitoring data flows...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Encryption Demo */}
        <div className="mt-8">
          <EncryptionDemo />
        </div>
      </div>
    </div>
  );
}