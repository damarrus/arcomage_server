-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1
-- Время создания: Ноя 12 2016 г., 13:19
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
  `card_cost` int(100) NOT NULL,
  `card_elem` int(100) NOT NULL,
  `card_self_tower_hp` int(11) DEFAULT NULL,
  `card_enemy_tower_hp` int(11) DEFAULT NULL,
  `card_self_wall_hp` int(11) NOT NULL,
  `card_enemy_wall_hp` int(11) NOT NULL,
  `card_self_res1` int(11) NOT NULL,
  `card_self_gen1` int(11) NOT NULL,
  `card_enemy_res1` int(11) NOT NULL,
  `card_enemy_gen1` int(11) NOT NULL,
  `card_self_res2` int(11) NOT NULL,
  `card_self_gen2` int(11) NOT NULL,
  `card_enemy_res2` int(11) NOT NULL,
  `card_enemy_gen2` int(11) NOT NULL,
  `card_self_res3` int(11) NOT NULL,
  `card_self_gen3` int(11) NOT NULL,
  `card_enemy_res3` int(11) NOT NULL,
  `card_enemy_gen3` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `card`
--

INSERT INTO `card` (`card_id`, `card_name`, `card_cost`, `card_elem`, `card_self_tower_hp`, `card_enemy_tower_hp`, `card_self_wall_hp`, `card_enemy_wall_hp`, `card_self_res1`, `card_self_gen1`, `card_enemy_res1`, `card_enemy_gen1`, `card_self_res2`, `card_self_gen2`, `card_enemy_res2`, `card_enemy_gen2`, `card_self_res3`, `card_self_gen3`, `card_enemy_res3`, `card_enemy_gen3`) VALUES
(1, 'fireball', 6, 2, 0, -5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(2, 'miner', 10, 1, -7, -7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(3, 'waterfall', 3, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(4, 'big dick', 3, 2, 3, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(5, 'drop_table', 3, 2, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(6, 'vodka', 3, 2, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(7, 'yarik pidar', 3, 2, -5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(8, 'yarik kidala', 3, 2, -10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(9, 'warrior', 3, 2, 2, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(10, 'bullshit', 3, 2, -6, -6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(11, 'gg wp', 3, 2, 10, -20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(12, 'lgd push', 3, 2, 0, -8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

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
(1, 1, 2, 0),
(2, 1, 2, 0),
(3, 1, 2, 0),
(4, 1, 2, 0),
(5, 1, 2, 0),
(6, 1, 2, 0),
(7, 1, 2, 0),
(8, 1, 2, 0);

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
(2, 'petya', '2', '2');

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
  MODIFY `card_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT для таблицы `matches`
--
ALTER TABLE `matches`
  MODIFY `match_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT для таблицы `player`
--
ALTER TABLE `player`
  MODIFY `player_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT для таблицы `status`
--
ALTER TABLE `status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
