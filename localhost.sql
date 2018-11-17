-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 14, 2018 at 07:48 PM
-- Server version: 5.5.55-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `airport_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE IF NOT EXISTS `address` (
  `id` int(11) NOT NULL,
  `city` varchar(45) NOT NULL,
  `postal_code` varchar(45) NOT NULL,
  `country` varchar(45) NOT NULL,
  `street` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `airplane`
--

CREATE TABLE IF NOT EXISTS `airplane` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `manufacture_year` varchar(20) NOT NULL,
  `license_no` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_airplane_2nf_1_idx` (`license_no`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `airplane`
--

INSERT INTO `airplane` (`id`, `name`, `manufacture_year`, `license_no`) VALUES
(1, 'Boeing 747', '1997', '123456789');

-- --------------------------------------------------------

--
-- Table structure for table `airport`
--

CREATE TABLE IF NOT EXISTS `airport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_airport_3nf_1_idx` (`location_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `airport`
--

INSERT INTO `airport` (`id`, `name`, `location_id`) VALUES
(1, 'Lahore Airport', 2),
(2, 'Karachi Airport', 3);

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE IF NOT EXISTS `city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id`, `name`) VALUES
(1, 'Karachi'),
(3, 'Lahore');

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE IF NOT EXISTS `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`id`, `name`) VALUES
(1, 'Pakistan');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE IF NOT EXISTS `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `joining_year` varchar(10) NOT NULL,
  `dept_no` int(11) NOT NULL,
  `grade` int(11) NOT NULL,
  `cnic` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_employee_1_idx` (`cnic`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `flight`
--

CREATE TABLE IF NOT EXISTS `flight` (
  `flight_no` varchar(40) NOT NULL,
  `arrival_airport` int(11) NOT NULL,
  `dept_airport` int(11) NOT NULL,
  `airplane_id` int(11) NOT NULL,
  `dept_time` datetime NOT NULL,
  PRIMARY KEY (`flight_no`),
  KEY `fk_flight_1_idx` (`arrival_airport`),
  KEY `fk_flight_2_idx` (`dept_airport`),
  KEY `fk_flight_3_idx` (`airplane_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `flight`
--

INSERT INTO `flight` (`flight_no`, `arrival_airport`, `dept_airport`, `airplane_id`, `dept_time`) VALUES
('0', 2, 1, 1, '2018-11-06 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE IF NOT EXISTS `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country` int(11) NOT NULL,
  `city` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `country` (`country`),
  KEY `city` (`city`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`id`, `country`, `city`) VALUES
(2, 0, 0),
(3, 0, 1),
(7, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `manufacturer_name`
--

CREATE TABLE IF NOT EXISTS `manufacturer_name` (
  `license_no` varchar(40) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`license_no`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `manufacturer_name`
--

INSERT INTO `manufacturer_name` (`license_no`, `name`) VALUES
('123456789', 'Boeing');

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE IF NOT EXISTS `person` (
  `age` int(11) NOT NULL,
  `cnic` varchar(40) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_number` varchar(40) NOT NULL,
  `miles` int(11) NOT NULL DEFAULT '0',
  `passport_number` varchar(40) NOT NULL,
  `address_id` int(11) NOT NULL,
  PRIMARY KEY (`cnic`),
  KEY `fk_person_3nf_1_idx` (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pessenger`
--

CREATE TABLE IF NOT EXISTS `pessenger` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discount` float NOT NULL DEFAULT '0',
  `cnic` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `pricing`
--

CREATE TABLE IF NOT EXISTS `pricing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `flight_id` int(11) NOT NULL,
  `seating_type_id` int(11) NOT NULL,
  `cost` float NOT NULL,
  `baggage_limit` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pricing_1_idx` (`flight_id`),
  KEY `fk_pricing_2_idx` (`seating_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `seating`
--

CREATE TABLE IF NOT EXISTS `seating` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `airplane_id` int(11) NOT NULL,
  `seating_type_id` int(11) NOT NULL,
  `number_of_seats` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_seating_1_idx` (`airplane_id`),
  KEY `fk_seating_2_idx` (`seating_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `seating_type`
--

CREATE TABLE IF NOT EXISTS `seating_type` (
  `id` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ticketing`
--

CREATE TABLE IF NOT EXISTS `ticketing` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT,
  `pricing_id` int(11) NOT NULL,
  `passenger_id` int(11) NOT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `fk_ticketing_1_idx` (`pricing_id`),
  KEY `fk_ticketing (restructured)_1_idx` (`passenger_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `airplane`
--
ALTER TABLE `airplane`
  ADD CONSTRAINT `fk_airplane_2nf_1` FOREIGN KEY (`license_no`) REFERENCES `manufacturer_name` (`license_no`) ON UPDATE CASCADE;

--
-- Constraints for table `airport`
--
ALTER TABLE `airport`
  ADD CONSTRAINT `fk_airport_3nf_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `fk_employee_1` FOREIGN KEY (`cnic`) REFERENCES `person` (`cnic`) ON UPDATE CASCADE;

--
-- Constraints for table `flight`
--
ALTER TABLE `flight`
  ADD CONSTRAINT `fk_flight_1` FOREIGN KEY (`arrival_airport`) REFERENCES `airport` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_flight_2` FOREIGN KEY (`dept_airport`) REFERENCES `airport` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_flight_3` FOREIGN KEY (`airplane_id`) REFERENCES `airplane` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `person`
--
ALTER TABLE `person`
  ADD CONSTRAINT `fk_person_3nf_1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `pricing`
--
ALTER TABLE `pricing`
  ADD CONSTRAINT `fk_pricing_1` FOREIGN KEY (`flight_id`) REFERENCES `flight` (`arrival_airport`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pricing_2` FOREIGN KEY (`seating_type_id`) REFERENCES `seating_type` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `seating`
--
ALTER TABLE `seating`
  ADD CONSTRAINT `fk_seating_1` FOREIGN KEY (`airplane_id`) REFERENCES `airplane` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_seating_2` FOREIGN KEY (`seating_type_id`) REFERENCES `seating_type` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `ticketing`
--
ALTER TABLE `ticketing`
  ADD CONSTRAINT `fk_ticketing_1` FOREIGN KEY (`pricing_id`) REFERENCES `pricing` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ticketing (restructured)_1` FOREIGN KEY (`passenger_id`) REFERENCES `pessenger` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
