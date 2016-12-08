-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1
-- Время создания: Дек 08 2016 г., 19:48
-- Версия сервера: 10.1.16-MariaDB
-- Версия PHP: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `arcomage`
--

-- --------------------------------------------------------

--
-- Структура таблицы `card`
--

CREATE TABLE `card` (
  `card_id` int(11) NOT NULL,
  `card_name` varchar(100) NOT NULL,
  `card_cost` int(100) DEFAULT NULL,
  `card_elem` int(100) DEFAULT NULL,
  `card_self_tower_hp` int(11) DEFAULT NULL,
  `card_enemy_tower_hp` int(11) DEFAULT NULL,
  `card_self_wall_hp` int(11) DEFAULT NULL,
  `card_enemy_wall_hp` int(11) DEFAULT NULL,
  `card_self_res1` int(11) DEFAULT NULL,
  `card_self_gen1` int(11) DEFAULT NULL,
  `card_enemy_res1` int(11) DEFAULT NULL,
  `card_enemy_gen1` int(11) DEFAULT NULL,
  `card_self_res2` int(11) DEFAULT NULL,
  `card_self_gen2` int(11) DEFAULT NULL,
  `card_enemy_res2` int(11) DEFAULT NULL,
  `card_enemy_gen2` int(11) DEFAULT NULL,
  `card_self_res3` int(11) DEFAULT NULL,
  `card_self_gen3` int(11) DEFAULT NULL,
  `card_enemy_res3` int(11) DEFAULT NULL,
  `card_enemy_gen3` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `card`
--

INSERT INTO `card` (`card_id`, `card_name`, `card_cost`, `card_elem`, `card_self_tower_hp`, `card_enemy_tower_hp`, `card_self_wall_hp`, `card_enemy_wall_hp`, `card_self_res1`, `card_self_gen1`, `card_enemy_res1`, `card_enemy_gen1`, `card_self_res2`, `card_self_gen2`, `card_enemy_res2`, `card_enemy_gen2`, `card_self_res3`, `card_self_gen3`, `card_enemy_res3`, `card_enemy_gen3`) VALUES
(1, 'Plevok', 1, 3, 0, 0, 0, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(2, 'Spustit'' sobak', 2, 3, 0, 0, 0, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(3, 'Obstrel', 4, 3, 0, 0, 0, -5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(4, 'Artilleriya', 8, 3, 0, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(5, 'Drakon', 12, 3, 0, 0, 0, -15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(6, 'stroitel''', 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(7, 'reconstrucia', 3, 1, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(8, 'upgrade', 12, 1, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(9, 'pokraska', 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(10, 'kirpich', 4, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(11, 'antiprigar', 11, 1, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(12, 'bolshaya stroyka', 21, 1, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(13, 'volshebnaya povozka', 4, 2, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(14, 'priliv sil', 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0),
(15, 'portal v zverin', 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0),
(16, 'deconstuctor', 3, 2, 0, 0, 0, 0, 0, 0, -8, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(17, 'sjiganie many', 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -8, 0, 0, 0, 0, 0),
(18, 'travlya', 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -8, 0),
(19, 'masterskaya', 8, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(20, 'bashnya volshebnika', 8, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0),
(21, 'veterinarka', 8, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0),
(22, 'obval', 6, 1, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0),
(23, 'otyplenie', 6, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0),
(24, 'otkryt'' kletki', 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1),
(25, 'perestroyka', 9, 1, 10, 0, -5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(26, 'razbor', 13, 1, 10, 0, 0, -5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(27, 'ataka', 3, 3, 0, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(28, 'spustit''', 8, 3, 0, -5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(29, 'podlaya diversiya', 18, 3, 0, -10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `collection`
--

CREATE TABLE `collection` (
  `collection_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL,
  `card_amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `collection`
--

INSERT INTO `collection` (`collection_id`, `player_id`, `card_id`, `card_amount`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 1),
(3, 1, 3, 1),
(4, 1, 4, 1),
(5, 1, 5, 1),
(6, 1, 6, 1),
(7, 1, 7, 1),
(8, 1, 8, 1),
(9, 1, 9, 1),
(10, 1, 10, 1),
(11, 1, 11, 1),
(12, 1, 12, 1),
(13, 1, 13, 1),
(14, 1, 14, 1),
(15, 1, 15, 1),
(16, 1, 16, 1),
(17, 1, 17, 1),
(18, 1, 18, 1),
(19, 1, 19, 1),
(20, 1, 20, 1),
(21, 2, 1, 1),
(22, 2, 2, 1),
(23, 2, 3, 1),
(24, 2, 4, 1),
(25, 2, 5, 1),
(26, 2, 6, 1),
(27, 2, 7, 1),
(28, 2, 8, 1),
(29, 2, 9, 1),
(30, 2, 10, 1),
(31, 2, 11, 1),
(32, 2, 12, 1),
(33, 2, 13, 1),
(34, 2, 14, 1),
(35, 2, 15, 1),
(36, 2, 16, 1),
(37, 2, 17, 1),
(38, 2, 18, 1),
(39, 2, 19, 1),
(40, 2, 20, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `deck`
--

CREATE TABLE `deck` (
  `deck_id` int(11) NOT NULL,
  `deck_num` int(11) NOT NULL,
  `deck_name` varchar(50) NOT NULL,
  `player_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `deck`
--

INSERT INTO `deck` (`deck_id`, `deck_num`, `deck_name`, `player_id`) VALUES
(1, 1, 'startDeck', 1),
(2, 1, 'startDeck', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `deckcard`
--

CREATE TABLE `deckcard` (
  `deckCard_id` int(11) NOT NULL,
  `deck_id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `deckcard`
--

INSERT INTO `deckcard` (`deckCard_id`, `deck_id`, `card_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 1, 7),
(8, 1, 8),
(9, 1, 9),
(10, 1, 10),
(11, 1, 11),
(12, 1, 12),
(13, 1, 13),
(14, 1, 14),
(15, 1, 15),
(16, 2, 1),
(17, 2, 2),
(18, 2, 3),
(19, 2, 4),
(20, 2, 5),
(21, 2, 6),
(22, 2, 7),
(23, 2, 8),
(24, 2, 9),
(25, 2, 10),
(26, 2, 11),
(27, 2, 12),
(28, 2, 13),
(29, 2, 14),
(30, 2, 15);

-- --------------------------------------------------------

--
-- Структура таблицы `matches`
--

CREATE TABLE `matches` (
  `match_id` int(11) NOT NULL,
  `match_player1_id` int(11) NOT NULL,
  `match_player2_id` int(11) NOT NULL,
  `match_result` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `matches`
--

INSERT INTO `matches` (`match_id`, `match_player1_id`, `match_player2_id`, `match_result`) VALUES
(1, 1, 0, 2),
(2, 2, 0, 0),
(3, 2, 1, 1),
(4, 1, 0, 2),
(5, 2, 1, 1),
(6, 2, 1, 2),
(7, 1, 0, 1),
(8, 1, 0, 0),
(9, 1, 0, 1),
(10, 1, 0, 0),
(11, 1, 0, 0),
(12, 1, 0, 0),
(13, 1, 0, 0),
(14, 1, 0, 0),
(15, 1, 2, 0),
(16, 1, 2, 0),
(17, 1, 2, 0),
(18, 1, 2, 0),
(19, 1, 2, 0),
(20, 1, 2, 0),
(21, 2, 1, 0),
(22, 1, 0, 2),
(23, 1, 0, 1),
(24, 1, 1, 0),
(25, 2, 1, 3),
(26, 1, 2, 2),
(27, 2, 0, 0),
(28, 1, 0, 2),
(29, 1, 0, 0),
(30, 1, 0, 2),
(31, 1, 0, 1),
(32, 2, 1, 1),
(33, 2, 1, 0),
(34, 1, 0, 1),
(35, 2, 1, 1),
(36, 1, 0, 1),
(37, 1, 0, 0),
(38, 1, 0, 3),
(39, 1, 0, 0),
(40, 1, 0, 0),
(41, 1, 0, 0),
(42, 1, 0, 0),
(43, 1, 0, 0),
(44, 1, 0, 0),
(45, 1, 0, 0),
(46, 1, 0, 0),
(47, 1, 0, 0),
(48, 1, 0, 0),
(49, 1, 0, 0),
(50, 2, 1, 0),
(51, 2, 1, 0),
(52, 1, 2, 0),
(53, 1, 2, 0),
(54, 1, 2, 2),
(55, 1, 2, 2),
(56, 1, 2, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `player`
--

CREATE TABLE `player` (
  `player_id` int(11) NOT NULL,
  `player_name` varchar(100) NOT NULL,
  `player_login` varchar(50) NOT NULL,
  `player_password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `player`
--

INSERT INTO `player` (`player_id`, `player_name`, `player_login`, `player_password`) VALUES
(1, 'vasya', '1', '1'),
(2, 'petya', '2', '2'),
(3, 'valera', '3', '3'),
(4, 'valentin', '4', '4');

-- --------------------------------------------------------

--
-- Структура таблицы `status`
--

CREATE TABLE `status` (
  `status_id` int(11) NOT NULL,
  `status_player1_id` int(11) NOT NULL,
  `status_player2_id` int(11) NOT NULL,
  `status_turn` tinyint(1) NOT NULL,
  `status_card_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `status`
--

INSERT INTO `status` (`status_id`, `status_player1_id`, `status_player2_id`, `status_turn`, `status_card_id`) VALUES
(1, 1, 2, 0, 8);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`card_id`);

--
-- Индексы таблицы `collection`
--
ALTER TABLE `collection`
  ADD PRIMARY KEY (`collection_id`),
  ADD KEY `card_id` (`card_id`),
  ADD KEY `player_id` (`player_id`);

--
-- Индексы таблицы `deck`
--
ALTER TABLE `deck`
  ADD PRIMARY KEY (`deck_id`);

--
-- Индексы таблицы `deckcard`
--
ALTER TABLE `deckcard`
  ADD PRIMARY KEY (`deckCard_id`);

--
-- Индексы таблицы `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`match_id`);

--
-- Индексы таблицы `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`player_id`);

--
-- Индексы таблицы `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`status_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `card`
--
ALTER TABLE `card`
  MODIFY `card_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT для таблицы `collection`
--
ALTER TABLE `collection`
  MODIFY `collection_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT для таблицы `deck`
--
ALTER TABLE `deck`
  MODIFY `deck_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT для таблицы `deckcard`
--
ALTER TABLE `deckcard`
  MODIFY `deckCard_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT для таблицы `matches`
--
ALTER TABLE `matches`
  MODIFY `match_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
--
-- AUTO_INCREMENT для таблицы `player`
--
ALTER TABLE `player`
  MODIFY `player_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT для таблицы `status`
--
ALTER TABLE `status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
