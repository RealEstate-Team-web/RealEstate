"use strict";

const propertyModel = require("../models/property.model");
const visitModel = require("../models/visit.model");
const inquiryModel = require("../models/inquiry.model");
const favoriteModel = require("../models/favorite.model");
const Agent = require("../models/agent.model");
const User = require("../models/user.model");
const { withTransaction, toDateKey } = require("../config/db.config");

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

function toSafeAgentProfile(row) {
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    role: "agent",
    userStatus: row.userStatus,
    profileImageUrl: row.profileImageUrl || null,
    memberSince: row.userCreatedAt || null,
    agency: row.agency,
    licenseNumber: row.licenseNumber,
    experienceYears: row.experienceYears,
    specialization: row.specialization,
    officeAddress: row.officeAddress,
    city: row.city,
    bio: row.bio,
    verificationStatus: row.status,
  };
}

const getAgentProfile = async (userId) => {
  const row = await Agent.findByUserId(userId);
  if (!row) {
    const error = new Error(
      "Agent profile not found. Complete your agent profile to continue."
    );
    error.status = 404;
    throw error;
  }
  return toSafeAgentProfile(row);
};

const updateAgentProfile = async (userId, fields) => {
  const existing = await Agent.findByUserId(userId);
  if (!existing) {
    const error = new Error("Agent profile not found");
    error.status = 404;
    throw error;
  }

  const userFields = {};
  if (fields.firstName !== undefined) userFields.firstName = fields.firstName;
  if (fields.lastName !== undefined) userFields.lastName = fields.lastName;
  if (fields.phone !== undefined) userFields.phone = fields.phone;

  const agentFields = {};
  if (fields.agencyName !== undefined) agentFields.agency_name = fields.agencyName;
  if (fields.specialization !== undefined)
    agentFields.specialization = fields.specialization;
  if (fields.officeAddress !== undefined)
    agentFields.office_address = fields.officeAddress;
  if (fields.city !== undefined) agentFields.city = fields.city;
  if (fields.bio !== undefined) agentFields.bio = fields.bio;

  const hasUserFields = Object.keys(userFields).length > 0;
  const hasAgentFields = Object.keys(agentFields).length > 0;

  if (hasUserFields || hasAgentFields) {
    await withTransaction(async (conn) => {
      if (hasUserFields) {
        await User.updateProfile(userId, userFields, conn);
      }
      if (hasAgentFields) {
        await Agent.updateProfile(userId, agentFields, conn);
      }
    });
  }

  return getAgentProfile(userId);
};

const TREND_DAYS = 30;
const COMPARISON_DAYS = 7;

function buildDenseTrend(days, favoritesByDay, inquiriesByDay) {
  const favMap = new Map(favoritesByDay.map((row) => [row.date, row.count]));
  const inqMap = new Map(inquiriesByDay.map((row) => [row.date, row.count]));

  const trend = [];
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    trend.push({
      date: key,
      favorites: favMap.get(key) || 0,
      inquiries: inqMap.get(key) || 0,
    });
  }
  return trend;
}

function buildTwoPeriodSeries(favoritesByDay) {
  const map = new Map(favoritesByDay.map((row) => [row.date, row.count]));
  const current = [];
  const previous = [];
  const labels = [];

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  for (let i = COMPARISON_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    labels.push(key.slice(5));
    current.push(map.get(key) || 0);
    const prev = new Date(d);
    prev.setDate(prev.getDate() - COMPARISON_DAYS);
    previous.push(map.get(toDateKey(prev)) || 0);
  }
  return { labels, current, previous };
}

const getAnalytics = async (agentId) => {
  const [
    properties,
    scheduledVisits,
    completedVisitsRow,
    totalInquiriesRow,
    unreadMessages,
    favoritesCount,
    inquiryByStatus,
    favoritesByDay,
    inquiriesByDay,
    topResult,
  ] = await Promise.all([
    propertyModel.countByAgent(agentId),
    visitModel.countScheduledByAgentId(agentId),
    visitModel.countByAgentId(agentId, { status: "completed" }),
    inquiryModel.countByAgentId(agentId),
    inquiryModel.countUnreadByAgentId(agentId),
    favoriteModel.countByAgent(agentId),
    inquiryModel.countByStatusForAgent(agentId),
    favoriteModel.countByAgentDay(agentId, TREND_DAYS + COMPARISON_DAYS),
    inquiryModel.countByAgentDay(agentId, TREND_DAYS),
    propertyModel.findPropertiesByAgent({
      agentId,
      sort: "most_viewed",
      page: 1,
      limit: 5,
    }),
  ]);

  const completedVisits = Number(completedVisitsRow) || 0;
  const totalInquiries = Number(totalInquiriesRow) || 0;

  const topProperties = (topResult?.properties || []).map((p) => ({
    id: p.id,
    title: p.title,
    city: p.city,
    status: p.status,
    listingType: p.listingType,
    price: Number(p.price) || 0,
    views: Number(p.views) || 0,
    leads: Number(p.leads) || 0,
    coverImage: p.coverImage || null,
  }));

  const propertyFavorites = await favoriteModel.countByAgentProperties(
    agentId,
    topProperties.map((p) => p.id)
  );
  const favoritesByProperty = new Map(
    propertyFavorites.map((row) => [row.propertyId, row.count])
  );

  const enrichedTopProperties = topProperties.map((p) => ({
    ...p,
    favorites: favoritesByProperty.get(p.id) || 0,
    inquiries: Number(p.leads) || 0,
  }));

  const visitsTotal = scheduledVisits + completedVisits;
  const completionRate =
    visitsTotal > 0 ? Math.round((completedVisits / visitsTotal) * 100) : 0;

  return {
    kpis: {
      totalProperties: properties.total,
      activeListings: properties.active,
      soldRented: properties.closed,
      scheduledVisits,
      completedVisits,
      totalInquiries,
      unreadMessages,
      favoritesCount: Number(favoritesCount) || 0,
    },
    topProperties: enrichedTopProperties,
    engagementTrend: buildDenseTrend(
      TREND_DAYS,
      favoritesByDay,
      inquiriesByDay
    ),
    favoritesTrend: buildTwoPeriodSeries(favoritesByDay),
    inquiryByStatus: {
      pending: Number(inquiryByStatus.pending) || 0,
      read: Number(inquiryByStatus.read) || 0,
      responded: Number(inquiryByStatus.responded) || 0,
      archived: Number(inquiryByStatus.archived) || 0,
    },
    visitsGauge: {
      completed: completedVisits,
      scheduled: scheduledVisits,
      total: visitsTotal,
      rate: completionRate,
    },
  };
};

module.exports = {
  getDashboardStats,
  getAgentProfile,
  updateAgentProfile,
  getAnalytics,
};
