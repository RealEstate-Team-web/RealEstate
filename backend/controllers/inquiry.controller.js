const inquiryService = require("../services/inquiry.service");

/**
 * Submit an inquiry for a property
 * POST /api/inquiries
 */
async function submitInquiry(req, res, next) {
  try {
    const buyerId = req.user.id;
    const { propertyId, name, email, phone, message } = req.body;

    const inquiry = await inquiryService.submitInquiry(buyerId, {
      propertyId,
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reply / Send message in an inquiry thread
 * POST /api/inquiries/:id/messages
 */
async function replyToInquiry(req, res, next) {
  try {
    const userId = req.user.id;
    const inquiryId = req.params.id;
    const { message } = req.body;

    const inquiry = await inquiryService.replyToInquiry(userId, inquiryId, message);

    res.status(201).json({
      success: true,
      message: "Message sent",
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all inquiries sent by the logged-in buyer
 * GET /api/inquiries
 */
async function getBuyerInquiries(req, res, next) {
  try {
    const buyerId = req.user.id;
    const { inquiries, pagination } = await inquiryService.getBuyerInquiries(
      buyerId,
      req.query
    );

    res.status(200).json({
      success: true,
      message: "Inquiries retrieved successfully",
      data: inquiries,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific inquiry by ID (Participant view: Buyer or Agent)
 * GET /api/inquiries/:id
 */
async function getInquiryById(req, res, next) {
  try {
    const userId = req.user.id;
    const inquiryId = req.params.id;

    const inquiry = await inquiryService.getInquiryById(userId, inquiryId);

    res.status(200).json({
      success: true,
      message: "Inquiry retrieved successfully",
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all inquiries received by the logged-in agent
 * GET /api/agent/inquiries
 */
async function getAgentInquiries(req, res, next) {
  try {
    const agentId = req.user.id;
    const { inquiries, pagination } = await inquiryService.getAgentInquiries(
      agentId,
      req.query
    );

    res.status(200).json({
      success: true,
      message: "Inquiries retrieved successfully",
      data: inquiries,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Mark an inquiry as read (Agent view)
 * PATCH /api/inquiries/:id/read
 */
async function markInquiryRead(req, res, next) {
  try {
    const agentId = req.user.id;
    const inquiryId = req.params.id;

    const inquiry = await inquiryService.markInquiryRead(agentId, inquiryId);

    res.status(200).json({
      success: true,
      message: "Inquiry marked as read",
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitInquiry,
  replyToInquiry,
  getBuyerInquiries,
  getInquiryById,
  getBuyerInquiryById: getInquiryById,
  getAgentInquiries,
  markInquiryRead,
};
