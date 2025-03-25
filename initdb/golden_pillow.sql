-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 25, 2025 at 01:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `golden_pillow`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(10) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `user_id`) VALUES
(1, 1),
(6, 2),
(2, 6),
(7, 8);

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `coupon_id` int(11) NOT NULL,
  `discount_details` char(20) NOT NULL,
  `coupon_code` char(13) NOT NULL,
  `coupon_status` enum('AVAILABLE','UNAVAILABLE') DEFAULT 'AVAILABLE',
  `coupon_condition` char(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon`
--

INSERT INTO `coupon` (`coupon_id`, `discount_details`, `coupon_code`, `coupon_status`, `coupon_condition`) VALUES
(1, '5% discount', 'TEST', 'AVAILABLE', 'Minimum purchase of 500 baht'),
(2, '7% discount', 'TESTER', 'AVAILABLE', 'Minimum purchase of 700 baht.'),
(3, '10% discount', 'TENTEN', 'AVAILABLE', 'Minimum purchase of 1,000 baht'),
(4, '10% discount', 'SECOND', 'AVAILABLE', 'Minimum purchase of 500 baht'),
(5, '15% discount', 'TEST123', 'AVAILABLE', 'Minimum purchase of 300 baht'),
(6, '20% discount', 'EXISTINGCODE', 'AVAILABLE', 'Minimum purchase of 200 baht'),
(7, '10% discount', '5ORMORE', 'AVAILABLE', 'Minimum purchase of 5 products'),
(8, '10% discount', 'NEWONE', 'AVAILABLE', 'Minimum purchase of 500 baht'),
(13, '8% discount', 'CANTUSE', 'UNAVAILABLE', 'Minimum purchase of 100 baht'),
(14, '10% discount', 'THIRD', 'AVAILABLE', 'Minimum purchase of 500 baht');

-- --------------------------------------------------------

--
-- Table structure for table `deliveredorders`
--

CREATE TABLE `deliveredorders` (
  `deliver_id` int(11) NOT NULL,
  `ems_code` varchar(13) NOT NULL,
  `order_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deliveredorders`
--

INSERT INTO `deliveredorders` (`deliver_id`, `ems_code`, `order_id`, `staff_id`) VALUES
(2, 'EMS123456789', 46, 2),
(3, 'EMS987654321', 47, 2),
(4, 'EMS0123456789', 46, 2),
(13, 'EMS0123456789', 49, 193),
(21, 'EMS0123456754', 54, 193),
(44, 'EMS0123456754', 51, 193);

-- --------------------------------------------------------

--
-- Table structure for table `orderline`
--

CREATE TABLE `orderline` (
  `order_line_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `lot_id` char(10) NOT NULL,
  `grade` char(1) NOT NULL,
  `amount` int(11) NOT NULL CHECK (`amount` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderline`
--

INSERT INTO `orderline` (`order_line_id`, `order_id`, `lot_id`, `grade`, `amount`) VALUES
(64, 46, 'LOT001', 'A', 1),
(65, 46, 'LOT002', 'B', 1),
(66, 46, 'LOT004', 'C', 1),
(67, 46, 'LOT005', 'A', 1),
(68, 47, 'Lot007', 'C', 2),
(69, 47, 'LOT004', 'C', 2),
(70, 47, 'LOT002', 'B', 3),
(71, 48, 'LOT005', 'A', 2),
(72, 48, 'Lot007', 'C', 1),
(73, 48, 'Lot008', 'A', 2),
(74, 49, 'LOT001', 'A', 1),
(77, 51, 'LOT005', 'A', 2),
(78, 51, 'LOT002', 'B', 1),
(79, 52, 'LOT001', 'A', 2),
(80, 52, 'Lot007', 'C', 1),
(81, 53, 'LOT001', 'A', 1),
(82, 54, 'LOT001', 'A', 2),
(83, 54, 'LOT002', 'B', 2),
(84, 54, 'LOT004', 'C', 1),
(85, 1271, 'LOT001', 'A', 2),
(93, 1277, 'LOT001', 'A', 1),
(94, 1278, 'LOT001', 'A', 1),
(95, 1279, 'LOT001', 'A', 2),
(96, 1279, 'LOT002', 'B', 2);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_price` int(11) NOT NULL,
  `delivery_status` enum('sent the packet','yet to send') DEFAULT 'yet to send',
  `payment_status` enum('Approved','Rejected','Yet to check') DEFAULT 'Yet to check',
  `status_for_ledger` enum('done','not done') DEFAULT 'not done',
  `packed_status` enum('packed','not packed yet') DEFAULT 'not packed yet',
  `slip_payment` varchar(255) DEFAULT 'no path',
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_price`, `delivery_status`, `payment_status`, `status_for_ledger`, `packed_status`, `slip_payment`, `order_date`) VALUES
(46, 6, 2350, 'sent the packet', 'Approved', 'not done', 'packed', '/images/image-1730280903348-156052495.jpg', '2024-10-30 09:34:57'),
(47, 1, 4350, 'sent the packet', 'Approved', 'not done', 'packed', '/images/image-1730478188231-803218375.png', '2024-11-01 16:22:50'),
(48, 1, 3100, 'sent the packet', 'Approved', 'not done', 'packed', '/images/image-1730480773460-170102003.jpg', '2024-11-01 17:06:09'),
(49, 1, 600, 'yet to send', 'Rejected', 'not done', 'not packed yet', '/images/image-1730480820957-602049382.jpg', '2024-11-01 17:06:57'),
(51, 8, 1850, 'sent the packet', 'Approved', 'not done', 'packed', '/images/image-1739808610731-255562329.jpg', '2025-02-08 06:09:48'),
(52, 1, 1700, 'yet to send', 'Approved', 'not done', 'packed', '/images/image-1739022399466-579866125.jpg', '2025-02-10 15:46:23'),
(53, 1, 600, 'yet to send', 'Yet to check', 'not done', 'not packed yet', '/images/image-1740401736684-321099819.jpg', '2025-02-24 12:55:32'),
(54, 1, 3300, 'sent the packet', 'Approved', 'not done', 'packed', '/images/image-1740407900475-629183215.jpg', '2025-02-24 15:08:16'),
(999, 1, 12700, 'sent the packet', 'Approved', 'not done', 'packed', 'no path', '2025-03-10 12:37:39'),
(1272, 8, 2400, 'yet to send', 'Yet to check', 'not done', 'not packed yet', '/images/image-1742827305066-354029317.png', '2025-03-24 14:41:24'),
(1273, 8, 2450, 'yet to send', 'Yet to check', 'not done', 'not packed yet', '/images/image-1742827609122-197165908.png', '2025-03-24 14:46:35');

-- --------------------------------------------------------

--
-- Table structure for table `productincart`
--

CREATE TABLE `productincart` (
  `product_in_cart_id` int(10) NOT NULL,
  `amount` int(11) NOT NULL,
  `cart_id` int(10) DEFAULT NULL,
  `lot_id` char(10) NOT NULL,
  `grade` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productincart`
--

INSERT INTO `productincart` (`product_in_cart_id`, `amount`, `cart_id`, `lot_id`, `grade`) VALUES
(82, 1, 1, 'LOT001', 'A'),
(87, 1, 1, 'Lot007', 'C'),
(95, 1, 7, 'LOT002', 'B');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `lot_id` char(10) NOT NULL,
  `grade` char(1) NOT NULL,
  `RemainLotamount` int(11) NOT NULL,
  `LotamountStock` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `base_price` int(11) NOT NULL,
  `sale_price` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `exp_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`lot_id`, `grade`, `RemainLotamount`, `LotamountStock`, `status`, `base_price`, `sale_price`, `image_path`, `exp_date`) VALUES
('LOT001', 'A', 143, 151, 'Available', 500, 600, '/images/lot001.png', '2024-10-25 18:45:24'),
('LOT002', 'B', 295, 297, 'Available', 700, 850, '/images/lot002.png', '2024-10-25 18:45:30'),
('LOT004', 'C', 96, 98, 'Available', 300, 400, '/images/lot004.png', '2024-11-20 00:00:00'),
('LOT005', 'A', 42, 48, 'Available', 400, 500, '/images/lot005.png', '2024-11-30 00:00:00'),
('Lot006', 'B', 20, 20, 'Available', 300, 500, '/images/image-1730472152786-973341105.png', '2024-11-10 17:00:00'),
('Lot007', 'C', 12, 12, 'Available', 300, 500, '/images/image-1730473367975-757524260.png', '2024-11-10 17:00:00'),
('Lot008', 'A', 25, 28, 'Available', 500, 800, '/images/image-1730473426388-103652746.png', '2024-12-10 17:00:00'),
('Lot009', 'A', 30, 30, 'Available', 500, 800, '/images/image-1730618564276-678754617.png', '2024-12-10 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `receipt`
--

CREATE TABLE `receipt` (
  `receipt_id` int(20) NOT NULL,
  `user_id` int(10) NOT NULL,
  `order_id` int(11) NOT NULL,
  `Receipt_path` varchar(500) DEFAULT NULL,
  `receipt_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `receipt`
--

INSERT INTO `receipt` (`receipt_id`, `user_id`, `order_id`, `Receipt_path`, `receipt_date`) VALUES
(2, 2, 46, '/images/receipt_46.png', '2024-11-02 11:29:11'),
(3, 2, 48, '/images/receipt_48.png', '2024-11-03 05:31:11'),
(4, 2, 48, '/images/receipt_48.png', '2024-11-03 07:27:44');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `star` enum('1','2','3','4','5') NOT NULL,
  `comment` text DEFAULT NULL,
  `like_count` int(11) DEFAULT 0,
  `dislike_count` int(11) DEFAULT 0,
  `order_id` int(11) NOT NULL,
  `lot_id` char(10) NOT NULL,
  `grade` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `username`, `star`, `comment`, `like_count`, `dislike_count`, `order_id`, `lot_id`, `grade`) VALUES
(3, 'jonnybaboo', '3', 'ส่งช้าไปหน่อย แต่สินค้าโอเค', 3, 3, 48, 'LOT004', 'C'),
(7, 'jonnybaboo', '5', 'ส่งไวของดี', 12, 0, 48, 'LOT008', 'A'),
(38, 'testcustomer', '3', 'Average product.', 2, 2, 49, 'LOT001', 'A');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `house_details` varchar(255) NOT NULL,
  `name_road` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `name`, `lastname`, `phone_number`, `role`, `password`, `email`, `address`, `house_details`, `name_road`, `district`, `province`, `postal_code`) VALUES
(1, 'jojo', 'John', 'Doe', '1234567890', 'client', '123456789', 'john.doe@example.com', '123 Main St', 'Apartment 2B', 'Main Road', 'Central District', 'Bangkok', '10200'),
(2, 'yaya', 'Suriya', 'Phongkham', '0812345678', 'admin', '123456789', 'suriya@example.com', '10/5 Moo 6', 'House No.18', 'Ban Phe', 'Mueang', 'Rayong', '21160'),
(3, 'kiki', 'Kanya', 'Srisuk', '0867891234', 'owner', '123456789', 'kanya@example.com', '88/9 Moo 3', 'Townhouse B', 'Rayong Road', 'Kleng', 'Rayong', '21110'),
(6, 'reginababy', 'regina', 'mills', '1234567890', 'client', 'reginababy', 'regina@gmail.com', '123asdfghjk', '3', 'main', 'main', 'storybook', '12378'),
(7, 'john_doe', 'John', 'Doe', '1234567890', 'admin', 'password123', 'john.doe@example.com', '123 Main St', 'Apt 4B', 'Main Road', 'District X', 'Province Y', '12345'),
(8, 'user1', 'User', 'One', '0111111111', 'client', '123456789', 'usr1@gmail.com', 'adsad', '', 'adsasad', 'adssada', 'dasdad', '10901'),
(47, 'bb', 'Bob', 'Builder', '0123456789', 'packaging staff', '123456789', 'bob@gmail.com', 'asdsad', '', 'adssadsa', 'asdsada', 'asdsada', '10901'),
(193, 'sara', 'Sherlock', 'Holmes', '0123456789', 'delivering staff', '123456789', 'bob@gmail.com', '221B', '', '6XE UK', 'Baker Street', 'London', '10900');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`coupon_id`),
  ADD UNIQUE KEY `coupon_code` (`coupon_code`);

--
-- Indexes for table `deliveredorders`
--
ALTER TABLE `deliveredorders`
  ADD PRIMARY KEY (`deliver_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `orderline`
--
ALTER TABLE `orderline`
  ADD PRIMARY KEY (`order_line_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `lot_id` (`lot_id`,`grade`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `productincart`
--
ALTER TABLE `productincart`
  ADD PRIMARY KEY (`product_in_cart_id`),
  ADD KEY `lot_id` (`lot_id`,`grade`),
  ADD KEY `cart_id` (`cart_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`lot_id`,`grade`);

--
-- Indexes for table `receipt`
--
ALTER TABLE `receipt`
  ADD PRIMARY KEY (`receipt_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `lot_id` (`lot_id`,`grade`),
  ADD KEY `reviews_username_order_id_lot_id_grade` (`username`,`order_id`,`lot_id`,`grade`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `coupon`
--
ALTER TABLE `coupon`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `deliveredorders`
--
ALTER TABLE `deliveredorders`
  MODIFY `deliver_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `orderline`
--
ALTER TABLE `orderline`
  MODIFY `order_line_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1274;

--
-- AUTO_INCREMENT for table `productincart`
--
ALTER TABLE `productincart`
  MODIFY `product_in_cart_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `receipt`
--
ALTER TABLE `receipt`
  MODIFY `receipt_id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=162;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=214;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `deliveredorders`
--
ALTER TABLE `deliveredorders`
  ADD CONSTRAINT `deliveredorders_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `deliveredorders_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
