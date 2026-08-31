const Visit = require("../models/visit.model");

/**
 * Validates that visit date and time are in the future
 * @param {string} visitDate YYYY-MM-DD
 * @param {string} visitTime HH:MM or HH:MM:SS
 */
function validateFutureDateTime(visitDate, visitTime) {
  const visitDateTime = new Date(`${visitDate}T${visitTime.length === 5 ? `${visitTime}:00` : visitTime}`);
  if (isNaN(visitDateTime.getTime())) {
    const error = new Error("Invalid visit date or time format");
    error.status = 400;
    throw error;
  }
  if (visitDateTime <= new Date()) {
    const error = new Error("Visit date and time must be in the future");
    error.status = 400;
    throw error;
  }
}

/**
 * Schedule a new property visit
 * @param {number|string} buyerId
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function bookVisit(buyerId, { propertyId, visitDate, visitTime, notes }) {
  const property = await Visit.getPropertyAgent(propertyId);
  if (!property) {
    const error = new Error("Property not found");
    error.status = 404;
    throw error;
  }

  validateFutureDateTime(visitDate, visitTime);

  const existingConflict = await Visit.findConflictingVisit({
    property_id: propertyId,
    buyer_id: buyerId,
    visit_date: visitDate,
    visit_time: visitTime,
  });

  if (existingConflict) {
    const error = new Error(
      "You already have a visit scheduled for this property at this date and time"
    );
    error.status = 409;
    throw error;
  }

  const visitId = await Visit.create({
    property_id: propertyId,
    buyer_id: buyerId,
    agent_id: property.agentId,
    visit_date: visitDate,
    visit_time: visitTime,
    notes: notes || null,
  });

  const createdVisit = await Visit.findById(visitId);
  return createdVisit;
}

/**
 * Retrieve all visits for a specific buyer
 * @param {number|string} buyerId
 * @param {Object} query
 * @returns {Promise<Object>}
 */
async function getBuyerVisits(buyerId, query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(query.limit, 10) || 10));
  const offset = (page - 1) * limit;
  const status = query.status || "all";
  const search = query.search || "";

  const [visits, total] = await Promise.all([
    Visit.findByBuyerId(buyerId, { status, search, limit, offset }),
    Visit.countByBuyerId(buyerId, { status, search }),
  ]);

  return {
    visits,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

/**
 * Cancel a scheduled visit
 * @param {number|string} buyerId
 * @param {number|string} visitId
 * @returns {Promise<Object>}
 */
async function cancelVisit(buyerId, visitId) {
  const visit = await Visit.findById(visitId);
  if (!visit) {
    const error = new Error("Visit booking not found");
    error.status = 404;
    throw error;
  }

  if (String(visit.buyerId) !== String(buyerId)) {
    const error = new Error("You are not authorized to cancel this visit booking");
    error.status = 403;
    throw error;
  }

  if (visit.status === "cancelled") {
    return {
      message: "Visit booking is already cancelled",
      visit,
    };
  }

  if (visit.status === "completed") {
    const error = new Error("Completed visits cannot be cancelled");
    error.status = 400;
    throw error;
  }

  await Visit.updateStatus(visitId, "cancelled");
  const updatedVisit = await Visit.findById(visitId);
  return {
    message: "Visit booking successfully cancelled",
    visit: updatedVisit,
  };
}

/**
 * Reschedule a scheduled visit
 * @param {number|string} buyerId
 * @param {number|string} visitId
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function rescheduleVisit(buyerId, visitId, { visitDate, visitTime, notes }) {
  const visit = await Visit.findById(visitId);
  if (!visit) {
    const error = new Error("Visit booking not found");
    error.status = 404;
    throw error;
  }

  if (String(visit.buyerId) !== String(buyerId)) {
    const error = new Error("You are not authorized to reschedule this visit booking");
    error.status = 403;
    throw error;
  }

  if (visit.status === "completed") {
    const error = new Error("Completed visits cannot be rescheduled");
    error.status = 400;
    throw error;
  }

  validateFutureDateTime(visitDate, visitTime);

  await Visit.reschedule(visitId, {
    visit_date: visitDate,
    visit_time: visitTime,
    notes,
  });

  const updatedVisit = await Visit.findById(visitId);
  return {
    message: "Visit booking successfully rescheduled",
    visit: updatedVisit,
  };
}

module.exports = {
  bookVisit,
  getBuyerVisits,
  cancelVisit,
  rescheduleVisit,
};
