-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 26, 2013 at 08:17 PM
-- Server version: 5.5.28-1~dotdeb.0
-- PHP Version: 5.4.16-1~alfa.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `usr_web617_1`
--
CREATE DATABASE IF NOT EXISTS `usr_web617_1` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `usr_web617_1`;

-- --------------------------------------------------------

--
-- Table structure for table `kommentare`
--

CREATE TABLE IF NOT EXISTS `kommentare` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'references trainings table',
  `autor` varchar(255) CHARACTER SET latin1 COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  `msg` text CHARACTER SET latin1 COLLATE latin1_german1_ci NOT NULL,
  `time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`,`tid`),
  KEY `time` (`time`),
  KEY `tid` (`tid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `mailliste`
--

CREATE TABLE IF NOT EXISTS `mailliste` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text COLLATE latin1_german1_ci NOT NULL,
  `email` text COLLATE latin1_german1_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shouts`
--

CREATE TABLE IF NOT EXISTS `shouts` (
  `id` int(32) unsigned NOT NULL AUTO_INCREMENT,
  `autor` varchar(512) NOT NULL,
  `msg` text NOT NULL,
  `zeit` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `t2`
--

CREATE TABLE IF NOT EXISTS `t2` (
  `tid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'references trainings table',
  `Name` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT 'unbekannt',
  `Vote` tinyint(4) NOT NULL DEFAULT '0',
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tid`,`Name`),
  KEY `Vote` (`Vote`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trainings`
--

CREATE TABLE IF NOT EXISTS `trainings` (
  `tid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `when` datetime NOT NULL,
  `what` varchar(1024) NOT NULL,
  `where` varchar(1024) NOT NULL,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `type` enum('TRAINING','OTHER') NOT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE IF NOT EXISTS `votes` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `text` varchar(64) COLLATE latin1_german1_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kommentare`
--
ALTER TABLE `kommentare`
  ADD CONSTRAINT `kommentare_ibfk_1` FOREIGN KEY (`tid`) REFERENCES `trainings` (`tid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `t2`
--
ALTER TABLE `t2`
  ADD CONSTRAINT `t2_ibfk_2` FOREIGN KEY (`tid`) REFERENCES `trainings` (`tid`) ON DELETE CASCADE ON UPDATE CASCADE;
