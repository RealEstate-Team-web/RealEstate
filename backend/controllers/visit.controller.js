const visitService = require("../services/visit.service");

const bookVisit = async (req, res, next) => {
  try {
    const { propertyId, visitDate, visitTime, notes } = req.body;
    const visit = await visitService.bookVisit(req.user.id, {
      propertyId,
      visitDate,
      visitTime,
      notes,
    });
    res.status(201).json({
      success: true,
      message: "Visit booked successfully",
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

const getBuyerVisits = async (req, res, next) => {
  try {
    const result = await visitService.getBuyerVisits(req.user.id, req.query);
    res.status(200).json({
      success: true,
      message: "Visits retrieved successfully",
      data: result.visits,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const cancelVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await visitService.cancelVisit(req.user.id, id);
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.visit,
    });
  } catch (error) {
    next(error);
  }
};

const rescheduleVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { visitDate, visitTime, notes } = req.body;
    const result = await visitService.rescheduleVisit(req.user.id, id, {
      visitDate,
      visitTime,
      notes,
    });
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.visit,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookVisit,
  getBuyerVisits,
  cancelVisit,
  rescheduleVisit,
};
