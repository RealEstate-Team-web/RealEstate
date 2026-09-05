"use strict";

const propertyModel = require("../models/property.model");
const visitModel = require("../models/visit.model");
const inquiryModel = require("../models/inquiry.model");

const getDashboardStats = async (agentId) => {
  const [properties, scheduledVisits, unreadMessages] = await Promise.all([
    propertyModel.countByAgent(agentId),
    visitModel.countScheduledByAgentId(agentId),
    inquiryModel.countUnreadByAgentId(agentId),
  ]);

  return {
    totalProperties: properties.total,
    activeListings: properties.active,
    soldRented: properties.closed,
    scheduledVisits,
    unreadMessages,
  };
};

module.exports = {
  getDashboardStats,
};