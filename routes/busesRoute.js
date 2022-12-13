const router = require("express").Router();
const Bus = require("../models/busModel");
const authMiddleware=require('../middleware/authMiddleware');


router.post('/add-bus',authMiddleware,async (req,res) => {
    try {
        const existingBus=await Bus.findOne({number: req.body.number})
        if(existingBus) {
            return res.status(200).send({
                message: 'Bus already exists',
                success: false,
                data: null,
                token : null
            })
        }
        const newBus=new Bus(req.body)
        await newBus.save()
        return res.status(200).send({
            message: 'Bus added successfully',
            success: true,
            data: null,
            token : null
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
            token : null
        });
    }
})

router.post('/get-all-buses',authMiddleware,async (req,res) => {
    try {
        const buses=await Bus.find(req.body)
        return res.status(200).send({
            success: true,
            message: 'Buses fetched successfully',
            data: buses,
            token : null
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
            data: null,
            token:null
        })
    }
})

router.post('/update-bus',authMiddleware,async (req,res) => {
    try {
        const {userId,jwtToken,...otherDetails}=req.body
        const updatedBus=await Bus.findByIdAndUpdate(req.body._id,otherDetails,{
            new : true
        })
        if(updatedBus) {
            return res.status(200).send({
                message: 'Bus updated successfully',
                success: true,
                data: null,
                token : null
            })
        } else {
            return res.status(500).send({
                message: 'updation failed!',
                success: false,
                data: null,
                token : null
            })
        }
    } catch(error) {
        return res.status(500).send({
            message: error.message,
            success: false,
            data: null,
            token : null
        })
    }
})


router.post('/delete-bus',authMiddleware,async (req,res) => {
    try {
        await Bus.findByIdAndDelete(req.body._id)
        return res.status(200).send({
            success: true,
            message: 'Bus Deleted successfully',
            data: null,
            token : null
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            success: false,
            data: null,
            token : null
        })
    }
})

router.post('/get-bus-by-id',authMiddleware,async (req,res) => {
    try {
        const bus=await Bus.findById(req.body._id)
        if(bus) {
            return res.status(200).send({
                message: 'Bus fetched successfully',
                success: true,
                data: bus,
                token : null,
            })
        } else {
            return res.status(500).send({
                message: 'Required bus does not exist',
                success: false,
                data: null,
                token : null
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: error.message,
            success: false,
            data: null,
            token : null
        })
    }
})

module.exports = router




















