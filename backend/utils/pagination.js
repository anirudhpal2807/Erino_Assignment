const buildPaginationQuery = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildPaginationResponse = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

const buildFilterQuery = (query) => {
  const filter = {};
  
  // String filters
  if (query.email) {
    filter.email = { $regex: query.email, $options: 'i' };
  }
  
  if (query.company) {
    filter.company = { $regex: query.company, $options: 'i' };
  }
  
  if (query.city) {
    filter.city = { $regex: query.city, $options: 'i' };
  }
  
  if (query.state) {
    filter.state = { $regex: query.state, $options: 'i' };
  }
  
  // Enum filters
  if (query.status) {
    filter.status = query.status;
  }
  
  if (query.source) {
    filter.source = query.source;
  }
  
  // Boolean filters
  if (query.isQualified !== undefined) {
    filter.isQualified = query.isQualified === 'true';
  }
  
  // Number range filters
  if (query.scoreMin !== undefined || query.scoreMax !== undefined) {
    filter.score = {};
    if (query.scoreMin !== undefined) {
      filter.score.$gte = parseInt(query.scoreMin);
    }
    if (query.scoreMax !== undefined) {
      filter.score.$lte = parseInt(query.scoreMax);
    }
  }
  
  if (query.valueMin !== undefined || query.valueMax !== undefined) {
    filter.leadValue = {};
    if (query.valueMin !== undefined) {
      filter.leadValue.$gte = parseFloat(query.valueMin);
    }
    if (query.valueMax !== undefined) {
      filter.leadValue.$lte = parseFloat(query.valueMax);
    }
  }
  
  // Date filters
  if (query.createdAfter) {
    filter.createdAt = { ...filter.createdAt, $gte: new Date(query.createdAfter) };
  }
  
  if (query.createdBefore) {
    filter.createdAt = { ...filter.createdAt, $lte: new Date(query.createdBefore) };
  }
  
  if (query.activityAfter) {
    filter.lastActivityAt = { ...filter.lastActivityAt, $gte: new Date(query.activityAfter) };
  }
  
  if (query.activityBefore) {
    filter.lastActivityAt = { ...filter.lastActivityAt, $lte: new Date(query.activityBefore) };
  }
  
  return filter;
};

const buildSortQuery = (sortBy = 'createdAt', sortOrder = 'desc') => {
  const sort = {};
  const validSortFields = ['createdAt', 'updatedAt', 'lastActivityAt', 'score', 'leadValue', 'firstName', 'lastName', 'company'];
  
  if (validSortFields.includes(sortBy)) {
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sort.createdAt = -1; // Default sort
  }
  
  return sort;
};

module.exports = {
  buildPaginationQuery,
  buildPaginationResponse,
  buildFilterQuery,
  buildSortQuery
};
