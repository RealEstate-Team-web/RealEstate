"use strict";

const { query, withTransaction } = require("../config/db.config");


const propertyModel = {

    async findProperties({
        city,
        location,
        q,
        minPrice,
        maxPrice,
        categoryId,
        bedrooms,
        bathrooms,
        minArea,
        maxArea,
        parking,
        listingType,
        sort = "newest",
        page = 1,
        limit = 12,
    }) {
        const conditions = [];
        const params = [];

        conditions.push("p.status = 'available'");

        if (city) {
            conditions.push("p.city = ?");
            params.push(city);
        }

        if (location) {
            conditions.push(`
            (
                p.address LIKE ?
                OR p.city LIKE ?
            )
            `);

            const search = `%${location}%`;

            params.push(search, search);
        }

        if (typeof q === 'string' && q.trim()) {
            const keyword = `%${q.trim()}%`;
            conditions.push(`
            (
                p.title LIKE ?
                OR p.description LIKE ?
                OR p.city LIKE ?
                OR p.address LIKE ?
            )
            `);
            params.push(keyword, keyword, keyword, keyword);
        }

        if (minPrice) {
            conditions.push("p.price >= ?");
            params.push(minPrice);
        }

        if (maxPrice) {
            conditions.push("p.price <= ?");
            params.push(maxPrice);
        }

        if (categoryId) {
            conditions.push("p.category_id = ?");
            params.push(categoryId);
        }

        if (bedrooms) {
            conditions.push("p.bedrooms >= ?");
            params.push(bedrooms);
        }

        if (bathrooms) {
            conditions.push("p.bathrooms >= ?");
            params.push(bathrooms);
        }

        if (minArea) {
            conditions.push("p.area >= ?");
            params.push(minArea);
        }

        if (maxArea) {
            conditions.push("p.area <= ?");
            params.push(maxArea);
        }

        if (parking === "true") {
            conditions.push(
                "p.parking_spaces > 0"
            );
        }

        if (listingType) {
            conditions.push(
                "p.listing_type = ?"
            );

            params.push(listingType);
        }

        const sortOptions = {
            newest: "p.created_at DESC",
            lowest_price: "p.price ASC",
            highest_price: "p.price DESC",
        };

        const orderBy =
            sortOptions[sort] ||
            sortOptions.newest;

        const offset =
            (page - 1) * limit;

        const sql = `
            SELECT
            p.id,
            p.title,
            p.price,
            p.address,
            p.city,
            p.country,

            p.bedrooms,
            p.bathrooms,
            p.parking_spaces AS parking,
            p.area,

            p.listing_type AS listingType,
            p.status,

            p.latitude,
            p.longitude,

            p.views,
            p.created_at AS createdAt,

            p.category_id AS categoryId,

            (
                SELECT image_url
                FROM property_images
                WHERE property_id = p.id AND is_cover = 1
                ORDER BY id ASC
                LIMIT 1
            ) AS coverImage

            FROM properties p

            WHERE ${conditions.join(" AND ")}

            ORDER BY ${orderBy}

            LIMIT ? OFFSET ?
        `;

        params.push(Number(limit));
        params.push(Number(offset));

        const properties =
            await query(sql, params);


        const countSql = `
            SELECT COUNT(*) AS total
            FROM properties p
            WHERE ${conditions.join(" AND ")}
        `;

        const countParams =
            params.slice(0, -2);

        const countResult =
            await query(
                countSql,
                countParams
            );


        return {
            properties,
            total: Number(
                countResult[0].total
            ),
        };
    },


    // Get featured (available) properties ordered by popularity/nonewness
    async findFeatured({ limit = 6 } = {}) {
        const fallback = 6;
        let featuredLimit;
        if (limit == null) {
            featuredLimit = fallback;
        } else {
            const parsed = Number(limit);
            featuredLimit = Number.isInteger(parsed)
                ? Math.min(Math.max(parsed, 1), 50)
                : fallback;
        }

        const sql = `
            SELECT
            p.id,
            p.title,
            p.price,
            p.address,
            p.city,
            p.country,
            p.bedrooms,
            p.bathrooms,
            p.parking_spaces AS parking,
            p.area,
            p.listing_type AS listingType,
            p.status,
            p.latitude,
            p.longitude,
            p.views,
            p.created_at AS createdAt,
            p.category_id AS categoryId,
            (
                SELECT image_url
                FROM property_images
                WHERE property_id = p.id AND is_cover = 1
                ORDER BY id ASC
                LIMIT 1
            ) AS coverImage
            FROM properties p
            WHERE p.status = 'available'
            ORDER BY p.views DESC, p.created_at DESC
            LIMIT ?
        `;

        const properties = await query(sql, [featuredLimit]);

        return properties;
    },


    // Get one property with images and agent details
    async findPropertyById(id) {
        const sql = `
            SELECT
                p.*,
                p.parking_spaces AS parking,
                p.listing_type AS listingType,
                u.first_name AS agentFirstName,
                u.last_name AS agentLastName,
                u.email AS agentEmail,
                u.phone AS agentPhone,
                u.profile_image_url AS agentPhoto,
                ap.agency_name AS agencyName,
                ap.bio AS agentBio,
                ap.experience_years AS agentExperience,
                ap.office_address AS agentOfficeAddress
            FROM properties p
            LEFT JOIN users u ON u.id = p.agent_id
            LEFT JOIN agent_profiles ap ON ap.user_id = p.agent_id
            WHERE p.id = ?
            LIMIT 1
        `;

        const rows = await query(sql, [id]);
        if (!rows[0]) return null;

        const p = rows[0];

        // Fetch images
        const imageRows = await query(
            `SELECT image_url AS imageUrl, public_id AS publicId, sort_order AS sortOrder, is_cover AS isCover FROM property_images WHERE property_id = ? ORDER BY is_cover DESC, sort_order ASC, id ASC`,
            [id]
        );

        const images = imageRows.length > 0
            ? imageRows.map(img => ({
                imageUrl: img.imageUrl,
                publicId: img.publicId,
                sortOrder: img.sortOrder,
                isCover: !!img.isCover,
            }))
            : [];

        // Fetch amenities
        let amenities = [];
        const amenityRows = await query(
            `SELECT a.name FROM property_amenities pa JOIN amenities a ON a.id = pa.amenity_id WHERE pa.property_id = ?`,
            [id]
        );
        amenities = Array.isArray(amenityRows) ? amenityRows.map(a => a.name) : [];

        return {
            ...p,
            images,
            amenities,
            location: {
                address: p.address,
                city: p.city,
                country: p.country,
                latitude: p.latitude,
                longitude: p.longitude,
            },
            agent: {
                id: p.agent_id,
                name: `${p.agentFirstName || ''} ${p.agentLastName || ''}`.trim() || 'Listing Agent',
                email: p.agentEmail,
                phone: p.agentPhone,
                photo: p.agentPhoto,
                bio: p.agentBio,
                experienceYears: p.agentExperience,
                agencyName: p.agencyName,
                role: 'Listing Agent',
                location: p.agentOfficeAddress || p.city,
            }
        };
    },


    // Create property
    async createProperty(data, executor = query) {
        if (!data.agentId) {
            const error = new Error("agent_id is required");
            error.statusCode = 400;
            throw error;
        }

        const sql = `
            INSERT INTO properties (
                agent_id,
                category_id,
                title,
                description,
                listing_type,
                price,
                bedrooms,
                bathrooms,
                parking_spaces,
                area,
                country,
                city,
                address,
                latitude,
                longitude,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            data.agentId,
            data.categoryId,
            data.title,
            data.description,
            data.listingType,
            data.price,
            data.bedrooms ?? null,
            data.bathrooms ?? null,
            data.parkingSpaces ?? null,
            data.area ?? null,
            data.country,
            data.city,
            data.address ?? null,
            data.latitude ?? null,
            data.longitude ?? null,
            data.status || "available",
        ];

        const result = await executor(sql, params);

        return result.insertId;
    },


    // Update property
    async updateProperty(
        id,
        data,
        executor = query
    ) {
        const fields = [];
        const params = [];

        const allowedFields = {
            title: "title",
            description: "description",
            categoryId: "category_id",
            listingType: "listing_type",
            price: "price",
            bedrooms: "bedrooms",
            bathrooms: "bathrooms",
            parkingSpaces: "parking_spaces",
            area: "area",
            country: "country",
            city: "city",
            address: "address",
            latitude: "latitude",
            longitude: "longitude",
            status: "status",
        };

        for (const [key, column] of Object.entries(
            allowedFields
        )) {
            if (data[key] !== undefined) {
                fields.push(`${column} = ?`);
                params.push(data[key]);
            }
        }

        if (!fields.length) {
            return false;
        }

        params.push(id);

        const sql = `
            UPDATE properties
            SET ${fields.join(", ")}
            WHERE id = ?
        `;

        const result =
            await executor(sql, params);

        return result.affectedRows > 0;
    },


    // Delete property
    async deleteProperty(
        id
    ) {
        const sql = `
            DELETE FROM properties
            WHERE id = ?
        `;

        const result =
            await query(sql, [id]);

        return result.affectedRows > 0;
    },

    // Lean ownership lookup (avoids fetching full property for authorization)
    async findPropertyOwner(id) {
        const rows = await query(
            "SELECT agent_id FROM properties WHERE id = ? LIMIT 1",
            [id]
        );
        return rows[0] || null;
    },

    // Agent-scoped listings with cover image, views, and inquiry leads
    async findPropertiesByAgent({
        agentId,
        status,
        q,
        listingType,
        location,
        sort = "newest",
        page = 1,
        limit = 10,
    }) {
        const conditions = ["p.agent_id = ?"];
        const params = [agentId];

        if (status) {
            conditions.push("p.status = ?");
            params.push(status);
        }

        if (listingType) {
            conditions.push("p.listing_type = ?");
            params.push(listingType);
        }

        if (location) {
            const search = `%${location}%`;
            conditions.push(`
            (
                p.address LIKE ?
                OR p.city LIKE ?
            )
            `);
            params.push(search, search);
        }

        if (typeof q === "string" && q.trim()) {
            const keyword = `%${q.trim()}%`;
            conditions.push(`
            (
                p.title LIKE ?
                OR p.city LIKE ?
                OR p.address LIKE ?
            )
            `);
            params.push(keyword, keyword, keyword);
        }

        const sortOptions = {
            newest: "p.created_at DESC, p.id DESC",
            lowest_price: "p.price ASC, p.id ASC",
            highest_price: "p.price DESC, p.id ASC",
            most_viewed: "p.views DESC, p.id ASC",
        };

        const orderBy = sortOptions[sort] || sortOptions.newest;
        const offset = (page - 1) * limit;

        const sql = `
            SELECT
                p.id,
                p.title,
                p.price,
                p.address,
                p.city,
                p.country,
                p.bedrooms,
                p.bathrooms,
                p.parking_spaces AS parking,
                p.area,
                p.listing_type AS listingType,
                p.status,
                p.latitude,
                p.longitude,
                p.views,
                p.created_at AS createdAt,
                p.category_id AS categoryId,
                (SELECT image_url
                 FROM property_images
                 WHERE property_id = p.id
                   AND is_cover = 1
                 ORDER BY sort_order ASC, id ASC
                 LIMIT 1) AS coverImage,
                (SELECT COUNT(*)
                 FROM inquiries i
                 WHERE i.property_id = p.id) AS leads
            FROM properties p
            WHERE ${conditions.join(" AND ")}
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ?
        `;

        const properties = await query(sql, [
            ...params,
            Number(limit),
            Number(offset),
        ]);

        const countSql = `
            SELECT COUNT(*) AS total
            FROM properties p
            WHERE ${conditions.join(" AND ")}
        `;

        const countResult = await query(countSql, params);

        return {
            properties,
            total: Number(countResult[0].total),
        };
    },

    // Count images currently attached to a property.
    async countPropertyImages(propertyId) {
        const [row] = await query(
            "SELECT COUNT(*) AS count FROM property_images WHERE property_id = ?",
            [propertyId],
        );
        return Number(row.count);
    },

    // Public ids of images attached to a property (for Cloudinary cleanup).
    async findPropertyImages(propertyId) {
        const rows = await query(
            "SELECT public_id AS publicId FROM property_images WHERE property_id = ?",
            [propertyId],
        );
        return rows.map((row) => row.publicId).filter(Boolean);
    },

    // Add property images, marking the first new image as the cover only
    // when the property has no existing images. sort_order is offset by
    // the property's existing image count so the order stays stable.
    // Runs in a transaction with a locking count so concurrent uploads
    // cannot produce overlapping sort_order values or multiple covers.
    async insertPropertyImages(propertyId, images, maxTotal = Infinity) {
        if (!images || images.length === 0) return [];

        return withTransaction(async (connection) => {
            const executor = async (sql, params) => (await connection.execute(sql, params))[0];

            const [countRow] = await executor(
                "SELECT COUNT(*) AS count FROM property_images WHERE property_id = ? FOR UPDATE",
                [propertyId],
            );
            const existingCount = Number(countRow.count);

            if (existingCount + images.length > maxTotal) {
                const error = new Error(
                    `A property can have at most ${maxTotal} images`,
                );
                error.statusCode = 400;
                throw error;
            }

            const rows = images.map((image, index) => [
                propertyId,
                image.imageUrl,
                image.publicId,
                existingCount + index,
                existingCount === 0 && index === 0 ? 1 : 0,
            ]);

            const placeholders = rows.map(() => "(?, ?, ?, ?, ?)").join(", ");
            const params = rows.flat();

            await executor(
                `INSERT INTO property_images (property_id, image_url, public_id, sort_order, is_cover)
                 VALUES ${placeholders}`,
                params
            );

            return rows.map((row) => ({
                imageUrl: row[1],
                publicId: row[2],
                sortOrder: row[3],
                isCover: row[4],
            }));
        });
    },

    // Ensure amenity names exist and link them to a property (replaces prior links)
    async syncPropertyAmenities(propertyId, amenityNames, executor = query) {
        const byKey = new Map();
        for (const raw of amenityNames || []) {
            const trimmed = String(raw).trim();
            if (!trimmed) continue;
            const key = trimmed.toLowerCase();
            if (!byKey.has(key)) byKey.set(key, trimmed);
        }
        const normalized = [...byKey.values()];

        await executor(
            "DELETE FROM property_amenities WHERE property_id = ?",
            [propertyId]
        );

        if (normalized.length === 0) return;

        const valuePlaceholders = normalized.map(() => "(?)").join(", ");
        await executor(
            `INSERT INTO amenities (name) VALUES ${valuePlaceholders} ON DUPLICATE KEY UPDATE id = id`,
            normalized
        );

        const namePlaceholders = normalized.map(() => "?").join(", ");
        const amenityRows = await executor(
            `SELECT id FROM amenities WHERE name IN (${namePlaceholders})`,
            normalized
        );

        if (!amenityRows.length) return;

        const pairPlaceholders = amenityRows.map(() => "(?, ?)").join(", ");
        const pairParams = amenityRows.flatMap((row) => [propertyId, row.id]);
        await executor(
            `INSERT IGNORE INTO property_amenities (property_id, amenity_id) VALUES ${pairPlaceholders}`,
            pairParams
        );
    },

    async countProperties() {
        const [row] =
            await query(
                "SELECT COUNT(*) AS count FROM properties"
            );
        return Number(row.count);
    },

    async countByStatus() {
        return query(
            "SELECT status, COUNT(*) AS count FROM properties GROUP BY status"
        );
    },

    async countByAgent(agentId) {
        const rows = await query(
            `SELECT
                 COUNT(*) AS total,
                 SUM(CASE WHEN p.status = 'available' THEN 1 ELSE 0 END) AS active,
                 SUM(CASE WHEN p.status IN ('sold', 'rented') THEN 1 ELSE 0 END) AS closed
             FROM properties p
             WHERE p.agent_id = ?`,
            [agentId]
        );
        const row = rows[0] || {};
        return {
            total: Number(row.total) || 0,
            active: Number(row.active) || 0,
            closed: Number(row.closed) || 0,
        };
    },

    async countByCategory() {
        return query(`
            SELECT c.id, c.name, COUNT(p.id) AS count
            FROM property_categories c
            LEFT JOIN properties p ON p.category_id = c.id
            GROUP BY c.id, c.name
            ORDER BY count DESC
        `);
    },

    async countByDay(days) {
        return query(
            `SELECT DATE(created_at) AS date, COUNT(*) AS count
             FROM properties
             WHERE created_at >= CURDATE() - INTERVAL ? DAY
             GROUP BY DATE(created_at)
             ORDER BY date ASC`,
            [days]
        );
    },
};
module.exports = propertyModel;
