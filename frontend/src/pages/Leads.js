import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { leadsAPI } from '../services/api';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Download,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Leads = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery(
    ['leads', page, limit, filters],
    () => leadsAPI.getLeads({ page, limit, ...filters }),
    {
      keepPreviousData: true,
    }
  );

  // Debug logging
  console.log('Leads Page - Raw Data:', data);
  console.log('Leads Page - Loading:', isLoading);
  console.log('Leads Page - Error:', error);
  
  // Detailed data structure logging
  console.log('Leads Page - Data.data:', data?.data);
  console.log('Leads Page - Data.data.data:', data?.data?.data);
  console.log('Leads Page - Data.data.pagination:', data?.data?.pagination);

  const deleteLeadMutation = useMutation(leadsAPI.deleteLead, {
    onSuccess: () => {
      toast.success('Lead deleted successfully');
      queryClient.invalidateQueries('leads');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete lead');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLeadMutation.mutate(id);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', label: 'New' },
      contacted: { color: 'bg-yellow-100 text-yellow-800', label: 'Contacted' },
      qualified: { color: 'bg-green-100 text-green-800', label: 'Qualified' },
      won: { color: 'bg-green-100 text-green-800', label: 'Won' },
      lost: { color: 'bg-red-100 text-red-800', label: 'Lost' },
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      website: { color: 'bg-blue-100 text-blue-800', label: 'Website' },
      facebook_ads: { color: 'bg-purple-100 text-purple-800', label: 'Facebook Ads' },
      google_ads: { color: 'bg-green-100 text-green-800', label: 'Google Ads' },
      referral: { color: 'bg-yellow-100 text-yellow-800', label: 'Referral' },
      events: { color: 'bg-gray-100 text-gray-800', label: 'Events' },
      other: { color: 'bg-gray-100 text-gray-800', label: 'Other' },
    };
    
    const config = sourceConfig[source] || { color: 'bg-gray-100 text-gray-800', label: source };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columnDefs = [
    {
      headerName: 'Name',
      field: 'firstName',
      cellRenderer: (params) => {
        const lead = params.data;
        return (
          <div>
            <div className="font-medium text-gray-900">
              {lead.firstName} {lead.lastName}
            </div>
            <div className="text-sm text-gray-500">{lead.email}</div>
          </div>
        );
      },
      flex: 2,
      minWidth: 200,
    },
    {
      headerName: 'Company',
      field: 'company',
      cellRenderer: (params) => (
        <div>
          <div className="font-medium text-gray-900">{params.value}</div>
          <div className="text-sm text-gray-500">{params.data.city}, {params.data.state}</div>
        </div>
      ),
      flex: 2,
      minWidth: 180,
    },
    {
      headerName: 'Phone',
      field: 'phone',
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: 'Source',
      field: 'source',
      cellRenderer: (params) => getSourceBadge(params.value),
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params) => getStatusBadge(params.value),
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: 'Score',
      field: 'score',
      cellRenderer: (params) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-primary-600 h-2 rounded-full"
              style={{ width: `${params.value}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{params.value}</span>
        </div>
      ),
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Value',
      field: 'leadValue',
      cellRenderer: (params) => (
        <span className="font-medium">${params.value?.toLocaleString() || 0}</span>
      ),
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params) => {
        const lead = params.data;
        return (
          <div className="flex items-center space-x-2">
            <Link
              to={`/leads/${lead._id}/edit`}
              className="text-primary-600 hover:text-primary-900"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDelete(lead._id)}
              className="text-red-600 hover:text-red-900"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
      flex: 1,
      minWidth: 100,
      pinned: 'right',
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  const handleFilterChange = (field, value) => {
    console.log('Filter change:', field, value);
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [field]: value || undefined,
      };
      console.log('New filters:', newFilters);
      return newFilters;
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  // Process real data from backend - fix the data structure
  let leads = [];
  let pagination = {};
  
  // The correct data structure is: data.data.data.data (nested one more level)
  if (data?.data?.data?.data && Array.isArray(data.data.data.data)) {
    leads = data.data.data.data;
    pagination = data.data.data.pagination || {};
    console.log('Leads Page - Using correct nested data path');
  } else if (data?.data?.data && Array.isArray(data.data.data)) {
    leads = data.data.data;
    pagination = data.data.pagination || {};
    console.log('Leads Page - Using alternative data path');
  } else if (data?.data && Array.isArray(data.data)) {
    leads = data.data;
    console.log('Leads Page - Using fallback data path');
  }

  // Debug logging after data processing
  console.log('Leads Page - Processed leads:', leads);
  console.log('Leads Page - Leads length:', leads.length);
  console.log('Leads Page - Leads type:', typeof leads);
  console.log('Leads Page - Is array:', Array.isArray(leads));
  console.log('Leads Page - Pagination:', pagination);
  
  // Ensure leads is always an array for AG Grid
  const safeLeads = Array.isArray(leads) ? leads : [];
  console.log('Leads Page - Safe leads:', safeLeads);
  
  // Show loading state if data is still loading
  if (isLoading) {
    console.log('Leads Page - Still loading, showing empty array');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage your leads and track their progress.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline btn-md"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button
            onClick={() => refetch()}
            className="btn btn-outline btn-md"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <Link
            to="/leads/new"
            className="btn btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="input"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="label">Source</label>
                <select
                  value={filters.source || ''}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                  className="input"
                >
                  <option value="">All Sources</option>
                  <option value="website">Website</option>
                  <option value="facebook_ads">Facebook Ads</option>
                  <option value="google_ads">Google Ads</option>
                  <option value="referral">Referral</option>
                  <option value="events">Events</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">Company</label>
                <input
                  type="text"
                  value={filters.company || ''}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  placeholder="Search by company"
                  className="input"
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="text"
                  value={filters.email || ''}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  placeholder="Search by email"
                  className="input"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={clearFilters}
                className="btn btn-outline btn-sm"
              >
                Clear Filters
              </button>
              <div className="text-sm text-gray-500">
                {pagination.total || 0} leads found
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leads Grid */}
      <div className="card">
        <div className="card-content p-0">
          <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
            <AgGridReact
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowData={safeLeads}
              loading={isLoading}
              pagination={false}
              suppressRowClickSelection={true}
              animateRows={true}
              rowHeight={60}
            />
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrev}
              className="btn btn-outline btn-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNext}
              className="btn btn-outline btn-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
