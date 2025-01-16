import Department from "../models/Department.js";
import Employee from "../models/Employee.js"
import Leave from "../models/Leave11.js";

const getSummary = async (req, res) => {
    try{
        const totalEmployees = await Employee.countDocuments();

        const totalDepartments = await Department.countDocuments();

        const empployeeAppliedForLeave = await Leave.distinct('employeeId')

        const leaveStatus = await Leave.aggregate([
            {$group:{
                _id: "$status",
                count: {$sum:1}
            }}
        ])

        const leaveSummary = {
            appliedFor : empployeeAppliedForLeave.length,
            approved: leaveStatus.find(item => item._id === "Approve")?.count || 0,
            rejected: leaveStatus.find(item => item._id === "Rejected")?.count || 0,
            pending: leaveStatus.find(item => item._id === "Pending")?.count || 0,
        }

        return res.status(200).json({
            success:true,
            totalEmployees,
            totalDepartments,
            leaveSummary
        })

    }catch(error){
        console.log(error.message)
        return res.status(500).json({succes:false, error:"dashboard summary error"})
    }
}

export {getSummary}