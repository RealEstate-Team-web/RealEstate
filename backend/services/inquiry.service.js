const Inquiry = require("../models/inquiry.model");

const ALLOWED_STATUSES = new Set(["pending", "read", "responded", "archived"]);

/**
 * Submit an initial inquiry for a property (Creates thread)
 * @param {number|string} buyerId
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function submitInquiry(buyerId, { propertyId, name, email, phone, message }) {
  const property = await Inquiry.getPropertyListingAgent(propertyId);
  if (!property) {
    const error = new Error("Property not found");
    error.status = 404;
    throw error;
  }

  if (property.status && property.status !== "available") {
    const error = new Error("Inquiries can only be submitted for available property listings");
    error.status = 400;
    throw error;
  }

  // Prevent users from inquiring on their own listing
  if (String(property.agentId) === String(buyerId)) {
    const error = new Error("You cannot submit an inquiry for your own property listing");
    error.status = 400;
    throw error;
  }

  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const cleanPhone = typeof phone === "string" && phone.trim() ? phone.trim() : null;
  const cleanMessage = typeof message === "string" ? message.trim() : "";

  const inquiryId = await Inquiry.create({
    property_id: propertyId,
    buyer_id: buyerId,
    agent_id: property.agentId,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    message: cleanMessage,
  });

  const createdInquiry = await Inquiry.findById(inquiryId);
  return createdInquiry;
}

/**
 * Send a message within an existing inquiry thread
 * @param {number|string} userId
 * @param {number|string} inquiryId
 * @param {string} messageText
 * @returns {Promise<Object>}
 */
async function replyToInquiry(userId, inquiryId, messageText) {
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) {
    const error = new Error("Inquiry not found");
    error.status = 404;
    throw error;
  }

  const isBuyer = String(inquiry.buyerId) === String(userId);
  const isAgent = String(inquiry.agentId) === String(userId);

  if (!isBuyer && !isAgent) {
    const error = new Error("You are not authorized to send messages in this inquiry");
    error.status = 403;
    throw error;
  }

  if (!messageText || typeof messageText !== "string" || !messageText.trim()) {
    const error = new Error("Message is required and must not be empty");
    error.status = 400;
    throw error;
  }

  const trimmed = messageText.trim();
  if (trimmed.length > 5000) {
    const error = new Error("Message cannot exceed 5000 characters");
    error.status = 400;
    throw error;
  }

  await Inquiry.addMessage(inquiryId, userId, trimmed);

  // Return refreshed inquiry with all messages
  return await Inquiry.findById(inquiryId);
}

/**
 * Retrieve all inquiries sent by a specific buyer
 * @param {number|string} buyerId
 * @param {Object} query
 * @returns {Promise<Object>}
 */
async function getBuyerInquiries(buyerId, query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(query.limit, 10) || 10));
  const offset = (page - 1) * limit;
  const rawStatus = query.status ? String(query.status).toLowerCase().trim() : "all";
  const status = ALLOWED_STATUSES.has(rawStatus) ? rawStatus : "all";
  const search = typeof query.search === "string" ? query.search.trim() : "";

  const [inquiries, total] = await Promise.all([
    Inquiry.findByBuyerId(buyerId, { status, search, limit, offset }),
    Inquiry.countByBuyerId(buyerId, { status, search }),
  ]);

  return {
    inquiries,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

/**
 * Retrieve a specific inquiry by ID with buyer authorization
 * @param {number|string} buyerId
 * @param {number|string} inquiryId
 * @returns {Promise<Object>}
 */
async function getBuyerInquiryById(buyerId, inquiryId) {
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) {
    const error = new Error("Inquiry not found");
    error.status = 404;
    throw error;
  }

  if (String(inquiry.buyerId) !== String(buyerId)) {
    const error = new Error("You are not authorized to view this inquiry");
    error.status = 403;
    throw error;
  }

  return inquiry;
}

/**
 * Retrieve all inquiries received by an agent
 * @param {number|string} agentId
 * @param {Object} query
 * @returns {Promise<Object>}
 */
async function getAgentInquiries(agentId, query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(query.limit, 10) || 10));
  const offset = (page - 1) * limit;
  const rawStatus = query.status ? String(query.status).toLowerCase().trim() : "all";
  const status = ALLOWED_STATUSES.has(rawStatus) ? rawStatus : "all";
  const search = typeof query.search === "string" ? query.search.trim() : "";

  const [inquiries, total] = await Promise.all([
    Inquiry.findByAgentId(agentId, { status, search, limit, offset }),
    Inquiry.countByAgentId(agentId, { status, search }),
  ]);

  return {
    inquiries,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

/**
 * Mark an inquiry as read (by the owning agent)
 * @param {number|string} agentId
 * @param {number|string} inquiryId
 * @returns {Promise<Object>}
 */
async function markInquiryRead(agentId, inquiryId) {
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) {
    const error = new Error("Inquiry not found");
    error.status = 404;
    throw error;
  }

  if (String(inquiry.agentId) !== String(agentId)) {
    const error = new Error("You are not authorized to manage this inquiry");
    error.status = 403;
    throw error;
  }

  await Inquiry.markAsRead(inquiryId, agentId);
  const updatedInquiry = await Inquiry.findById(inquiryId);
  return updatedInquiry;
}

module.exports = {
  submitInquiry,
  replyToInquiry,
  getBuyerInquiries,
  getBuyerInquiryById,
  getAgentInquiries,
  markInquiryRead,
};
