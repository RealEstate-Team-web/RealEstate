const { query, pool } = require("../config/db.config");

const Visit = {
  async create({ property_id, buyer_id, agent_id, visit_date, visit_time, notes }) {
    const sql = `
      INSERT INTO visit_bookings (
        property_id,
        buyer_id,
        agent_id,
        visit_date,
        visit_time,
        status,
        notes
      ) VALUES (?, ?, ?, ?, ?, 'pending', ?)
    `;
    const result = await query(sql, [
      property_id,
      buyer_id,
      agent_id,
      visit_date,
      visit_time,
      notes || null,
    ]);
    return result.insertId;
  },

  async createAtomic({ property_id, buyer_id, agent_id, visit_date, visit_time, notes }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [conflicts] = await conn.execute(
        `SELECT id FROM visit_bookings 
         WHERE property_id = ? AND buyer_id = ? AND visit_date = ? AND visit_time = ? AND status IN ('pending', 'approved') 
         FOR UPDATE`,
        [property_id, buyer_id, visit_date, visit_time]
      );

      if (conflicts.length > 0) {
        await conn.rollback();
        const error = new Error(
          "You already have a visit scheduled for this property at this date and time"
        );
        error.status = 409;
        throw error;
      }

      const [res] = await conn.execute(
        `INSERT INTO visit_bookings (
          property_id, buyer_id, agent_id, visit_date, visit_time, status, notes
        ) VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
        [property_id, buyer_id, agent_id, visit_date, visit_time, notes || null]
      );
      await conn.commit();
      return res.insertId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async findById(id) {
    const sql = `
      SELECT 
        v.id,
        v.property_id AS propertyId,
        v.buyer_id AS buyerId,
        v.agent_id AS agentId,
        DATE_FORMAT(v.visit_date, '%Y-%m-%d') AS visitDate,
        TIME_FORMAT(v.visit_time, '%H:%i') AS visitTime,
        v.status,
        v.notes,
        v.created_at AS createdAt,
        v.updated_at AS updatedAt,
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
        ) AS propertyImage
      FROM visit_bookings v
      JOIN properties p ON p.id = v.property_id
      JOIN users u_agent ON u_agent.id = v.agent_id
      LEFT JOIN agent_profiles ap ON ap.user_id = v.agent_id
      WHERE v.id = ?
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  },

  async findByBuyerId(buyerId, { status, search, limit, offset } = {}) {
    const params = [buyerId];
    let sql = `
      SELECT 
        v.id,
        v.property_id AS propertyId,
        v.buyer_id AS buyerId,
        v.agent_id AS agentId,
        DATE_FORMAT(v.visit_date, '%Y-%m-%d') AS visitDate,
        TIME_FORMAT(v.visit_time, '%H:%i') AS visitTime,
        v.status,
        v.notes,
        v.created_at AS createdAt,
        v.updated_at AS updatedAt,
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
        ) AS propertyImage
      FROM visit_bookings v
      JOIN properties p ON p.id = v.property_id
      JOIN users u_agent ON u_agent.id = v.agent_id
      LEFT JOIN agent_profiles ap ON ap.user_id = v.agent_id
      WHERE v.buyer_id = ?
    `;

    if (status && status !== "all") {
      sql += " AND v.status = ?";
      params.push(status);
    }

    if (search && search.trim()) {
      sql += " AND (p.title LIKE ? OR p.city LIKE ? OR u_agent.first_name LIKE ? OR u_agent.last_name LIKE ?)";
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += " ORDER BY v.visit_date ASC, v.visit_time ASC, v.created_at DESC";

    if (limit !== undefined && offset !== undefined) {
      sql += " LIMIT ? OFFSET ?";
      params.push(Number(limit), Number(offset));
    }

    return query(sql, params);
  },

  async countByBuyerId(buyerId, { status, search } = {}) {
    const params = [buyerId];
    let sql = `
      SELECT COUNT(*) AS total
      FROM visit_bookings v
      JOIN properties p ON p.id = v.property_id
      JOIN users u_agent ON u_agent.id = v.agent_id
      WHERE v.buyer_id = ?
    `;

    if (status && status !== "all") {
      sql += " AND v.status = ?";
      params.push(status);
    }

    if (search && search.trim()) {
      sql += " AND (p.title LIKE ? OR p.city LIKE ? OR u_agent.first_name LIKE ? OR u_agent.last_name LIKE ?)";
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    const rows = await query(sql, params);
    return rows[0]?.total ? Number(rows[0].total) : 0;
  },

  async updateStatus(id, status) {
    const sql = `
      UPDATE visit_bookings
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const result = await query(sql, [status, id]);
    return result.affectedRows;
  },

  async reschedule(id, { visit_date, visit_time, notes }) {
    const sql = `
      UPDATE visit_bookings
      SET 
        visit_date = ?,
        visit_time = ?,
        notes = COALESCE(?, notes),
        status = 'pending',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const result = await query(sql, [visit_date, visit_time, notes || null, id]);
    return result.affectedRows;
  },

  async rescheduleAtomic(id, buyerId, { visit_date, visit_time, notes }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [visits] = await conn.execute(
        `SELECT id, buyer_id, property_id, status FROM visit_bookings WHERE id = ? FOR UPDATE`,
        [id]
      );

      if (!visits.length) {
        await conn.rollback();
        const error = new Error("Visit booking not found");
        error.status = 404;
        throw error;
      }

      const visit = visits[0];
      if (String(visit.buyer_id) !== String(buyerId)) {
        await conn.rollback();
        const error = new Error("You are not authorized to reschedule this visit booking");
        error.status = 403;
        throw error;
      }

      if (visit.status === "completed" || visit.status === "cancelled") {
        await conn.rollback();
        const error = new Error(
          `${visit.status.charAt(0).toUpperCase() + visit.status.slice(1)} visits cannot be rescheduled`
        );
        error.status = 400;
        throw error;
      }

      const [conflicts] = await conn.execute(
        `SELECT id FROM visit_bookings 
         WHERE property_id = ? AND buyer_id = ? AND visit_date = ? AND visit_time = ? AND status IN ('pending', 'approved') AND id != ?
         FOR UPDATE`,
        [visit.property_id, buyerId, visit_date, visit_time, id]
      );

      if (conflicts.length > 0) {
        await conn.rollback();
        const error = new Error(
          "You already have a visit scheduled for this property at this date and time"
        );
        error.status = 409;
        throw error;
      }

      await conn.execute(
        `UPDATE visit_bookings
         SET visit_date = ?,
             visit_time = ?,
             notes = COALESCE(?, notes),
             status = 'pending',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [visit_date, visit_time, notes || null, id]
      );

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async findConflictingVisit({ property_id, buyer_id, visit_date, visit_time, exclude_id }) {
    let sql = `
      SELECT id, status, visit_date, visit_time
      FROM visit_bookings
      WHERE property_id = ?
        AND buyer_id = ?
        AND visit_date = ?
        AND visit_time = ?
        AND status IN ('pending', 'approved')
    `;
    const params = [property_id, buyer_id, visit_date, visit_time];
    if (exclude_id) {
      sql += " AND id != ?";
      params.push(exclude_id);
    }
    sql += " LIMIT 1";
    const rows = await query(sql, params);
    return rows[0] || null;
  },

  async getPropertyAgent(propertyId) {
    const sql = `
      SELECT id, agent_id AS agentId, status
      FROM properties
      WHERE id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [propertyId]);
    return rows[0] || null;
  },
};

module.exports = Visit;
