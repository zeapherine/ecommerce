const router = require('express').Router();
const Order = require('../models/Order');
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require('../middleware/verifyToken');

//CREATE
router.post('/', verifyToken, async (req, res) => {
	const newOrder = new Order(req.body);

	try {
		const saveOrder = await newOrder.save();
		res.status(200).json(saveOrder);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

// UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
	try {
		const updatedOrder = await Order.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedOrder);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

// //DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
	try {
		await Order.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: 'Order has been deleted' });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

//GET USER ORDERS
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
	try {
		const orders = await Order.find({ userId: req.params.userId });
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

//GET ALL
router.get('/', verifyTokenAndAdmin, async (req, res) => {
	try {
		const orders = await Order.find();
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

// GET MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
	const date = new Date();
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

	try {
		const income = await Order.aggregate([
			{ $match: { createdAt: { $gte: prevMonth } } },
			{
				$project: {
					month: { $month: '$createdAt' },
					sales: '$amount',
				},
			},
			{
				$group: {
					_id: '$month',
					total: { $sum: '$sales' },
				},
			},
		]);
        res.status(200).json(income);
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

module.exports = router;
