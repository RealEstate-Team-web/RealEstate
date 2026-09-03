"use strict";

const { query } = require("../config/db.config");


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

            p.category_id AS categoryId

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
            p.category_id AS categoryId
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
    async createProperty(data) {
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
                longitude
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        ];

        const result = await query(sql, params);

        return result.insertId;
    },


    // Update property
    async updateProperty(
        id,
        data
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
            await query(sql, params);

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
