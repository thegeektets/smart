-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2014 at 08:07 AM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `wizard`
--

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE IF NOT EXISTS `options` (
  `qid` int(11) NOT NULL,
  `optionid` int(11) NOT NULL AUTO_INCREMENT,
  `option` varchar(5000) NOT NULL,
  PRIMARY KEY (`optionid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=42 ;

--
-- Dumping data for table `options`
--

INSERT INTO `options` (`qid`, `optionid`, `option`) VALUES
(1, 5, 'A.	Gender refers to the biological and physiological differences between men and women, and sex refers to the social constructs of what it means to be a man or woman, boy of girl in a given society'),
(1, 6, 'B.	Gender refers to the biological and physiological differences between men and women AND the social constructs of what it means to be a man or woman, boy or girl in a society, and sex refers ONLY to the biological and physiological differences.'),
(1, 7, 'C.	Gender refers to the social constructs of what it means to be a man or woman, boy or girl in a society, and sex refers to the biological and physiological differences between men and women.'),
(1, 8, 'D.	There is no difference. They are two words for the same concept.'),
(3, 9, 'A.	Gender mainstreaming'),
(3, 10, 'B.	Gender equality'),
(4, 11, 'C.	Access to and control over resources'),
(4, 12, 'D.	None of the above'),
(4, 13, 'E.	All of the above'),
(3, 14, 'C.	Gender equity'),
(3, 15, 'D.	Empowerment'),
(4, 16, 'A.	Divisions of labor'),
(4, 17, 'B.	Livelihoods'),
(5, 18, 'A.	Unpredictability of extreme weather events'),
(5, 19, 'B.	Seasonal changes in local temperatures'),
(5, 20, 'C.	Rising sea levels globally'),
(5, 21, 'D.	Increasing mean global temperature'),
(6, 22, 'A.	Adaptive capacity'),
(6, 23, 'B.	Adaptation'),
(6, 24, 'C.	Mitigation'),
(6, 25, 'D.	Resilience'),
(8, 26, 'A.	Short-term and immediate'),
(8, 27, 'B.	A continuous process'),
(8, 28, 'C.	Often motivated by crisis'),
(8, 29, 'D.	Often degrades the resource base'),
(10, 30, 'A.	Maintain rigor in implementation'),
(10, 31, 'B.	Quantify all findings'),
(10, 32, 'C.	Maintain objectivity in analysis'),
(10, 33, 'D.	Recognize and manage bias'),
(11, 34, 'A.	Professional bias'),
(11, 35, 'B.	Person bias'),
(11, 36, 'C.	Spatial bias'),
(11, 37, 'D.	Project bias'),
(12, 38, 'A.	What crops are you growing this season?'),
(12, 39, 'B.	How do you feel about the agricultural extension officer?'),
(12, 40, 'C.	Do you have problems with the agricultural extension officer?'),
(12, 41, 'D.	Can someone elaborate on this?');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE IF NOT EXISTS `questions` (
  `qid` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(500) NOT NULL,
  `answerid` int(11) NOT NULL,
  PRIMARY KEY (`qid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`qid`, `question`, `answerid`) VALUES
(1, 'What is the difference between the concepts of gender and sex?', 7),
(3, 'The equal enjoyment by women, girls, boys and men of rights, opportunities, resources and rewards is known as:', 10),
(4, 'When conducting gender sensitive climate change research, it is critical to learn about which gendered aspects:', 13),
(5, 'Which of the following does NOT characterize climate change?', 19),
(6, 'The ability of a system to adjust, modify or change its characteristics and actions to moderate potential, future damage; take advantage of opportunities; and to cope with the consequences of shock', 22),
(8, 'There are many ways in which community actors react to changes in their situation. Adaptation, mitigation and coping are examples of ways communities handle a changing climate and its effects. Which o', 27),
(10, 'A qualitative researcher using participatory methods need to be able to do all of the following, EXCEPT:', 31),
(11, 'Qualitative researchers need to be highly aware of potential biases in the research process that may affect the quality of data collected. What type of bias refers to the selection of a study area based on the presence of other projects, because of the increased level of activities in the village and comfort with outside investigators?', 37),
(12, 'The quality of data in qualitative research depends both on how the questions are posed and how the comments and stories are recorded by the note taker, possibly supported by a recorder. There are open-ended, close-ended, leading and probing questions. Identify the leading question below. ', 40);

-- --------------------------------------------------------

--
-- Table structure for table `responds`
--

CREATE TABLE IF NOT EXISTS `responds` (
  `userid` int(11) NOT NULL,
  `qid` int(11) NOT NULL,
  `answer` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `responds`
--

INSERT INTO `responds` (`userid`, `qid`, `answer`) VALUES
(1, 1, '5'),
(1, 3, '9'),
(1, 4, '17'),
(1, 5, '20'),
(1, 6, '23'),
(1, 8, '28'),
(1, 10, '33'),
(1, 11, '37'),
(1, 12, '41'),
(3, 1, '5'),
(3, 3, '9'),
(3, 4, '12'),
(3, 5, '21'),
(3, 6, '24'),
(3, 8, '29'),
(3, 10, '33'),
(3, 11, '35'),
(3, 12, '40'),
(4, 1, '5'),
(4, 3, '9'),
(4, 4, '12'),
(4, 5, '21'),
(4, 6, '24'),
(4, 8, '29'),
(4, 10, '33'),
(4, 11, '35'),
(4, 12, '40'),
(5, 1, '5'),
(5, 3, '9'),
(5, 4, '17'),
(5, 5, '20'),
(5, 6, '23'),
(5, 8, '28'),
(5, 10, '33'),
(5, 11, '37'),
(5, 12, '41'),
(6, 1, '5'),
(6, 3, '9'),
(6, 4, '16'),
(6, 5, '19'),
(6, 6, '23'),
(6, 8, '27'),
(6, 10, '32'),
(6, 11, '36'),
(7, 1, '5'),
(7, 3, '9'),
(7, 4, '17'),
(7, 5, '20'),
(7, 6, '24'),
(7, 8, '29'),
(7, 10, '33'),
(7, 11, '37'),
(7, 12, '41'),
(8, 1, '5'),
(8, 3, '9'),
(8, 4, '17'),
(8, 5, '20'),
(8, 6, '23'),
(8, 8, '28'),
(8, 10, '33'),
(8, 11, '37'),
(8, 12, '41'),
(9, 1, '5'),
(9, 3, '9'),
(9, 4, '16'),
(9, 5, '19'),
(9, 6, '23'),
(9, 8, '29'),
(9, 10, '33'),
(9, 11, '36'),
(9, 12, '41'),
(10, 1, '5'),
(10, 3, '10'),
(10, 4, '11'),
(10, 5, '20'),
(10, 6, '24'),
(10, 8, '29'),
(10, 10, '33'),
(10, 11, '36'),
(10, 12, '40'),
(11, 1, '5'),
(11, 3, '9'),
(11, 4, '17'),
(11, 5, '20'),
(11, 6, '23'),
(11, 8, '27'),
(11, 10, '31'),
(11, 11, '36'),
(11, 12, '40'),
(12, 1, '5'),
(12, 3, '9'),
(12, 4, '11'),
(12, 5, '21'),
(12, 6, '24'),
(12, 8, '29'),
(12, 10, '33'),
(12, 11, '36'),
(12, 12, '41'),
(13, 1, '5'),
(13, 3, '9'),
(13, 4, '16'),
(13, 5, '18'),
(13, 6, '22'),
(13, 8, '27'),
(13, 10, '32'),
(13, 11, '35'),
(13, 12, '40'),
(14, 1, '5'),
(14, 3, '9'),
(14, 4, '16'),
(14, 5, '19'),
(14, 6, '22'),
(14, 8, '28'),
(14, 10, '33'),
(14, 11, '37'),
(14, 12, '41'),
(15, 1, '5'),
(15, 3, '9'),
(15, 4, '11'),
(15, 5, '21'),
(15, 6, '24'),
(15, 8, '29'),
(15, 10, '33'),
(15, 11, '37'),
(15, 12, '41'),
(16, 1, '5'),
(16, 3, '10'),
(16, 4, '17'),
(16, 5, '21'),
(16, 6, '23'),
(16, 8, '27'),
(16, 10, '32'),
(16, 11, '35'),
(16, 12, '40'),
(17, 1, '5'),
(17, 3, '9'),
(17, 4, '17'),
(17, 5, '20'),
(17, 6, '23'),
(17, 8, '28'),
(17, 10, '33'),
(17, 11, '37'),
(17, 12, '41'),
(18, 1, '5'),
(18, 3, '9'),
(18, 4, '17'),
(18, 5, '21'),
(18, 6, '23'),
(18, 8, '28'),
(18, 10, '33'),
(18, 11, '37'),
(18, 12, '41'),
(19, 1, '5'),
(19, 3, '14'),
(19, 4, '11'),
(19, 5, '21'),
(19, 6, '24'),
(19, 8, '28'),
(19, 10, '32'),
(19, 11, '36'),
(19, 12, '41'),
(20, 1, '5'),
(20, 3, '9'),
(20, 4, '11'),
(20, 5, '20'),
(20, 6, '23'),
(20, 8, '27'),
(20, 10, '32'),
(20, 11, '35'),
(20, 12, '40'),
(21, 1, '5'),
(21, 3, '9'),
(21, 4, '17'),
(21, 5, '21'),
(21, 6, '24'),
(21, 8, '28'),
(21, 10, '33'),
(21, 11, '37'),
(21, 12, '41'),
(22, 1, '5'),
(22, 3, '10'),
(22, 4, '11'),
(22, 5, '21'),
(22, 6, '23'),
(22, 8, '28'),
(22, 10, '32'),
(22, 11, '35'),
(22, 12, '39'),
(23, 1, '7'),
(23, 3, '14'),
(23, 4, '17'),
(23, 5, '19'),
(23, 6, '23'),
(23, 8, '27'),
(23, 10, '32'),
(23, 11, '35'),
(23, 12, '39'),
(24, 1, '5'),
(24, 3, '9'),
(24, 4, '17'),
(24, 5, '21'),
(24, 6, '23'),
(24, 8, '28'),
(24, 10, '32'),
(24, 11, '35'),
(24, 12, '39'),
(25, 1, '5'),
(25, 3, '9'),
(25, 4, '16'),
(25, 5, '19'),
(25, 6, '23'),
(25, 8, '27'),
(25, 10, '31'),
(25, 11, '35'),
(25, 12, '40'),
(26, 1, '5'),
(26, 3, '9'),
(26, 4, '17'),
(26, 5, '19'),
(26, 6, '23'),
(26, 8, '27'),
(26, 10, '33'),
(26, 11, '35'),
(26, 12, '39'),
(27, 1, '5'),
(27, 3, '9'),
(27, 4, '16'),
(27, 5, '18'),
(27, 6, '22'),
(27, 8, '28'),
(27, 10, '33'),
(27, 11, '35'),
(27, 12, '41'),
(28, 1, '5'),
(28, 3, '9'),
(28, 4, '16'),
(28, 5, '19'),
(28, 6, '22'),
(28, 8, '26'),
(28, 10, '31'),
(28, 11, '35'),
(28, 12, '41');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=29 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(25),
(26),
(27),
(28);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
