import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery(
    'leadStats',
    leadsAPI.getLeadStats
  );

  const { data: leadsData, isLoading: leadsLoading, error: leadsError } = useQuery(
    'recentLeads',
    () => leadsAPI.getLeads({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })
  );

  // Debug logging
  console.log('Dashboard - Stats Data:', statsData);
  console.log('Dashboard - Leads Data:', leadsData);
  console.log('Dashboard - Stats Error:', statsError);
  console.log('Dashboard - Leads Error:', leadsError);

  // Detailed data structure logging
  console.log('Dashboard - Stats Data.data:', statsData?.data);
  console.log('Dashboard - Stats Data.data.data:', statsData?.data?.data);
  console.log('Dashboard - Leads Data.data:', leadsData?.data);
  console.log('Dashboard - Leads Data.data.data:', leadsData?.data?.data);
  
  // Check if data is loading
  console.log('Dashboard - Stats Loading:', statsLoading);
  console.log('Dashboard - Leads Loading:', leadsLoading);

  // Process real data from backend - fix the data structure
  let stats = {}; // Always initialize as object
  let recentLeads = [];
  
  // Fix stats data structure - the stats are in data.data.stats
  if (statsData?.data?.data?.stats) {
    stats = statsData.data.data.stats;
    console.log('Dashboard - Using correct nested stats path');
  } else if (statsData?.data?.stats) {
    stats = statsData.data.stats;
    console.log('Dashboard - Using correct stats path');
  } else if (statsData?.data) {
    stats = statsData.data;
    console.log('Dashboard - Using alternative stats path');
  }
  
  // Ensure stats is always an object
  if (!stats || typeof stats !== 'object') {
    stats = {};
    console.log('Dashboard - Stats was null/undefined, reset to empty object');
  }
  
  // Fix recent leads data structure - it's nested deeper
  if (leadsData?.data?.data?.data && Array.isArray(leadsData.data.data.data)) {
    recentLeads = leadsData.data.data.data;
    console.log('Dashboard - Using correct nested leads path');
  } else if (leadsData?.data?.data && Array.isArray(leadsData.data.data)) {
    recentLeads = leadsData.data.data;
    console.log('Dashboard - Using alternative leads path');
  } else if (leadsData?.data && Array.isArray(leadsData.data)) {
    recentLeads = leadsData.data;
    console.log('Dashboard - Using fallback leads path');
  }

  console.log('Dashboard - Processed Stats:', stats);
  console.log('Dashboard - Processed Recent Leads:', recentLeads);
  console.log('Dashboard - Recent Leads Length:', recentLeads.length);
  console.log('Dashboard - Stats Total:', stats.total);
  console.log('Dashboard - Stats Total Value:', stats.totalValue);
  console.log('Dashboard - Stats Avg Score:', stats.avgScore);
  console.log('Dashboard - Stats New:', stats.new);
  console.log('Dashboard - Stats Contacted:', stats.contacted);
  console.log('Dashboard - Stats Keys:', stats ? Object.keys(stats) : 'Stats is null/undefined');
  console.log('Dashboard - Recent Leads Type:', typeof recentLeads);
  console.log('Dashboard - Recent Leads Is Array:', Array.isArray(recentLeads));
  
  // Fallback: If stats is still empty, try to calculate from recent leads
  if ((!stats || Object.keys(stats).length === 0) && recentLeads.length > 0) {
    console.log('Dashboard - Calculating stats from recent leads as fallback');
    const totalValue = recentLeads.reduce((sum, lead) => sum + (lead.leadValue || 0), 0);
    const avgScore = recentLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / recentLeads.length;
    const statusCounts = recentLeads.reduce((counts, lead) => {
      counts[lead.status] = (counts[lead.status] || 0) + 1;
      return counts;
    }, {});
    
    stats = {
      total: recentLeads.length,
      totalValue: totalValue,
      avgScore: avgScore,
      new: statusCounts.new || 0,
      contacted: statusCounts.contacted || 0,
      qualified: statusCounts.qualified || 0,
      won: statusCounts.won || 0,
      lost: statusCounts.lost || 0
    };
    console.log('Dashboard - Calculated stats:', stats);
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'badge-info', label: 'New' },
      contacted: { color: 'badge-warning', label: 'Contacted' },
      qualified: { color: 'badge-success', label: 'Qualified' },
      won: { color: 'badge-success', label: 'Won' },
      lost: { color: 'badge-danger', label: 'Lost' },
    };
    
    const config = statusConfig[status] || { color: 'badge-secondary', label: status };
    return <span className={`badge ${config.color}`}>{config.label}</span>;
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      website: { color: 'badge-info', label: 'Website' },
      facebook_ads: { color: 'badge-primary', label: 'Facebook Ads' },
      google_ads: { color: 'badge-success', label: 'Google Ads' },
      referral: { color: 'badge-warning', label: 'Referral' },
      events: { color: 'badge-secondary', label: 'Events' },
      other: { color: 'badge-secondary', label: 'Other' },
    };
    
    const config = sourceConfig[source] || { color: 'badge-secondary', label: source };
    return <span className={`badge ${config.color}`}>{config.label}</span>;
  };

  if (statsLoading || leadsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
        <p className="ml-2">Loading data...</p>
      </div>
    );
  }

  // Show error states
  if (statsError || leadsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading data</p>
          <p className="text-sm text-gray-500">Stats Error: {statsError?.message}</p>
          <p className="text-sm text-gray-500">Leads Error: {leadsError?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your leads.</p>
        </div>
        <Link
          to="/leads/new"
          className="btn btn-primary btn-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalValue ? stats.totalValue.toLocaleString() : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgScore ? Math.round(stats.avgScore) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Won Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.won || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Lead Status</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New</span>
                <span className="text-sm font-medium text-gray-900">{stats.new || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Contacted</span>
                <span className="text-sm font-medium text-gray-900">{stats.contacted || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Qualified</span>
                <span className="text-sm font-medium text-gray-900">{stats.qualified || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Won</span>
                <span className="text-sm font-medium text-gray-900">{stats.won || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lost</span>
                <span className="text-sm font-medium text-gray-900">{stats.lost || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <div key={lead._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{lead.company}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(lead.status)}
                      <span className="text-xs text-gray-500">
                        ${lead.leadValue?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No leads yet</p>
              )}
            </div>
            <div className="mt-4">
              <Link
                to="/leads"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                View all leads →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/leads/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Add New Lead</p>
                <p className="text-sm text-gray-500">Create a new lead entry</p>
              </div>
            </Link>

            <Link
              to="/leads"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">View All Leads</p>
                <p className="text-sm text-gray-500">Browse and manage leads</p>
              </div>
            </Link>

            <Link
              to="/leads"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-500">View detailed reports</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
