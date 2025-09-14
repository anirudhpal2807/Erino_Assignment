import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Shield, Save, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (formData) => {
    try {
      // API call to update user profile would go here
      console.log('Profile update data:', formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences.</p>
        </div>
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="btn btn-outline btn-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                className="btn btn-primary btn-md"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary btn-md"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-content text-center">
              <div className="mx-auto h-24 w-24 bg-primary-600 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="mt-4">
                <span className={`badge ${user?.role === 'admin' ? 'badge-success' : 'badge-info'}`}>
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
            </div>
            <div className="card-content space-y-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Status</p>
                  <p className="text-sm text-gray-500">
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Member Since</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>

              {user?.lastLogin && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Login</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(user?.lastLogin)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="card-content">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">First Name</label>
                    {isEditing ? (
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
                    ) : (
                      <p className="text-sm text-gray-900 py-2">{user?.firstName}</p>
                    )}
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Last Name</label>
                    {isEditing ? (
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
                    ) : (
                      <p className="text-sm text-gray-900 py-2">{user?.lastName}</p>
                    )}
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Email Address</label>
                  {isEditing ? (
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
                  ) : (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{user?.email}</p>
                    </div>
                  )}
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {!isEditing && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Security Notice
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            For security reasons, password changes and other sensitive account modifications 
                            should be handled through your account administrator.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="card mt-6">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Activity Summary</h3>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">-</div>
                  <div className="text-sm text-gray-500">Leads Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">-</div>
                  <div className="text-sm text-gray-500">Leads Won</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">-</div>
                  <div className="text-sm text-gray-500">Total Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

 export default Profile;