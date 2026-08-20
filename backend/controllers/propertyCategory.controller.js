const propertyCategoryModel = require('../models/propertyCategory.model')
class PropertyCategoryController{
    async createPropertyCategory(req,res){
        try{
            const {name,description} = req.body;
            const result = await propertyCategoryModel.createPropertyCategory(name,description);
            return res.status(201).json({
                    success:true,
                    data:{
                        id:result.id,name,description
                    }
                });
            
        }
        catch(error){

            res.status(500).json({
                success:false,
                error:error.message})
        }
    }

    async getAllPropertyCategory(req,res){
        try{
            const result = await propertyCategoryModel.getAllPropertyCategory()
            return res.status(200).json({
                success:true,
                data:result
            });
        }
        catch(error){
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }


    async getPropertyCategory(req,res){
        try{
            const {id} = req.params
            const result = await propertyCategoryModel.getPropertyCategory(id)
            if(!result){
                return res.status(404).json({
                    success:false,
                    message:"Category not found"
                })
            }
            return (
                res.status(200).json({
                    success:true,
                    data:result
                })
            )
        }
        catch(error){
            res.status(500).json({
                success:false,
                error:error.message
            })
        }

    }

    async updatePropertyCategory(req,res){
        try{
            const {id} = req.params
            const {name, description} = req.body
            const result = await propertyCategoryModel.updatePropertyCategory(id,name, description)
            if(!result){
                return res.status(404).json({
                    success:false,
                    message:"Category not found"
                })
            }
            return(
                res.status(200).json({
                    success:true,
                    data:result
                })
            )
        }
        catch(error){
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
    async deletePropertyCategory(req,res){
        try{
            const {id} = req.params
            const result = await propertyCategoryModel.deletePropertyCategory(id)
            if(!result){

                return res.status(404).json({
                    success:false,
                    message:"Category not found"
                })
            }
            return res.status(200).json({
                success:true,
                data :result
            })
        }
        catch(error){
            return res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
}

module.exports = new PropertyCategoryController()