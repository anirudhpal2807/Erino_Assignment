const Lead = require('../models/Lead');
const { buildPaginationQuery, buildPaginationResponse, buildFilterQuery, buildSortQuery } = require('../utils/pagination');

// Create lead
const createLead = async (req, res) => {
  try {
    console.log('Creating lead for user:', req.user);
    console.log('User ID:', req.user._id);
    
    const leadData = {
      ...req.body,
      createdBy: req.user._id
    };

    console.log('Lead data being saved:', leadData);

    const lead = new Lead(leadData);
    await lead.save();

    console.log('Lead created successfully with ID:', lead._id);

    res.status(201).json({
      status: 'success',
      message: 'Lead created successfully',
      data: { lead }
    });
  } catch (error) {
    console.error('Create lead error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Lead with this email already exists'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get all leads with pagination and filtering
const getLeads = async (req, res) => {
  try {
    const { page, limit, skip } = buildPaginationQuery(req.query);
    const filter = buildFilterQuery(req.query);
    const sort = buildSortQuery(req.query.sortBy, req.query.sortOrder);

    console.log('User making request:', req.user);
    console.log('User role:', req.user.role);
    console.log('User ID:', req.user._id);

    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    console.log('Filter being applied:', filter);

    const leads = await Lead.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments(filter);

    console.log('Found leads:', leads.length);
    console.log('Total leads:', total);
    console.log('Sample lead data:', leads[0] ? {
      _id: leads[0]._id,
      firstName: leads[0].firstName,
      lastName: leads[0].lastName,
      company: leads[0].company,
      status: leads[0].status,
      leadValue: leads[0].leadValue
    } : 'No leads found');

    const response = buildPaginationResponse(leads, page, limit, total);

    res.status(200).json({
      status: 'success',
      data: response
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get single lead
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'firstName lastName email');
    
    if (!lead) {
      return res.status(404).json({
        status: 'error',
        message: 'Lead not found'
      });
    }

    // Check if user can access this lead
    if (req.user.role !== 'admin' && lead.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { lead }
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update lead
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        status: 'error',
        message: 'Lead not found'
      });
    }

    // Check if user can update this lead
    if (req.user.role !== 'admin' && lead.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Update lead
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        lead[key] = req.body[key];
      }
    });

    await lead.save();

    res.status(200).json({
      status: 'success',
      message: 'Lead updated successfully',
      data: { lead }
    });
  } catch (error) {
    console.error('Update lead error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Lead with this email already exists'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        status: 'error',
        message: 'Lead not found'
      });
    }

    // Check if user can delete this lead
    if (req.user.role !== 'admin' && lead.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get lead statistics
const getLeadStats = async (req, res) => {
  try {
    console.log('Getting lead stats for user:', req.user);
    const filter = {};
    
    // Add user filter for non-admin users
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    console.log('Stats filter:', filter);

    const stats = await Lead.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalValue: { $sum: '$leadValue' },
          avgScore: { $avg: '$score' },
          new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
          qualified: { $sum: { $cond: [{ $eq: ['$status', 'qualified'] }, 1, 0] } },
          won: { $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] } }
        }
      }
    ]);

    console.log('Raw stats from aggregation:', stats);

    const result = stats[0] || {
      total: 0,
      totalValue: 0,
      avgScore: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      won: 0,
      lost: 0
    };

    console.log('Final stats result:', result);
    console.log('Stats response being sent:', {
      status: 'success',
      data: { stats: result }
    });

    res.status(200).json({
      status: 'success',
      data: { stats: result }
    });
  } catch (error) {
    console.error('Get lead stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  getLeadStats
};
