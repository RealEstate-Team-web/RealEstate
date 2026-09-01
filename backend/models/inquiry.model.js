const { query } = require("../config/db.config");

const Inquiry = {
  async create({ property_id, buyer_id, agent_id, name, email, phone, message }) {
    const sql = `
      INSERT INTO inquiries (
        property_id,
        buyer_id,
        agent_id,
        name,
        email,
        phone,
        message,
        status,
        is_read
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', FALSE)
    `;
    const result = await query(sql, [
      property_id,
      buyer_id,
      agent_id,
      name,
      email,
      phone || null,
      message,
    ]);

    const inquiryId = result.insertId;

    // Record initial message in inquiry_messages thread
    await query(
      `INSERT INTO inquiry_messages (inquiry_id, sender_id, message) VALUES (?, ?, ?)`,
      [inquiryId, buyer_id, message]
    );

    return inquiryId;
  },

  async addMessage(inquiryId, senderId, messageText) {
    const result = await query(
      `INSERT INTO inquiry_messages (inquiry_id, sender_id, message) VALUES (?, ?, ?)`,
      [inquiryId, senderId, messageText]
    );

    // Update the inquiry's updated_at timestamp
    await query(
      `UPDATE inquiries SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [inquiryId]
    );

    return result.insertId;
  },

  async getMessages(inquiryId) {
    const sql = `
      SELECT 
        im.id,
        im.inquiry_id AS inquiryId,
        im.sender_id AS senderId,
        im.message,
        im.created_at AS createdAt,
        u.first_name AS senderFirstName,
        u.last_name AS senderLastName,
        u.role AS senderRole,
        u.profile_image_url AS senderAvatar
      FROM inquiry_messages im
      JOIN users u ON u.id = im.sender_id
      WHERE im.inquiry_id = ?
      ORDER BY im.created_at ASC, im.id ASC
    `;
    const rows = await query(sql, [inquiryId]);
    return rows;
  },

  async findById(id) {
    const sql = `
      SELECT 
        i.id,
        i.property_id AS propertyId,
        i.buyer_id AS buyerId,
        i.agent_id AS agentId,
        i.name,
        i.email,
        i.phone,
        i.message,
        i.status,
        i.is_read AS isRead,
        i.created_at AS createdAt,
        i.updated_at AS updatedAt,
        p.title AS propertyTitle,
        p.price AS propertyPrice,
        p.address AS propertyAddress,
        p.city AS propertyCity,
        p.bedrooms,
        p.bathrooms,
        p.area,
        p.status AS propertyStatus,
        u_agent.first_name AS agentFirstName,
        u_agent.last_name AS agentLastName,
        u_agent.email AS agentEmail,
        u_agent.phone AS agentPhone,
        u_agent.profile_image_url AS agentAvatar,
        ap.agency_name AS agencyName,
        u_buyer.first_name AS buyerFirstName,
        u_buyer.last_name AS buyerLastName,
        u_buyer.email AS buyerEmail,
        u_buyer.phone AS buyerPhone,
        (
          SELECT pi.image_url 
          FROM property_images pi 
          WHERE pi.property_id = p.id 
          ORDER BY pi.is_cover DESC, pi.sort_order ASC, pi.id ASC 
          LIMIT 1
        ) AS propertyImage
      FROM inquiries i
      JOIN properties p ON p.id = i.property_id
      JOIN users u_agent ON u_agent.id = i.agent_id
      LEFT JOIN agent_profiles ap ON ap.user_id = i.agent_id
      JOIN users u_buyer ON u_buyer.id = i.buyer_id
      WHERE i.id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [id]);
    if (!rows[0]) return null;

    const inquiry = rows[0];
    inquiry.messages = await this.getMessages(id);
    return inquiry;
  },

  async findByBuyerId(buyerId, { status, search, limit = 10, offset = 0 } = {}) {
    let sql = `
      SELECT 
        i.id,
        i.property_id AS propertyId,
        i.buyer_id AS buyerId,
        i.agent_id AS agentId,
        i.name,
        i.email,
        i.phone,
        i.message,
        i.status,
        i.is_read AS isRead,
        i.created_at AS createdAt,
        i.updated_at AS updatedAt,
        p.title AS propertyTitle,
        p.price AS propertyPrice,
        p.address AS propertyAddress,
        p.city AS propertyCity,
        p.bedrooms,
        p.bathrooms,
        p.area,
        p.status AS propertyStatus,
        u_agent.first_name AS agentFirstName,
        u_agent.last_name AS agentLastName,
        u_agent.email AS agentEmail,
        u_agent.phone AS agentPhone,
        u_agent.profile_image_url AS agentAvatar,
        ap.agency_name AS agencyName,
        (
          SELECT pi.image_url 
          FROM property_images pi 
          WHERE pi.property_id = p.id 
          ORDER BY pi.is_cover DESC, pi.sort_order ASC, pi.id ASC 
          LIMIT 1
        ) AS propertyImage,
        (
          SELECT im.message 
          FROM inquiry_messages im 
          WHERE im.inquiry_id = i.id 
          ORDER BY im.created_at DESC, im.id DESC 
          LIMIT 1
        ) AS latestMessage,
        (
          SELECT COUNT(*) 
          FROM inquiry_messages im 
          WHERE im.inquiry_id = i.id
        ) AS messageCount
      FROM inquiries i
      JOIN properties p ON p.id = i.property_id
      JOIN users u_agent ON u_agent.id = i.agent_id
      LEFT JOIN agent_profiles ap ON ap.user_id = i.agent_id
      WHERE i.buyer_id = ?
    `;

    const params = [buyerId];

    if (status && status !== "all") {
      sql += " AND i.status = ?";
      params.push(status);
    }

    if (search && search.trim()) {
      sql += " AND (p.title LIKE ? OR p.city LIKE ? OR u_agent.first_name LIKE ? OR u_agent.last_name LIKE ? OR i.message LIKE ?)";
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term);
    }

    sql += " ORDER BY i.updated_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));

    const rows = await query(sql, params);
    return rows;
  },

  async countByBuyerId(buyerId, { status, search } = {}) {
    let sql = `
      SELECT COUNT(*) AS total
      FROM inquiries i
      JOIN properties p ON p.id = i.property_id
      JOIN users u_agent ON u_agent.id = i.agent_id
      WHERE i.buyer_id = ?
    `;

    const params = [buyerId];

    if (status && status !== "all") {
      sql += " AND i.status = ?";
      params.push(status);
    }

    if (search && search.trim()) {
      sql += " AND (p.title LIKE ? OR p.city LIKE ? OR u_agent.first_name LIKE ? OR u_agent.last_name LIKE ? OR i.message LIKE ?)";
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term);
    }

    const rows = await query(sql, params);
    return rows[0]?.total ? Number(rows[0].total) : 0;
  },

  async findByAgentId(agentId, { status, search, limit = 10, offset = 0 } = {}) {
    let sql = `
      SELECT 
        i.id,
        i.property_id AS propertyId,
        i.buyer_id AS buyerId,
        i.agent_id AS agentId,
        i.name,
        i.email,
        i.phone,
        i.message,
        i.status,
        i.is_read AS isRead,
        i.created_at AS createdAt,
        i.updated_at AS updatedAt,
        p.title AS propertyTitle,
        p.price AS propertyPrice,
        p.address AS propertyAddress,
        p.city AS propertyCity,
        u_buyer.first_name AS buyerFirstName,
        u_buyer.last_name AS buyerLastName,
        u_buyer.email AS buyerEmail,
        u_buyer.phone AS buyerPhone,
        u_buyer.profile_image_url AS buyerAvatar,
        (
          SELECT pi.image_url 
          FROM property_images pi 
          WHERE pi.property_id = p.id 
          ORDER BY pi.is_cover DESC, pi.sort_order ASC, pi.id ASC 
          LIMIT 1
        ) AS propertyImage,
        (
          SELECT im.message 
          FROM inquiry_messages im 
          WHERE im.inquiry_id = i.id 
          ORDER BY im.created_at DESC, im.id DESC 
          LIMIT 1
        ) AS latestMessage,
        (
          SELECT COUNT(*) 
          FROM inquiry_messages im 
          WHERE im.inquiry_id = i.id
        ) AS messageCount
      FROM inquiries i
      JOIN properties p ON p.id = i.property_id
      JOIN users u_buyer ON u_buyer.id = i.buyer_id
      WHERE i.agent_id = ?
    `;

    const params = [agentId];

    if (status && status !== "all") {
      sql += " AND i.status = ?";
      params.push(status);
    }

    if (search && search.trim()) {
      sql += " AND (p.title LIKE ? OR u_buyer.first_name LIKE ? OR u_buyer.last_name LIKE ? OR i.name LIKE ? OR i.message LIKE ?)";
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term);
    }

    sql += " ORDER BY i.updated_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));

    const rows = await query(sql, params);
    return rows;
  },

  async countByAgentId(agentId, { status, search } = {}) {
    let sql = `
      SELECT COUNT(*) AS total
      FROM inquiries i
      JOIN properties p ON p.id = i.property_id
      JOIN users u_buyer ON u_buyer.id = i.buyer_id
      WHERE i.agent_id = ?
    `;

    const params = [agentId];

    if (status && status !== "all") {
      sql += " AND i.status = ?";
      params.push(status);
    }

    if (search && search.trim()) {
      sql += " AND (p.title LIKE ? OR u_buyer.first_name LIKE ? OR u_buyer.last_name LIKE ? OR i.name LIKE ? OR i.message LIKE ?)";
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term);
    }

    const rows = await query(sql, params);
    return rows[0]?.total ? Number(rows[0].total) : 0;
  },

  async markAsRead(id, agentId) {
    const sql = `
      UPDATE inquiries
      SET is_read = TRUE,
          status = CASE WHEN status = 'pending' THEN 'read' ELSE status END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND agent_id = ?
    `;
    const result = await query(sql, [id, agentId]);
    return result.affectedRows;
  },

  async getPropertyListingAgent(propertyId) {
    const sql = `
      SELECT id, agent_id AS agentId, status, title
      FROM properties
      WHERE id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [propertyId]);
    return rows[0] || null;
  },
};

module.exports = Inquiry;
