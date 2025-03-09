const Review = require('../models/Review');

const reviewController = {
    // สร้างรีวิวใหม่
    async createReview(req, res) {
        try {
            const { star, comment, order_id, lot_id, grade, username } = req.body;

            // ตรวจสอบข้อมูลที่จำเป็น
            if (!star || !comment || !order_id || !lot_id || !grade || !username) {
                return res.status(400).json({ message: 'Missing required fields' });
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
    }
};

module.exports = reviewController;