 const { query } = require("../config/db.config");


 const propertyModel={
      
    async findProperties  ({
        city,
        location,
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
        })  {
        conditions = [];
        params = [];

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

            search = `%${location}%`;

            params.push(search, search);
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

        sortOptions = {
            newest: "p.created_at DESC",
            lowest_price: "p.price ASC",
            highest_price: "p.price DESC",
        };

        orderBy =
            sortOptions[sort] ||
            sortOptions.newest;

        offset =
            (page - 1) * limit;

        sql = `
            SELECT
            p.id,
            p.title,
            p.price,
            p.address,
            p.city,
            p.country,

            p.bedrooms,
            p.bathrooms,
            p.parking_spaces,
            p.area,

            p.listing_type,
            p.status,

            p.latitude,
            p.longitude,

            p.views,
            p.created_at,

            p.category_id

            FROM properties p

            WHERE ${conditions.join(" AND ")}

            ORDER BY ${orderBy}

            LIMIT ? OFFSET ?
        `;

        params.push(Number(limit));
        params.push(Number(offset));

        properties =
            await query(sql, params);


        countSql = `
            SELECT COUNT(*) AS total
            FROM properties p
            WHERE ${conditions.join(" AND ")}
        `;

        countParams =
            params.slice(0, -2);

        countResult =
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


    // Get one property
    async findPropertyById  (
        id
        )  {
        sql = `
            SELECT
            p.*
            FROM properties p
            WHERE p.id = ?
            LIMIT 1
        `;

        rows =
            await query(sql, [id]);

        return rows[0] || null;
    },


    // Create property
    async  createProperty  (data){
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
    async updateProperty  (
        id,
        data
        )  {
        fields = [];
        params = [];

        allowedFields = {
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

        for ( [key, column] of Object.entries(
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

        sql = `
            UPDATE properties
            SET ${fields.join(", ")}
            WHERE id = ?
        `;

        result =
            await query(sql, params);

        return result.affectedRows > 0;
    },


    // Delete property
    async deleteProperty (
        id
        )  {
        sql = `
            DELETE FROM properties
            WHERE id = ?
        `;

        result =
            await query(sql, [id]);

        return result.affectedRows > 0;
    },
};
module.exports = propertyModel;