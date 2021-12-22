const Tip = require("../models/tip")
const { calculateTip, formatDate } = require("../utils/helper")
const { calculateValidation, tipValidation } = require("../validations/tip.validation")
const moment = require('moment')

exports.calculate = async (req, res) => {
    const { error } = calculateValidation(req.body)

    if (error) {
        res.status(400).json({
            message: error.details[0].message
        })
    }
    const result = await calculateTip(req.body.totalAmount, req.body.tipPercentage)
    const tip = new Tip({
        place: req.body.place,
        totalAmount: req.body.totalAmount,
        tipPercentage: req.body.tipPercentage,
        tipAmount: result,
        user: req.user
    })
    const savedTip = await tip.save()
    res.status(200).json({
        tip: savedTip.tipAmount
    })
}

exports.analytics = async (req, res) => {
    const { error } = tipValidation(req.query)
    if (error) {
        res.status(400).json({
            message: error.details[0].message
        })
    }
    const startDate = moment(formatDate(req.query.startDate)).toISOString()
    const endDate = moment(formatDate(req.query.endDate)).toISOString()
    switch (req.query.analyticsType) {
        case 'tipPercentage':
            const byPercent = await Tip.aggregate([
                {
                    $match: {
                        user: req.user._id,
                        createdAt: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                { $sortByCount: "$tipPercentage" },
                { $limit: 1 }
            ])
            return res.status(200).json({
                tipPercentage: byPercent[0]._id,
                noOfTimes: byPercent[0].count
            })
        case 'mostVisitedPlaces':
            const byPlaces = await Tip.aggregate([
                {
                    $match: {
                        user: req.user._id,
                        createdAt: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                { $sortByCount: "$place" },
                { $limit: 1 }
            ])
            return res.status(200).json({
                place: byPlaces[0]._id,
                noOfTimes: byPlaces[0].count
            })
        default:
            let distinct = await Tip.aggregate([
                {
                    $match: {
                        user: req.user._id,
                        createdAt: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                {
                    $group: {
                        _id: '$place',
                        totalAmount: { $first: '$totalAmount' },
                        tipAmount: { $first: '$tipAmount'}
                    }
                },
            ])
            distinct = distinct.map(s=> ({spentAt: s._id, totalAmount: s.totalAmount, tipAmount: s.tipAmount}))
            return res.status(200).json(distinct)

    }
}