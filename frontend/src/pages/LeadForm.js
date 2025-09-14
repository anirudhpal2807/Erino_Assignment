import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import { ArrowLeft, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      city: '',
      state: '',
      source: 'website',
      status: 'new',
      score: 0,
      leadValue: 0,
      isQualified: false,
      notes: '',
    },
  });

  // Fetch lead data for editing
  const { isLoading: leadLoading } = useQuery(
    ['lead', id],
    () => leadsAPI.getLead(id),
    {
      enabled: isEdit,
      onSuccess: (data) => {
        console.log('LeadForm - Raw data received:', data);
        console.log('LeadForm - Data structure:', {
          'data.data.lead': data?.data?.lead,
          'data.data.data.lead': data?.data?.data?.lead,
          'data.data': data?.data
        });
        
        const lead = data?.data?.lead || data?.data?.data?.lead || data?.data;
        console.log('LeadForm - Extracted lead:', lead);
        
        if (lead && typeof lead === 'object') {
          console.log('LeadForm - Setting form values for lead:', lead);
          Object.keys(lead).forEach(key => {
            if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'createdBy') {
              setValue(key, lead[key]);
            }
          });
        } else {
          console.error('LeadForm - Lead data is null or undefined:', data);
        }
      },
      onError: (error) => {
        console.error('LeadForm - Error fetching lead:', error);
        toast.error('Failed to load lead data');
      },
    }
  );

  // Create/Update lead mutation
  const leadMutation = useMutation(
    (data) => isEdit ? leadsAPI.updateLead(id, data) : leadsAPI.createLead(data),
    {
      onSuccess: () => {
        toast.success(`Lead ${isEdit ? 'updated' : 'created'} successfully`);
        queryClient.invalidateQueries('leads');
        queryClient.invalidateQueries('leadStats');
        navigate('/leads');
      },
      onError: (error) => {
        console.error('Lead mutation error:', error);
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           `Failed to ${isEdit ? 'update' : 'create'} lead`;
        toast.error(errorMessage);
      },
    }
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await leadMutation.mutateAsync(data);
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/leads');
  };

  if (leadLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/leads')}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Lead' : 'Add New Lead'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Update lead information' : 'Create a new lead entry'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCancel}
            className="btn btn-outline btn-md"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="btn btn-primary btn-md"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="card-content space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name *</label>
                  <input
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters',
                      },
                    })}
                    type="text"
                    className="input"
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Last Name *</label>
                  <input
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters',
                      },
                    })}
                    type="text"
                    className="input"
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="label">Email *</label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="input"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="label">Phone *</label>
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[+]?[1-9][\d]{0,15}$/,
                      message: 'Please enter a valid phone number',
                    },
                  })}
                  type="tel"
                  className="input"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="label">Company *</label>
                <input
                  {...register('company', {
                    required: 'Company is required',
                    maxLength: {
                      value: 100,
                      message: 'Company name cannot exceed 100 characters',
                    },
                  })}
                  type="text"
                  className="input"
                  placeholder="Enter company name"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City *</label>
                  <input
                    {...register('city', {
                      required: 'City is required',
                      maxLength: {
                        value: 50,
                        message: 'City name cannot exceed 50 characters',
                      },
                    })}
                    type="text"
                    className="input"
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">State *</label>
                  <input
                    {...register('state', {
                      required: 'State is required',
                      maxLength: {
                        value: 50,
                        message: 'State name cannot exceed 50 characters',
                      },
                    })}
                    type="text"
                    className="input"
                    placeholder="Enter state"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Lead Details</h3>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="label">Source *</label>
                <select
                  {...register('source', { required: 'Source is required' })}
                  className="input"
                >
                  <option value="website">Website</option>
                  <option value="facebook_ads">Facebook Ads</option>
                  <option value="google_ads">Google Ads</option>
                  <option value="referral">Referral</option>
                  <option value="events">Events</option>
                  <option value="other">Other</option>
                </select>
                {errors.source && (
                  <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
                )}
              </div>

              <div>
                <label className="label">Status</label>
                <select
                  {...register('status')}
                  className="input"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Score (0-100)</label>
                  <input
                    {...register('score', {
                      min: { value: 0, message: 'Score must be at least 0' },
                      max: { value: 100, message: 'Score cannot exceed 100' },
                    })}
                    type="number"
                    min="0"
                    max="100"
                    className="input"
                    placeholder="0"
                  />
                  {errors.score && (
                    <p className="mt-1 text-sm text-red-600">{errors.score.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Lead Value ($)</label>
                  <input
                    {...register('leadValue', {
                      min: { value: 0, message: 'Lead value must be positive' },
                    })}
                    type="number"
                    min="0"
                    step="0.01"
                    className="input"
                    placeholder="0.00"
                  />
                  {errors.leadValue && (
                    <p className="mt-1 text-sm text-red-600">{errors.leadValue.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  {...register('isQualified')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Mark as qualified
                </label>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            </div>
            <div className="card-content">
              <div>
                <label className="label">Notes</label>
                <textarea
                  {...register('notes', {
                    maxLength: {
                      value: 1000,
                      message: 'Notes cannot exceed 1000 characters',
                    },
                  })}
                  rows={4}
                  className="input"
                  placeholder="Enter any additional notes about this lead"
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
