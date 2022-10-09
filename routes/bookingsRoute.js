const router = require("express").Router();
const authMiddleware = require('../middleware/authMiddleware');
const Booking = require('../models/bookingsModel');
const Bus = require('../models/busModel');

const Stripe = require('stripe');
const stripe = Stripe('sk_test_51LqVW6SHl7KO3iEFqfN4Pb0xr2SdN2RSkl0h4q2TlsxZ4UCCElvqTWZ7332HscfNYaVep94Op4xML77KJzrm8tEh00WDxBNivr');
const { v4: uuidv4 } = require('uuid');



router.post('/book-seat',authMiddleware,async (req,res) => {
    try {
        const newBooking=new Booking({
            ...req.body,
            user : req.body.userId
        })
        await newBooking.save()
        const bus=await Bus.findById(req.body.bus)
        bus.seatsBooked=[...bus.seatsBooked,...req.body.seats]
        await bus.save()
        return res.status(200).send({
            message: 'Booking successful',
            success: true,
            data: newBooking,
            token : null
        })
    } catch (error) {
        return res.status(500).send({
      message: "Booking failed",
      data: error,
            success: false,
      token : null
    });
    }
})


router.post('/make-payment',authMiddleware,async (req,res) => {
    const {token,amount}=req.body
     console.log('uuid = ',uuidv4())
        return res.status(500).send({
            message: "Payment Successfull",
            data: {
                token,
                transactionId : uuidv4()
                },
            success: true,
            token : null
        });
    // try {
    //     const {token,amount}=req.body
    //     console.log('token = ',token)
    //     const payment=await stripe.paymentIntents.create({
    //         amount,
    //         currency: 'inr',
    //         confirm: true,
    //         customer: token.email,
    //         source: token.id,
    //         receipt_email: token.email,
    //         payment_method : token.id,
    //         payment_method_types : ['card']
    //     })
    // console.log('payment = ',payment)
    //     if(payment) {
    //         console.log('payment = ',payment)
    //         console.log('payment = ',payment.id);
    //         return res.status(200).send({
    //             message: 'Payment Successfull',
    //             success: true,
    //             data: {
    //                 transactionId : payment.source.id
    //             },
    //             token : null 
    //         })
    //     } else {
    //         return res.status(500).send({
    //             message: "Payment failed 123456",
    //             data: error,
    //             success: false,
    //             token : null
    //         })
    //     }    
    // } catch (error) {
    //     //console.log('error = ',error)
    //     /*
    //     Temporary fixing the payment method
    //     */
       
    // }
});


router.post('/get-bookings-by-user-id',authMiddleware,async (req,res) => {
    try {
        const userBookings=await Booking.find({user: req.body.userId})
            .populate('bus')
            .populate('user')
        if(userBookings) {
            return res.status(200).send({
                message: 'Booking fetched successfully',
                success: true,
                data: userBookings,
                token : null,
            })
        } else {
            return res.status(500).send({
                message: 'Booking fetched failed try again',
                success: false,
                data: null,
                token : null
            })
        }
    } catch (error) {
        return res.status(500).send({
                message: "Bookings fetch failed",
                data: error,
            success: false,
                token : null,
    });
    }
} )




module.exports = router;





















