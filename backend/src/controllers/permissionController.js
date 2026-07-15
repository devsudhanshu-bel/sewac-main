const permissionService =
require("../services/permissionService");

exports.requestPermission =
async(req,res)=>{

    try{

        const data =
        await permissionService.requestPermission(req);

        res.status(200).json({

            success:true,

            data

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

exports.approvePermission =
async(req,res)=>{

};

exports.rejectPermission =
async(req,res)=>{

};