const Review = require('../models/Review');
const Order = require('../models/Order');

const { Op, Sequelize } = require("sequelize");
const reviewController = {
    // สร้างรีวิวใหม่
    async createReview(req, res) {
        try {
            let { star, comment, order_id, lot_id, grade, username } = req.body;
            order_id = parseInt(order_id, 10);
            // ตรวจสอบข้อมูลที่จำเป็น
            if (!star || !comment || !order_id || !lot_id || !grade || !username) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Check if the order is delivered
            const order = await Order.findByPk(order_id);
            if (!order || order.delivery_status !== "sent the packet") {
                return res.status(403).json({ message: "You can only review delivered orders." });
            }
            // Check if user already reviewed
            const existingReview = await Review.findOne({
                 where: { username, lot_id, grade }
            });

            if (existingReview && existingReview.order_id === order_id) {
                return res.status(400).json({ message: "You have already reviewed this product for this order." });
            }


            // สร้างรีวิวใหม่
            const newReview = await Review.create({
                star,
                comment,
                order_id,
                lot_id,
                grade,
                username,
            });
            return res.status(201).json(newReview);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // อัปเดต like/dislike
    async updateReviewFeedback(req, res) {
        try {
            const reviewId = req.params.review_id; 
            const { action } = req.body;
   
            const review = await Review.findByPk(reviewId); 
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }

            if (action === 'like') {
                review.like_count += 1;
            } else if (action === 'dislike') {
                review.dislike_count += 1;
            } else {
                return res.status(400).json({ message: 'Invalid action' });
            }
            await review.save(); 
            return res.status(200).json(review);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
     ,
    
    async getReviewsAll(req, res) {
        try {
            const { lot_id, grade, star } = req.query;
            const where = {};

            if (lot_id) where.lot_id = lot_id;
            if (grade) where.grade = grade;
            if (star) where.star = star;

            const reviews = await Review.findAll({ where });
            return res.status(200).json(reviews);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async getReviewsByID(req, res) {
        try {
            const review_id = req.params.review_id;

            const reviews = await Review.findByPk(review_id);
            return res.status(200).json(reviews);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },
    // edit comment and update to db ja
    async updateReview(req, res) {
        try {
            const reviewId = req.params.review_id;
            const { username, comment, star } = req.body;
    
            // find review
            const review = await Review.findByPk(reviewId);
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }
    
            // Update only if new values are provided
            if (comment) review.comment = comment;
            if (star) review.star = star;
    
            await review.save(); // Save changes
            return res.status(200).json({ message: 'Review updated successfully', review });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    async getAverageRating(req, res) {
        try {
            let { lot_id, grade } = req.query;
            const where = {};
    
            if (!lot_id || !grade) {
                return res.status(400).json({ message: "Missing lot_id or grade" });
            }
    
            if (lot_id) where.lot_id = lot_id;
            if (grade) where.grade = grade;
    
            const reviews = await Review.findAll({ where });           
    
            if (reviews.length === 0) {
                return res.status(200).json({ average: 0, count: 0 });
            }
    
            const totalStars = reviews.reduce((sum, review) => sum + Number(review.star), 0);
            const average = totalStars / reviews.length;
    
            return res.status(200).json({ 
                average: Number(average.toFixed(2)), 
                count: reviews.length 
            });
        } catch (error) {
            console.error("Error in getAverageRating:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    
};

module.exports = reviewController;