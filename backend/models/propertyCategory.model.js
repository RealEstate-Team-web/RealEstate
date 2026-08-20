const {query} = require('../config/db.config');
const propertyCategory = {
    async  createPropertyCategory(name,description){
        const result = await query(
            "INSERT INTO property_categories (name,description) VALUES(?,?) ",[name,description]
        );
        return {
            id:result.insertId
        }
    },

    async getAllPropertyCategory(){
        const rows= await query("select * from property_categories ");
        return rows
    },
    async getPropertyCategory(id){
        const row= await query("select * from property_categories where id=? ",[id])
        return row[0]
    },
    async updatePropertyCategory(id,name ,description){
        const result = await query("update property_categories set name=?, description=? where id =? ",[name ,description,id])
        return result.affectedRows
    },

    async deletePropertyCategory(id){
        const result = await query("delete from property_categories where id =? ",[id])
        return result.affectedRows
    }
};

module.exports= propertyCategory;