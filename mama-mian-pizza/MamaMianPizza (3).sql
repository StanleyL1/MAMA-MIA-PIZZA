-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: vps.mamamianpizza.com
-- Tiempo de generación: 24-06-2025 a las 03:37:33
-- Versión del servidor: 8.4.5
-- Versión de PHP: 8.3.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `MamaMianPIzza`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administradores`
--

CREATE TABLE `administradores` (
  `id_admin` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL,
  `ultimo_acceso` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `administradores`
--

INSERT INTO `administradores` (`id_admin`, `nombre`, `correo`, `contrasena`, `rol`, `celular`, `fecha_creacion`, `ultimo_acceso`) VALUES
(3, 'Milena Zelaya1', 'nathy.zelaya55@gmail.com', '$2b$12$OkkGSF2yjKiAX.j3ZwqbpunQchNv7vI.R8Rj2OwLEP61Rgh2IHyzq', 'super_admin', '+503 7014-1812', '2025-06-19 00:13:56', '2025-06-19 05:18:43'),
(5, 'erick tiznado', 'tiznadoerick3@gmail.com', '$2b$12$Yrlqfx3KVX2DYeA6Iuh20ODcmbRwJRDDhrhwhk9k1dIO3bjUEZp.S', 'admin', '+503 7014-1812', '2025-06-24 01:17:28', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'Pizza', 'Categoria dedicada a las pizzas'),
(2, 'Bebidas', 'Seccion dedicada a las bebidas de todo tipo'),
(4, 'Bebidas', 'Seccion dedicada a las bebidas de todo tipo'),
(5, 'Complementos', 'Sección dedicada a todos aquellos productos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contenido_web`
--

CREATE TABLE `contenido_web` (
  `id_contenido` int NOT NULL,
  `seccion` varchar(50) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `contenido` text NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedidos`
--

CREATE TABLE `detalle_pedidos` (
  `id_detalle` int NOT NULL,
  `id_pedido` int NOT NULL,
  `id_producto` int NOT NULL,
  `nombre_producto` varchar(100) NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `masa` varchar(50) DEFAULT NULL,
  `tamano` varchar(50) DEFAULT NULL,
  `instrucciones_especiales` text,
  `metodo_entrega` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `detalle_pedidos`
--

INSERT INTO `detalle_pedidos` (`id_detalle`, `id_pedido`, `id_producto`, `nombre_producto`, `cantidad`, `precio_unitario`, `masa`, `tamano`, `instrucciones_especiales`, `metodo_entrega`, `subtotal`) VALUES
(43, 40, 9, 'Pizza de curil', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(44, 41, 9, 'Pizza de curil', 1, 4.00, 'Tradicional', 'Personal', NULL, 0, 4.00),
(45, 42, 8, 'Pizza de camarón', 1, 4.00, 'Tradicional', 'Mediana', NULL, 1, 4.00),
(46, 43, 9, 'Pizza de curil', 1, 4.00, 'Tradicional', 'Gigante', NULL, 0, 4.00),
(47, 44, 9, 'Pizza de curil', 1, 4.00, 'Tradicional', 'Gigante', NULL, 0, 4.00),
(48, 45, 13, 'Hawaiana Pizza', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(49, 46, 8, 'Pizza de camarón', 6, 4.00, 'Tradicional', 'Personal', NULL, 1, 24.00),
(50, 47, 13, 'Hawaiana Pizza', 5, 4.00, 'Tradicional', 'Personal', NULL, 1, 20.00),
(51, 48, 12, 'Pepperoni Pizza', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(52, 49, 10, 'Quesos Suprema', 6, 4.00, NULL, NULL, NULL, 1, 24.00),
(53, 50, 10, 'Quesos Suprema', 6, 4.00, NULL, NULL, NULL, 1, 24.00),
(54, 51, 13, 'Hawaiana Pizza', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(55, 51, 12, 'Pepperoni Pizza', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(56, 52, 13, 'Hawaiana Pizza', 1, 4.00, 'Tradicional', 'Personal', NULL, 0, 4.00),
(57, 53, 13, 'Hawaiana Pizza', 1, 4.00, 'Tradicional', 'Personal', NULL, 0, 4.00),
(58, 54, 8, 'Pizza de camarón', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(59, 54, 9, 'Pizza de curil', 3, 4.00, 'Tradicional', 'Personal', NULL, 1, 12.00),
(60, 55, 8, 'Pizza de camarón', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(61, 55, 9, 'Pizza de curil', 3, 4.00, 'Tradicional', 'Personal', NULL, 1, 12.00),
(62, 57, 8, 'Pizza de camarón', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(63, 57, 9, 'Pizza de curil', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(64, 57, 10, 'Quesos Suprema', 1, 4.00, NULL, NULL, NULL, 1, 4.00),
(65, 57, 11, 'Suprema Pizza', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(66, 57, 12, 'Pepperoni Pizza', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(67, 58, 8, 'Pizza de camarón', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(68, 58, 9, 'Pizza de curil', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(69, 58, 10, 'Quesos Suprema', 1, 4.00, NULL, NULL, NULL, 1, 4.00),
(70, 58, 11, 'Suprema Pizza', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(71, 58, 12, 'Pepperoni Pizza', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(72, 59, 8, 'Pizza de camarón', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(73, 59, 8, 'Pizza de camarón', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(74, 60, 9, 'Pizza de curil', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(75, 61, 8, 'Pizza de camarón', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(76, 61, 9, 'Pizza de curil', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(77, 61, 10, 'Quesos Suprema', 2, 4.00, NULL, NULL, NULL, 1, 8.00),
(78, 61, 11, 'Suprema Pizza', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(79, 61, 12, 'Pepperoni Pizza', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(80, 61, 13, 'Hawaiana Pizza', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(81, 61, 13, 'Hawaiana Pizza', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(82, 62, 8, 'Pizza de camarón', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(83, 62, 9, 'Pizza de curil', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00),
(84, 62, 10, 'Quesos Suprema', 2, 4.00, NULL, NULL, NULL, 1, 8.00),
(85, 62, 11, 'Suprema Pizza', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(86, 62, 12, 'Pepperoni Pizza', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(87, 62, 13, 'Hawaiana Pizza', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(88, 62, 13, 'Hawaiana Pizza', 2, 4.00, 'Tradicional', 'Personal', NULL, 1, 8.00),
(89, 63, 9, 'Pizza de curil', 1, 4.00, 'Tradicional', 'Personal', NULL, 1, 4.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direcciones`
--

CREATE TABLE `direcciones` (
  `id_direccion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `direccion` text,
  `referencias` text,
  `tipo_direccion` enum('formulario','tiempo_real') NOT NULL DEFAULT 'formulario',
  `pais` varchar(100) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `municipio` varchar(100) DEFAULT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `precision_ubicacion` int DEFAULT NULL,
  `direccion_formateada` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `direcciones`
--

INSERT INTO `direcciones` (`id_direccion`, `id_usuario`, `direccion`, `referencias`, `tipo_direccion`, `pais`, `departamento`, `municipio`, `latitud`, `longitud`, `precision_ubicacion`, `direccion_formateada`) VALUES
(1, 1, 'En el Local - Pedido creado por Administrador', NULL, 'formulario', 'El Salvador', 'San Salvador', 'San Salvador', NULL, NULL, NULL, NULL),
(2, 2, 'En el Local - Pedido creado por Administrador', NULL, 'formulario', 'El Salvador', 'San Salvador', 'San Salvador', NULL, NULL, NULL, NULL),
(3, 5, 'En el Local - Pedido creado por Administrador', NULL, 'formulario', 'El Salvador', 'San Salvador', 'San Salvador', NULL, NULL, NULL, NULL),
(4, 6, 'En el Local - Pedido creado por Administrador', NULL, 'formulario', 'El Salvador', 'San Salvador', 'San Salvador', NULL, NULL, NULL, NULL),
(5, 4, NULL, NULL, 'tiempo_real', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 4, NULL, NULL, 'tiempo_real', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 4, NULL, NULL, 'tiempo_real', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 4, NULL, NULL, 'tiempo_real', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 4, NULL, NULL, 'tiempo_real', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 7, 'En el Local - Pedido creado por Administrador', NULL, 'formulario', 'El Salvador', 'San Salvador', 'San Salvador', NULL, NULL, NULL, NULL),
(11, 8, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(12, 9, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(13, 4, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(14, 10, 'En el Local - Pedido creado por Administrador', NULL, 'formulario', 'El Salvador', 'San Salvador', 'San Salvador', NULL, NULL, NULL, NULL),
(15, 11, 'En el Local - Pedido creado por Administrador', NULL, 'formulario', 'El Salvador', 'San Salvador', 'San Salvador', NULL, NULL, NULL, NULL),
(16, 12, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(17, 12, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(18, 4, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(19, 13, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(20, 14, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(21, 15, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(22, 4, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(23, 4, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(27, 17, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(28, 18, 'El Brazo, Caserío Las Tejeras', NULL, 'formulario', 'El Salvador', 'San Salvador', 'Usulutan', NULL, NULL, NULL, NULL),
(29, 19, 'El Tecomatal, San Miguel, El Salvador', NULL, 'tiempo_real', NULL, NULL, NULL, 13.37000000, -88.14000000, 50000, 'El Tecomatal, San Miguel, El Salvador'),
(30, 20, 'El Tecomatal, San Miguel, El Salvador', NULL, 'tiempo_real', NULL, NULL, NULL, 13.37000000, -88.14000000, 50000, 'El Tecomatal, San Miguel, El Salvador'),
(31, 16, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(32, 21, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(33, 16, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(34, 16, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(35, 3, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(36, 16, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(37, 16, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(38, 22, NULL, NULL, 'tiempo_real', NULL, NULL, NULL, 13.31992024, -88.57095991, 8, 'Colonia Quintanilla No 2, Jiquilisco, Usulután, El Salvador'),
(39, 16, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(40, 25, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(41, 27, NULL, NULL, 'tiempo_real', NULL, NULL, NULL, 13.34181329, -88.41860638, 24, 'Universidad Gerardo Barrios Cru, KM 113 CARRETERA EL LITORAL, 1a Avenida Sur, Barrio El Calvario, Santa María, Usulután, 3401, El Salvador'),
(42, 28, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(43, 29, 'Universidad Gerardo Barrios Cru, KM 113 CARRETERA EL LITORAL, 1a Avenida Sur, Barrio El Calvario, Santa María, Usulután, 3401, El Salvador', NULL, 'tiempo_real', NULL, NULL, NULL, 13.34177315, -88.41855973, 20, 'Universidad Gerardo Barrios Cru, KM 113 CARRETERA EL LITORAL, 1a Avenida Sur, Barrio El Calvario, Santa María, Usulután, 3401, El Salvador'),
(44, 30, 'Universidad Gerardo Barrios Cru, KM 113 CARRETERA EL LITORAL, 1a Avenida Sur, Barrio El Calvario, Santa María, Usulután, 3401, El Salvador', NULL, 'tiempo_real', NULL, NULL, NULL, 13.34177315, -88.41855973, 20, 'Universidad Gerardo Barrios Cru, KM 113 CARRETERA EL LITORAL, 1a Avenida Sur, Barrio El Calvario, Santa María, Usulután, 3401, El Salvador'),
(45, 31, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(46, 32, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(47, 33, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(48, 34, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(49, 35, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(50, 36, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(51, 25, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(52, 37, 'Universidad Gerardo Barrios Cru, KM 113 CARRETERA EL LITORAL, 1a Avenida Sur, Barrio El Calvario, Santa María, Usulután, 3401, El Salvador', NULL, 'tiempo_real', NULL, NULL, NULL, 13.34171777, -88.41857785, 20, 'Universidad Gerardo Barrios Cru, KM 113 CARRETERA EL LITORAL, 1a Avenida Sur, Barrio El Calvario, Santa María, Usulután, 3401, El Salvador'),
(53, 38, 'Universidad Gerardo Barrios Cru, KM 113 CARRETERA EL LITORAL, 1a Avenida Sur, Barrio El Calvario, Santa María, Usulután, 3401, El Salvador', NULL, 'tiempo_real', NULL, NULL, NULL, 13.34171777, -88.41857785, 20, 'Universidad Gerardo Barrios Cru, KM 113 CARRETERA EL LITORAL, 1a Avenida Sur, Barrio El Calvario, Santa María, Usulután, 3401, El Salvador'),
(54, 27, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(55, 27, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(56, 39, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(57, 40, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(58, 41, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(59, 42, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(60, 43, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(61, 27, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(62, 27, 'CP #3417, Puerto El Triunfo, EL salvador', NULL, 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL),
(63, 47, 'CP #3417, Puerto El Triunfo, EL salvador', 'Local principal', 'formulario', 'El Salvador', 'Usulután', 'Jiquilisco', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `experiencia`
--

CREATE TABLE `experiencia` (
  `id_experiencia` int NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `valoracion` tinyint NOT NULL COMMENT '1–5 estrellas',
  `id_usuario` int NOT NULL,
  `contenido` text NOT NULL,
  `ruta_foto` varchar(255) DEFAULT NULL COMMENT 'URL o ruta de la foto de perfil asociada',
  `aprobado` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0=no visible, 1=visible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `experiencia`
--

INSERT INTO `experiencia` (`id_experiencia`, `titulo`, `valoracion`, `id_usuario`, `contenido`, `ruta_foto`, `aprobado`) VALUES
(1, 'dfsfsdf', 5, 4, 'sdfsdfsdfsdf', NULL, 0),
(2, 'ut7u6786', 5, 16, 'gjgyjghjgjhg', NULL, 0),
(3, '5345345', 5, 16, '34534535345', NULL, 0),
(4, 'w', 5, 3, 'w', NULL, 0),
(5, 'hfghfgh', 5, 3, 'fghfghfghgfh', NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_contenido`
--

CREATE TABLE `historial_contenido` (
  `id_historial` int NOT NULL,
  `id_contenido` int NOT NULL,
  `contenido_anterior` text NOT NULL,
  `fecha_cambio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_admin` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingredientes`
--

CREATE TABLE `ingredientes` (
  `id_ingrediente` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `cantidad_actual` decimal(10,2) NOT NULL,
  `unidad` varchar(20) NOT NULL,
  `fecha_caducidad` date DEFAULT NULL,
  `proveedor` varchar(100) DEFAULT NULL,
  `costo` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs`
--

CREATE TABLE `logs` (
  `id_log` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `accion` varchar(50) NOT NULL,
  `tabla_afectada` varchar(50) NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `logs`
--

INSERT INTO `logs` (`id_log`, `id_usuario`, `accion`, `tabla_afectada`, `fecha_hora`, `descripcion`) VALUES
(1, 1, 'LOGIN', 'administradores', '2025-06-18 20:45:59', 'Inicio de sesión exitoso del administrador: Erick Mauricio Tiznado (tiznadoerick3@gmail.com) - Rol: super_admin'),
(2, 1, 'LOGIN', 'administradores', '2025-06-18 20:50:18', 'Inicio de sesión exitoso del administrador: Erick Mauricio Tiznado (tiznadoerick3@gmail.com) - Rol: super_admin'),
(3, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-18 20:57:46', 'Intento de inicio de sesión fallido para usuario con correo: nathy.zelaya55@gmail.com'),
(4, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-18 20:57:48', 'Intento de inicio de sesión fallido para usuario con correo: nathy.zelaya55@gmail.com'),
(5, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-18 23:35:46', 'Intento de inicio de sesión fallido para usuario con correo: nathy.zelaya55@gmail.com'),
(6, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-18 23:35:47', 'Intento de inicio de sesión fallido para usuario con correo: nathy.zelaya55@gmail.com'),
(7, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-18 23:42:41', 'Intento de inicio de sesión fallido para usuario con correo: nathy.zelaya55@gmail.com'),
(8, 1, 'LOGIN', 'administradores', '2025-06-19 00:10:57', 'Inicio de sesión exitoso del administrador: Erick Mauricio Tiznado (tiznadoerick3@gmail.com) - Rol: super_admin'),
(9, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-19 00:13:47', 'Intento de inicio de sesión fallido para usuario con correo: nathy.zelaya55@gmail.com'),
(10, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-19 00:15:25', 'Intento de inicio de sesión fallido para usuario con correo: nathy.zelaya55@gmail.com'),
(11, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-19 00:29:53', 'Intento de inicio de sesión fallido para usuario con correo: nathy.zelaya55@gmail.com'),
(12, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-19 00:29:59', 'Intento de inicio de sesión fallido para usuario con correo: nathy.zelaya55@gmail.com'),
(13, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-19 00:32:38', 'Intento de inicio de sesión fallido para usuario con correo: nathy.zelaya55@gmail.com'),
(14, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-19 00:33:32', 'Intento de inicio de sesión fallido para usuario con correo: tiznadoerick3@gmail.com'),
(15, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-19 00:33:50', 'Intento de inicio de sesión fallido para usuario con correo: tiznadoerick3@gmail.com'),
(16, 16, 'LOGIN', 'usuarios', '2025-06-19 00:35:07', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(17, 16, 'LOGIN', 'usuarios', '2025-06-19 00:35:40', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(18, 3, 'LOGIN', 'usuarios', '2025-06-19 00:36:24', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(19, 3, 'LOGIN', 'usuarios', '2025-06-19 00:36:26', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(20, 3, 'LOGIN', 'usuarios', '2025-06-19 00:36:26', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(21, 16, 'LOGIN', 'usuarios', '2025-06-19 00:37:33', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(22, 16, 'LOGIN', 'usuarios', '2025-06-19 01:04:26', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(23, 16, 'LOGIN', 'usuarios', '2025-06-19 01:14:42', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(24, 1, 'CHANGE_PASSWORD_ADMIN', 'administradores', '2025-06-19 01:15:57', 'Cambio de contraseña exitoso para administrador: Erick Mauricio Tiznado (ID: 1, Email: tiznadoerick3@gmail.com)'),
(25, 16, 'LOGIN', 'usuarios', '2025-06-19 01:21:30', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(26, NULL, 'UPDATE', 'productos', '2025-06-19 01:22:14', 'Producto actualizado: \"Cheese Sticks con Salsa1111\" (ID: 3) en categoría \"pizza\" con 4 precios actualizados'),
(27, NULL, 'READ', 'productos', '2025-06-19 01:38:54', 'Menú consultado exitosamente - 12 registros encontrados'),
(28, NULL, 'READ', 'productos', '2025-06-19 01:41:26', 'Menú consultado exitosamente - 12 registros encontrados'),
(29, NULL, 'READ', 'productos', '2025-06-19 01:44:24', 'Menú consultado exitosamente - 12 registros encontrados'),
(30, NULL, 'UPDATE', 'productos', '2025-06-19 01:44:41', 'Producto actualizado: \"Cheese Sticks con Salsa1111\" (ID: 3) en categoría \"Pizza\" con 4 precios actualizados'),
(31, NULL, 'READ', 'productos', '2025-06-19 01:44:41', 'Menú consultado exitosamente - 12 registros encontrados'),
(32, NULL, 'READ', 'productos', '2025-06-19 01:44:44', 'Menú consultado exitosamente - 12 registros encontrados'),
(33, NULL, 'READ', 'productos', '2025-06-19 01:44:45', 'Menú consultado exitosamente - 12 registros encontrados'),
(34, NULL, 'READ', 'productos', '2025-06-19 01:45:00', 'Menú consultado exitosamente - 12 registros encontrados'),
(35, NULL, 'READ', 'productos', '2025-06-19 01:45:07', 'Menú consultado exitosamente - 12 registros encontrados'),
(36, NULL, 'READ', 'productos', '2025-06-19 01:45:13', 'Menú consultado exitosamente - 12 registros encontrados'),
(37, NULL, 'READ', 'productos', '2025-06-19 01:58:30', 'Menú consultado exitosamente - 12 registros encontrados'),
(38, NULL, 'READ', 'productos', '2025-06-19 01:58:30', 'Menú consultado exitosamente - 12 registros encontrados'),
(39, 16, 'LOGIN', 'usuarios', '2025-06-19 01:58:39', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(40, 16, 'LOGIN', 'usuarios', '2025-06-19 01:58:52', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(41, 16, 'LOGIN', 'usuarios', '2025-06-19 01:59:24', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(42, NULL, 'READ', 'productos', '2025-06-19 02:01:21', 'Menú consultado exitosamente - 12 registros encontrados'),
(43, NULL, 'READ', 'productos', '2025-06-19 02:02:15', 'Menú consultado exitosamente - 12 registros encontrados'),
(44, NULL, 'READ', 'productos', '2025-06-19 02:02:15', 'Menú consultado exitosamente - 12 registros encontrados'),
(45, NULL, 'READ', 'productos', '2025-06-19 02:03:56', 'Menú consultado exitosamente - 12 registros encontrados'),
(46, NULL, 'READ', 'productos', '2025-06-19 02:03:56', 'Menú consultado exitosamente - 12 registros encontrados'),
(47, NULL, 'READ', 'productos', '2025-06-19 02:05:05', 'Menú consultado exitosamente - 12 registros encontrados'),
(48, NULL, 'READ', 'productos', '2025-06-19 02:05:05', 'Menú consultado exitosamente - 12 registros encontrados'),
(49, 16, 'LOGIN', 'usuarios', '2025-06-19 02:07:48', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(50, 16, 'LOGIN', 'usuarios', '2025-06-19 02:14:53', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(51, NULL, 'READ', 'productos', '2025-06-19 02:17:43', 'Menú consultado exitosamente - 12 registros encontrados'),
(52, NULL, 'READ', 'productos', '2025-06-19 02:17:43', 'Menú consultado exitosamente - 12 registros encontrados'),
(53, 16, 'LOGIN', 'usuarios', '2025-06-19 02:17:57', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(54, 16, 'LOGIN', 'usuarios', '2025-06-19 02:18:07', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(55, 16, 'LOGIN', 'usuarios', '2025-06-19 02:20:00', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(56, NULL, 'READ', 'productos', '2025-06-19 02:20:08', 'Menú consultado exitosamente - 12 registros encontrados'),
(57, NULL, 'READ', 'productos', '2025-06-19 02:20:08', 'Menú consultado exitosamente - 12 registros encontrados'),
(58, 16, 'LOGIN', 'usuarios', '2025-06-19 02:21:08', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(59, 16, 'LOGIN', 'usuarios', '2025-06-19 02:22:50', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(60, NULL, 'READ', 'productos', '2025-06-19 02:23:05', 'Menú consultado exitosamente - 12 registros encontrados'),
(61, NULL, 'READ', 'productos', '2025-06-19 02:23:05', 'Menú consultado exitosamente - 12 registros encontrados'),
(62, NULL, 'READ', 'productos', '2025-06-19 02:23:24', 'Menú consultado exitosamente - 12 registros encontrados'),
(63, NULL, 'READ', 'productos', '2025-06-19 02:23:24', 'Menú consultado exitosamente - 12 registros encontrados'),
(64, 16, 'LOGIN', 'usuarios', '2025-06-19 02:24:11', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(65, NULL, 'READ', 'productos', '2025-06-19 02:24:30', 'Menú consultado exitosamente - 12 registros encontrados'),
(66, NULL, 'READ', 'productos', '2025-06-19 02:24:30', 'Menú consultado exitosamente - 12 registros encontrados'),
(67, NULL, 'READ', 'productos', '2025-06-19 02:27:01', 'Menú consultado exitosamente - 12 registros encontrados'),
(68, NULL, 'READ', 'productos', '2025-06-19 02:27:33', 'Menú consultado exitosamente - 12 registros encontrados'),
(69, NULL, 'READ', 'productos', '2025-06-19 02:27:33', 'Menú consultado exitosamente - 12 registros encontrados'),
(70, NULL, 'READ', 'productos', '2025-06-19 02:27:57', 'Menú consultado exitosamente - 12 registros encontrados'),
(71, NULL, 'READ', 'productos', '2025-06-19 02:27:57', 'Menú consultado exitosamente - 12 registros encontrados'),
(72, 16, 'LOGIN', 'usuarios', '2025-06-19 02:29:59', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(73, 16, 'LOGIN', 'usuarios', '2025-06-19 02:35:15', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(74, 16, 'LOGIN', 'usuarios', '2025-06-19 02:43:27', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(75, 16, 'LOGIN', 'usuarios', '2025-06-19 02:43:29', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(76, 16, 'LOGIN', 'usuarios', '2025-06-19 02:43:31', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(77, 16, 'LOGIN', 'usuarios', '2025-06-19 02:43:33', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(78, 16, 'LOGIN', 'usuarios', '2025-06-19 02:43:34', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(79, 16, 'LOGIN', 'usuarios', '2025-06-19 02:43:35', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(80, 16, 'LOGIN', 'usuarios', '2025-06-19 02:45:39', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(81, 16, 'LOGIN', 'usuarios', '2025-06-19 02:46:27', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(82, NULL, 'READ', 'productos', '2025-06-19 02:47:34', 'Menú consultado exitosamente - 12 registros encontrados'),
(83, NULL, 'READ', 'productos', '2025-06-19 02:47:35', 'Menú consultado exitosamente - 12 registros encontrados'),
(84, 16, 'LOGIN', 'usuarios', '2025-06-19 02:50:48', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(85, NULL, 'READ', 'productos', '2025-06-19 02:52:04', 'Menú consultado exitosamente - 12 registros encontrados'),
(86, NULL, 'READ', 'productos', '2025-06-19 02:52:04', 'Menú consultado exitosamente - 12 registros encontrados'),
(87, NULL, 'READ', 'productos', '2025-06-19 02:52:21', 'Menú consultado exitosamente - 12 registros encontrados'),
(88, NULL, 'READ', 'productos', '2025-06-19 02:52:21', 'Menú consultado exitosamente - 12 registros encontrados'),
(89, 16, 'LOGIN', 'usuarios', '2025-06-19 02:52:25', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(90, 16, 'LOGIN', 'usuarios', '2025-06-19 02:53:15', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(91, 3, 'LOGIN', 'usuarios', '2025-06-19 03:17:45', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(92, 3, 'LOGIN', 'usuarios', '2025-06-19 03:17:53', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(93, NULL, 'READ', 'productos', '2025-06-19 03:18:17', 'Menú consultado exitosamente - 12 registros encontrados'),
(94, NULL, 'READ', 'productos', '2025-06-19 03:18:17', 'Menú consultado exitosamente - 12 registros encontrados'),
(95, 3, 'LOGIN', 'usuarios', '2025-06-19 03:18:34', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(96, 3, 'LOGIN', 'usuarios', '2025-06-19 03:59:50', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(97, 3, 'LOGIN', 'usuarios', '2025-06-19 03:59:59', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(98, 3, 'LOGIN', 'usuarios', '2025-06-19 04:00:42', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(99, 3, 'LOGIN', 'usuarios', '2025-06-19 04:02:00', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(100, 3, 'LOGIN', 'usuarios', '2025-06-19 04:02:18', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(101, NULL, 'READ', 'productos', '2025-06-19 04:03:41', 'Menú consultado exitosamente - 12 registros encontrados'),
(102, NULL, 'READ', 'productos', '2025-06-19 04:07:14', 'Menú consultado exitosamente - 12 registros encontrados'),
(103, 3, 'LOGIN', 'usuarios', '2025-06-19 04:08:07', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(104, 3, 'LOGIN', 'usuarios', '2025-06-19 04:08:16', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(105, 3, 'LOGIN', 'usuarios', '2025-06-19 04:08:44', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(106, NULL, 'READ', 'productos', '2025-06-19 04:10:12', 'Menú consultado exitosamente - 12 registros encontrados'),
(107, NULL, 'READ', 'productos', '2025-06-19 04:12:22', 'Menú consultado exitosamente - 12 registros encontrados'),
(108, NULL, 'READ', 'productos', '2025-06-19 04:12:43', 'Menú consultado exitosamente - 12 registros encontrados'),
(109, 3, 'LOGIN', 'usuarios', '2025-06-19 04:13:05', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(110, 16, 'LOGIN', 'usuarios', '2025-06-19 04:13:29', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(111, NULL, 'READ', 'productos', '2025-06-19 04:14:34', 'Menú consultado exitosamente - 12 registros encontrados'),
(112, 16, 'LOGIN', 'usuarios', '2025-06-19 04:14:49', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(113, NULL, 'READ', 'productos', '2025-06-19 04:17:57', 'Menú consultado exitosamente - 12 registros encontrados'),
(114, NULL, 'READ', 'productos', '2025-06-19 04:17:57', 'Menú consultado exitosamente - 12 registros encontrados'),
(115, NULL, 'READ', 'productos', '2025-06-19 04:22:31', 'Menú consultado exitosamente - 12 registros encontrados'),
(116, 16, 'LOGIN', 'usuarios', '2025-06-19 04:33:11', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(117, 16, 'LOGIN', 'usuarios', '2025-06-19 04:33:13', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(118, 16, 'LOGIN', 'usuarios', '2025-06-19 04:34:23', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(119, 16, 'LOGIN', 'usuarios', '2025-06-19 04:34:35', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(120, 16, 'LOGIN', 'usuarios', '2025-06-19 04:43:55', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(121, NULL, 'READ', 'productos', '2025-06-19 04:44:39', 'Menú consultado exitosamente - 12 registros encontrados'),
(122, NULL, 'READ', 'productos', '2025-06-19 04:44:39', 'Menú consultado exitosamente - 12 registros encontrados'),
(123, 22, 'LOGIN', 'usuarios', '2025-06-19 04:45:15', 'Inicio de sesión exitoso del usuario: Jose (alex1@gmail.com)'),
(124, 22, 'LOGIN', 'usuarios', '2025-06-19 04:45:56', 'Inicio de sesión exitoso del usuario: Jose (alex1@gmail.com)'),
(125, 22, 'LOGIN', 'usuarios', '2025-06-19 04:46:44', 'Inicio de sesión exitoso del usuario: Jose (alex1@gmail.com)'),
(126, 22, 'LOGIN', 'usuarios', '2025-06-19 04:47:13', 'Inicio de sesión exitoso del usuario: Jose (alex1@gmail.com)'),
(127, NULL, 'READ', 'productos', '2025-06-19 04:48:01', 'Menú consultado exitosamente - 12 registros encontrados'),
(128, NULL, 'READ', 'productos', '2025-06-19 04:48:01', 'Menú consultado exitosamente - 12 registros encontrados'),
(129, 22, 'LOGIN', 'usuarios', '2025-06-19 04:48:10', 'Inicio de sesión exitoso del usuario: Jose (alex1@gmail.com)'),
(130, 16, 'LOGIN', 'usuarios', '2025-06-19 04:50:35', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(131, NULL, 'READ', 'productos', '2025-06-19 04:51:11', 'Menú consultado exitosamente - 12 registros encontrados'),
(132, NULL, 'READ', 'productos', '2025-06-19 04:51:11', 'Menú consultado exitosamente - 12 registros encontrados'),
(133, 25, 'LOGIN', 'usuarios', '2025-06-19 04:59:07', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(134, 22, 'LOGIN', 'usuarios', '2025-06-19 05:00:18', 'Inicio de sesión exitoso del usuario: Jose (alex1@gmail.com)'),
(135, 22, 'LOGIN', 'usuarios', '2025-06-19 05:00:31', 'Inicio de sesión exitoso del usuario: Jose (alex1@gmail.com)'),
(136, 22, 'LOGIN', 'usuarios', '2025-06-19 05:00:51', 'Inicio de sesión exitoso del usuario: Jose (alex1@gmail.com)'),
(137, 25, 'LOGIN', 'usuarios', '2025-06-19 05:02:28', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(138, 26, 'LOGIN', 'usuarios', '2025-06-19 05:02:30', 'Inicio de sesión exitoso del usuario: Jose (alex2@gmail.com)'),
(139, 16, 'LOGIN', 'usuarios', '2025-06-19 05:02:34', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(140, NULL, 'READ', 'productos', '2025-06-19 05:02:41', 'Menú consultado exitosamente - 12 registros encontrados'),
(141, NULL, 'READ', 'productos', '2025-06-19 05:02:41', 'Menú consultado exitosamente - 12 registros encontrados'),
(142, 26, 'LOGIN', 'usuarios', '2025-06-19 05:03:06', 'Inicio de sesión exitoso del usuario: Jose (alex2@gmail.com)'),
(143, 16, 'LOGIN', 'usuarios', '2025-06-19 05:03:11', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(144, 25, 'LOGIN', 'usuarios', '2025-06-19 05:03:34', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(145, 16, 'LOGIN', 'usuarios', '2025-06-19 05:03:52', 'Inicio de sesión exitoso del usuario: milena (milu.zelaya02@gmail.com)'),
(146, NULL, 'READ', 'productos', '2025-06-19 05:03:55', 'Menú consultado exitosamente - 12 registros encontrados'),
(147, NULL, 'READ', 'productos', '2025-06-19 05:03:55', 'Menú consultado exitosamente - 12 registros encontrados'),
(148, 16, 'LOGIN', 'usuarios', '2025-06-19 05:04:15', 'Inicio de sesión exitoso del usuario: milenas (milu.zelaya02@gmail.com)'),
(149, NULL, 'READ', 'productos', '2025-06-19 05:05:45', 'Menú consultado exitosamente - 12 registros encontrados'),
(150, 26, 'LOGIN', 'usuarios', '2025-06-19 05:06:30', 'Inicio de sesión exitoso del usuario: Jose (alex2@gmail.com)'),
(151, 26, 'LOGIN', 'usuarios', '2025-06-19 05:06:31', 'Inicio de sesión exitoso del usuario: Jose (alex2@gmail.com)'),
(152, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-19 05:06:52', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(153, 3, 'LOGIN', 'administradores', '2025-06-19 05:08:10', 'Inicio de sesión exitoso del administrador: Milena Zelaya1 (nathy.zelaya55@gmail.com) - Rol: super_admin'),
(154, 27, 'LOGIN', 'usuarios', '2025-06-19 05:08:11', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(155, NULL, 'READ', 'productos', '2025-06-19 05:08:15', 'Menú consultado exitosamente - 12 registros encontrados'),
(156, 27, 'LOGIN', 'usuarios', '2025-06-19 05:08:35', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(157, NULL, 'READ', 'productos', '2025-06-19 05:08:52', 'Menú consultado exitosamente - 12 registros encontrados'),
(158, NULL, 'READ', 'productos', '2025-06-19 05:08:52', 'Menú consultado exitosamente - 12 registros encontrados'),
(159, NULL, 'READ', 'productos', '2025-06-19 05:11:22', 'Menú consultado exitosamente - 12 registros encontrados'),
(160, 27, 'LOGIN', 'usuarios', '2025-06-19 05:11:42', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(161, NULL, 'CREATE', 'productos', '2025-06-19 05:11:52', 'Producto creado: \"2342342\" (ID: 6) en categoría \"pizza\" con 4 precios configurados'),
(162, NULL, 'READ', 'productos', '2025-06-19 05:11:52', 'Menú consultado exitosamente - 16 registros encontrados'),
(163, NULL, 'DELETE', 'productos', '2025-06-19 05:12:10', 'Producto eliminado (ID: 6) junto con 4 precios asociados'),
(164, NULL, 'DELETE', 'productos', '2025-06-19 05:12:14', 'Producto eliminado (ID: 3) junto con 4 precios asociados'),
(165, NULL, 'DELETE', 'productos', '2025-06-19 05:12:16', 'Producto eliminado (ID: 4) junto con 4 precios asociados'),
(166, NULL, 'DELETE', 'productos', '2025-06-19 05:12:17', 'Producto eliminado (ID: 5) junto con 4 precios asociados'),
(167, 25, 'LOGIN', 'usuarios', '2025-06-19 05:12:39', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(168, 27, 'LOGIN', 'usuarios', '2025-06-19 05:13:57', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(169, NULL, 'READ', 'productos', '2025-06-19 05:14:13', 'Menú consultado exitosamente - 0 registros encontrados'),
(170, NULL, 'READ', 'productos', '2025-06-19 05:14:13', 'Menú consultado exitosamente - 0 registros encontrados'),
(171, NULL, 'CREATE', 'productos', '2025-06-19 05:14:32', 'Producto creado: \"Pizza de curil\" (ID: 7) en categoría \"pizza\" con 4 precios configurados'),
(172, NULL, 'READ', 'productos', '2025-06-19 05:14:32', 'Menú consultado exitosamente - 4 registros encontrados'),
(173, NULL, 'UPDATE', 'productos', '2025-06-19 05:14:55', 'Producto actualizado: \"Pizza de curil\" (ID: 7) en categoría \"Pizza\" con 4 precios actualizados'),
(174, NULL, 'READ', 'productos', '2025-06-19 05:14:55', 'Menú consultado exitosamente - 4 registros encontrados'),
(175, NULL, 'READ', 'productos', '2025-06-19 05:15:00', 'Menú consultado exitosamente - 4 registros encontrados'),
(176, NULL, 'DELETE', 'productos', '2025-06-19 05:15:34', 'Producto eliminado (ID: 7) junto con 4 precios asociados'),
(177, NULL, 'CREATE', 'productos', '2025-06-19 05:16:16', 'Producto creado: \"Pizza de camarón\" (ID: 8) en categoría \"pizza\" con 4 precios configurados'),
(178, NULL, 'READ', 'productos', '2025-06-19 05:16:16', 'Menú consultado exitosamente - 4 registros encontrados'),
(179, NULL, 'UPDATE', 'productos', '2025-06-19 05:17:02', 'Producto actualizado: \"Pizza de camarón\" (ID: 8) en categoría \"Pizza\" con 4 precios actualizados'),
(180, NULL, 'READ', 'productos', '2025-06-19 05:17:02', 'Menú consultado exitosamente - 4 registros encontrados'),
(181, NULL, 'UPDATE', 'productos', '2025-06-19 05:17:08', 'Producto actualizado: \"Pizza de camarón\" (ID: 8) en categoría \"Pizza\" con 4 precios actualizados'),
(182, NULL, 'READ', 'productos', '2025-06-19 05:17:08', 'Menú consultado exitosamente - 4 registros encontrados'),
(183, NULL, 'READ', 'productos', '2025-06-19 05:17:14', 'Menú consultado exitosamente - 4 registros encontrados'),
(184, NULL, 'READ', 'productos', '2025-06-19 05:17:32', 'Menú consultado exitosamente - 4 registros encontrados'),
(185, NULL, 'READ', 'productos', '2025-06-19 05:17:38', 'Menú consultado exitosamente - 4 registros encontrados'),
(186, NULL, 'READ', 'productos', '2025-06-19 05:18:26', 'Menú consultado exitosamente - 4 registros encontrados'),
(187, NULL, 'READ', 'productos', '2025-06-19 05:18:26', 'Menú consultado exitosamente - 4 registros encontrados'),
(188, NULL, 'READ', 'productos', '2025-06-19 05:18:33', 'Menú consultado exitosamente - 4 registros encontrados'),
(189, NULL, 'READ', 'productos', '2025-06-19 05:18:33', 'Menú consultado exitosamente - 4 registros encontrados'),
(190, 3, 'LOGIN', 'administradores', '2025-06-19 05:18:43', 'Inicio de sesión exitoso del administrador: Milena Zelaya1 (nathy.zelaya55@gmail.com) - Rol: super_admin'),
(191, NULL, 'READ', 'productos', '2025-06-19 05:18:44', 'Menú consultado exitosamente - 4 registros encontrados'),
(192, 27, 'LOGIN', 'usuarios', '2025-06-19 05:18:59', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(193, NULL, 'UPDATE', 'productos', '2025-06-19 05:19:04', 'Producto actualizado: \"Pizza de camarón\" (ID: 8) en categoría \"pizza\" con 4 precios actualizados'),
(194, NULL, 'READ', 'productos', '2025-06-19 05:19:04', 'Menú consultado exitosamente - 4 registros encontrados'),
(195, NULL, 'READ', 'productos', '2025-06-19 05:19:23', 'Menú consultado exitosamente - 4 registros encontrados'),
(196, NULL, 'READ', 'productos', '2025-06-19 05:19:23', 'Menú consultado exitosamente - 4 registros encontrados'),
(197, NULL, 'READ', 'productos', '2025-06-19 05:19:25', 'Menú consultado exitosamente - 4 registros encontrados'),
(198, NULL, 'UPDATE', 'productos', '2025-06-19 05:19:44', 'Producto actualizado: \"Pizza de camarón\" (ID: 8) en categoría \"pizza\" con 4 precios actualizados'),
(199, NULL, 'READ', 'productos', '2025-06-19 05:19:44', 'Menú consultado exitosamente - 4 registros encontrados'),
(200, NULL, 'READ', 'productos', '2025-06-19 05:20:10', 'Menú consultado exitosamente - 4 registros encontrados'),
(201, NULL, 'CREATE', 'productos', '2025-06-19 05:22:19', 'Producto creado: \"Pizza de curil\" (ID: 9) en categoría \"pizza\" con 4 precios configurados'),
(202, NULL, 'READ', 'productos', '2025-06-19 05:22:20', 'Menú consultado exitosamente - 8 registros encontrados'),
(203, NULL, 'UPDATE', 'productos', '2025-06-19 05:24:39', 'Producto actualizado: \"Pizza de camarón\" (ID: 8) en categoría \"pizza\" con 4 precios actualizados'),
(204, NULL, 'READ', 'productos', '2025-06-19 05:24:39', 'Menú consultado exitosamente - 8 registros encontrados'),
(205, 16, 'LOGIN', 'usuarios', '2025-06-19 05:25:10', 'Inicio de sesión exitoso del usuario: milenas (milu.zelaya02@gmail.com)'),
(206, 25, 'LOGIN', 'usuarios', '2025-06-19 05:25:16', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(207, 16, 'LOGIN', 'usuarios', '2025-06-19 05:25:29', 'Inicio de sesión exitoso del usuario: milenas (milu.zelaya02@gmail.com)'),
(208, 3, 'LOGIN', 'usuarios', '2025-06-19 05:28:39', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(209, NULL, 'READ', 'productos', '2025-06-19 05:30:06', 'Menú consultado exitosamente - 8 registros encontrados'),
(210, NULL, 'CREATE', 'productos', '2025-06-19 05:31:21', 'Producto creado: \"Quesos Suprema\" (ID: 10) en categoría \"pizza\" con 4 precios configurados'),
(211, NULL, 'READ', 'productos', '2025-06-19 05:31:21', 'Menú consultado exitosamente - 12 registros encontrados'),
(212, 27, 'LOGIN', 'usuarios', '2025-06-19 05:31:21', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(213, 25, 'LOGIN', 'usuarios', '2025-06-19 05:31:54', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(214, 25, 'LOGIN', 'usuarios', '2025-06-19 05:32:02', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(215, 3, 'LOGIN', 'usuarios', '2025-06-19 05:32:14', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(216, 25, 'LOGIN', 'usuarios', '2025-06-19 05:32:21', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(217, 27, 'LOGIN', 'usuarios', '2025-06-19 05:32:30', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(218, 25, 'LOGIN', 'usuarios', '2025-06-19 05:32:31', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(219, 25, 'LOGIN', 'usuarios', '2025-06-19 05:32:39', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(220, 27, 'LOGIN', 'usuarios', '2025-06-19 05:32:42', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(221, 3, 'LOGIN', 'usuarios', '2025-06-19 05:33:36', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(222, 3, 'LOGIN', 'usuarios', '2025-06-19 05:33:56', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(223, NULL, 'CREATE', 'productos', '2025-06-19 05:35:20', 'Producto creado: \"Suprema Pizza\" (ID: 11) en categoría \"pizza\" con 4 precios configurados'),
(224, NULL, 'READ', 'productos', '2025-06-19 05:35:20', 'Menú consultado exitosamente - 16 registros encontrados'),
(225, NULL, 'CREATE', 'productos', '2025-06-19 05:36:52', 'Producto creado: \"Pepperoni Pizza\" (ID: 12) en categoría \"pizza\" con 4 precios configurados'),
(226, NULL, 'READ', 'productos', '2025-06-19 05:36:52', 'Menú consultado exitosamente - 20 registros encontrados'),
(227, 27, 'LOGIN', 'usuarios', '2025-06-19 05:37:25', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(228, 3, 'LOGIN', 'usuarios', '2025-06-19 05:38:05', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(229, 3, 'LOGIN', 'usuarios', '2025-06-19 05:38:25', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(230, 3, 'LOGIN', 'usuarios', '2025-06-19 05:38:50', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(231, 25, 'LOGIN', 'usuarios', '2025-06-19 05:39:08', 'Inicio de sesión exitoso del usuario: Mauricios (tiznadoerick53@gmail.com)'),
(232, NULL, 'CREATE', 'productos', '2025-06-19 05:41:39', 'Producto creado: \"Hawaiana Pizza\" (ID: 13) en categoría \"pizza\" con 4 precios configurados'),
(233, NULL, 'READ', 'productos', '2025-06-19 05:41:40', 'Menú consultado exitosamente - 24 registros encontrados'),
(234, NULL, 'READ', 'productos', '2025-06-19 05:41:52', 'Menú consultado exitosamente - 24 registros encontrados'),
(235, NULL, 'READ', 'productos', '2025-06-19 05:41:52', 'Menú consultado exitosamente - 24 registros encontrados'),
(236, 3, 'LOGIN', 'usuarios', '2025-06-19 05:44:05', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(237, 25, 'LOGIN', 'usuarios', '2025-06-19 05:46:17', 'Inicio de sesión exitoso del usuario: Mauricios (tiznadoerick53@gmail.com)'),
(238, 3, 'LOGIN', 'usuarios', '2025-06-19 05:50:17', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(239, 3, 'LOGIN', 'usuarios', '2025-06-19 05:50:39', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(240, 25, 'LOGIN', 'usuarios', '2025-06-19 05:52:00', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(241, 25, 'LOGIN', 'usuarios', '2025-06-19 05:53:01', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(242, 3, 'LOGIN', 'usuarios', '2025-06-19 05:53:59', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(243, 3, 'LOGIN', 'usuarios', '2025-06-19 05:54:44', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(244, 3, 'LOGIN', 'usuarios', '2025-06-19 05:56:53', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(245, 25, 'LOGIN', 'usuarios', '2025-06-19 05:57:43', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(246, 3, 'LOGIN', 'usuarios', '2025-06-19 06:02:46', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(247, 27, 'LOGIN', 'usuarios', '2025-06-19 06:03:34', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(248, 3, 'LOGIN', 'usuarios', '2025-06-19 06:04:25', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(249, 27, 'LOGIN', 'usuarios', '2025-06-19 12:02:49', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(250, NULL, 'READ', 'productos', '2025-06-19 12:03:11', 'Menú consultado exitosamente - 24 registros encontrados'),
(251, NULL, 'READ', 'productos', '2025-06-19 12:03:11', 'Menú consultado exitosamente - 24 registros encontrados'),
(252, NULL, 'READ', 'productos', '2025-06-19 13:19:39', 'Menú consultado exitosamente - 24 registros encontrados'),
(253, 25, 'LOGIN', 'usuarios', '2025-06-19 13:20:01', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(254, NULL, 'READ', 'productos', '2025-06-19 14:22:46', 'Menú consultado exitosamente - 24 registros encontrados'),
(255, NULL, 'READ', 'productos', '2025-06-19 14:31:10', 'Menú consultado exitosamente - 24 registros encontrados'),
(256, NULL, 'READ', 'productos', '2025-06-19 14:31:10', 'Menú consultado exitosamente - 24 registros encontrados'),
(257, NULL, 'READ', 'productos', '2025-06-19 14:31:30', 'Menú consultado exitosamente - 24 registros encontrados'),
(258, NULL, 'READ', 'productos', '2025-06-19 14:31:30', 'Menú consultado exitosamente - 24 registros encontrados'),
(259, NULL, 'READ', 'productos', '2025-06-19 14:31:38', 'Menú consultado exitosamente - 24 registros encontrados'),
(260, NULL, 'READ', 'productos', '2025-06-19 14:31:38', 'Menú consultado exitosamente - 24 registros encontrados'),
(261, NULL, 'READ', 'productos', '2025-06-19 14:31:54', 'Menú consultado exitosamente - 24 registros encontrados'),
(262, NULL, 'READ', 'productos', '2025-06-19 14:31:54', 'Menú consultado exitosamente - 24 registros encontrados'),
(263, NULL, 'READ', 'productos', '2025-06-19 14:31:55', 'Menú consultado exitosamente - 24 registros encontrados'),
(264, NULL, 'READ', 'productos', '2025-06-19 14:32:33', 'Menú consultado exitosamente - 24 registros encontrados'),
(265, NULL, 'READ', 'productos', '2025-06-19 14:32:33', 'Menú consultado exitosamente - 24 registros encontrados'),
(266, NULL, 'READ', 'productos', '2025-06-19 14:32:56', 'Menú consultado exitosamente - 24 registros encontrados'),
(267, NULL, 'READ', 'productos', '2025-06-19 14:32:56', 'Menú consultado exitosamente - 24 registros encontrados'),
(268, NULL, 'READ', 'productos', '2025-06-19 14:33:07', 'Menú consultado exitosamente - 24 registros encontrados'),
(269, NULL, 'READ', 'productos', '2025-06-19 14:33:07', 'Menú consultado exitosamente - 24 registros encontrados'),
(270, NULL, 'READ', 'productos', '2025-06-19 14:33:32', 'Menú consultado exitosamente - 24 registros encontrados'),
(271, NULL, 'READ', 'productos', '2025-06-19 14:33:32', 'Menú consultado exitosamente - 24 registros encontrados'),
(272, NULL, 'READ', 'productos', '2025-06-19 14:34:16', 'Menú consultado exitosamente - 24 registros encontrados'),
(273, NULL, 'READ', 'productos', '2025-06-19 14:34:16', 'Menú consultado exitosamente - 24 registros encontrados'),
(274, NULL, 'READ', 'productos', '2025-06-19 14:34:46', 'Menú consultado exitosamente - 24 registros encontrados'),
(275, NULL, 'READ', 'productos', '2025-06-19 14:34:47', 'Menú consultado exitosamente - 24 registros encontrados'),
(276, NULL, 'READ', 'productos', '2025-06-19 14:34:52', 'Menú consultado exitosamente - 24 registros encontrados'),
(277, NULL, 'READ', 'productos', '2025-06-19 14:34:52', 'Menú consultado exitosamente - 24 registros encontrados'),
(278, NULL, 'READ', 'productos', '2025-06-19 14:35:06', 'Menú consultado exitosamente - 24 registros encontrados'),
(279, NULL, 'READ', 'productos', '2025-06-19 14:35:06', 'Menú consultado exitosamente - 24 registros encontrados'),
(280, NULL, 'READ', 'productos', '2025-06-19 14:35:18', 'Menú consultado exitosamente - 24 registros encontrados'),
(281, NULL, 'READ', 'productos', '2025-06-19 14:35:18', 'Menú consultado exitosamente - 24 registros encontrados'),
(282, NULL, 'READ', 'productos', '2025-06-19 14:35:30', 'Menú consultado exitosamente - 24 registros encontrados'),
(283, NULL, 'READ', 'productos', '2025-06-19 14:35:30', 'Menú consultado exitosamente - 24 registros encontrados'),
(284, NULL, 'READ', 'productos', '2025-06-19 14:35:48', 'Menú consultado exitosamente - 24 registros encontrados'),
(285, NULL, 'READ', 'productos', '2025-06-19 14:35:49', 'Menú consultado exitosamente - 24 registros encontrados'),
(286, NULL, 'READ', 'productos', '2025-06-19 14:36:11', 'Menú consultado exitosamente - 24 registros encontrados'),
(287, NULL, 'READ', 'productos', '2025-06-19 14:36:11', 'Menú consultado exitosamente - 24 registros encontrados'),
(288, NULL, 'READ', 'productos', '2025-06-19 14:37:37', 'Menú consultado exitosamente - 24 registros encontrados'),
(289, NULL, 'READ', 'productos', '2025-06-19 14:37:37', 'Menú consultado exitosamente - 24 registros encontrados'),
(290, NULL, 'READ', 'productos', '2025-06-19 14:39:02', 'Menú consultado exitosamente - 24 registros encontrados'),
(291, NULL, 'READ', 'productos', '2025-06-19 14:39:02', 'Menú consultado exitosamente - 24 registros encontrados'),
(292, NULL, 'READ', 'productos', '2025-06-19 14:39:09', 'Menú consultado exitosamente - 24 registros encontrados'),
(293, NULL, 'READ', 'productos', '2025-06-19 14:39:09', 'Menú consultado exitosamente - 24 registros encontrados'),
(294, NULL, 'READ', 'productos', '2025-06-19 14:39:12', 'Menú consultado exitosamente - 24 registros encontrados'),
(295, NULL, 'READ', 'productos', '2025-06-19 14:39:13', 'Menú consultado exitosamente - 24 registros encontrados'),
(296, NULL, 'READ', 'productos', '2025-06-19 14:40:22', 'Menú consultado exitosamente - 24 registros encontrados'),
(297, NULL, 'READ', 'productos', '2025-06-19 14:40:22', 'Menú consultado exitosamente - 24 registros encontrados'),
(298, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-19 15:01:15', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(299, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-19 15:01:17', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(300, 1, 'LOGIN', 'administradores', '2025-06-19 15:01:21', 'Inicio de sesión exitoso del administrador: Erick Mauricio Tiznado (tiznadoerick3@gmail.com) - Rol: super_admin'),
(301, 1, 'LOGIN', 'administradores', '2025-06-19 15:03:45', 'Inicio de sesión exitoso del administrador: Erick Mauricio Tiznado (tiznadoerick3@gmail.com) - Rol: super_admin'),
(302, NULL, 'READ', 'productos', '2025-06-19 15:13:32', 'Menú consultado exitosamente - 24 registros encontrados'),
(303, NULL, 'READ', 'productos', '2025-06-19 15:13:32', 'Menú consultado exitosamente - 24 registros encontrados'),
(304, NULL, 'READ', 'productos', '2025-06-19 15:14:04', 'Menú consultado exitosamente - 24 registros encontrados'),
(305, NULL, 'READ', 'productos', '2025-06-19 15:14:04', 'Menú consultado exitosamente - 24 registros encontrados'),
(306, 44, 'LOGIN', 'usuarios', '2025-06-19 15:15:59', 'Inicio de sesión exitoso del usuario: José Alexander  (coxin94240@nab4.com)'),
(307, 44, 'LOGIN', 'usuarios', '2025-06-19 15:16:42', 'Inicio de sesión exitoso del usuario: José Alexander (coxin94240@nab4.com)'),
(308, 27, 'LOGIN', 'usuarios', '2025-06-19 15:28:29', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(309, 27, 'LOGIN', 'usuarios', '2025-06-19 15:29:16', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(310, 1, 'LOGIN', 'administradores', '2025-06-19 16:01:35', 'Inicio de sesión exitoso del administrador: Erick Mauricio Tiznado (tiznadoerick3@gmail.com) - Rol: super_admin'),
(311, NULL, 'READ', 'productos', '2025-06-19 16:08:04', 'Menú consultado exitosamente - 24 registros encontrados'),
(312, 27, 'LOGIN', 'usuarios', '2025-06-19 18:43:01', 'Inicio de sesión exitoso del usuario: Jose (alex3@gmail.com)'),
(313, NULL, 'READ', 'productos', '2025-06-19 18:43:04', 'Menú consultado exitosamente - 24 registros encontrados'),
(314, NULL, 'READ', 'productos', '2025-06-19 18:43:04', 'Menú consultado exitosamente - 24 registros encontrados'),
(316, 3, 'LOGIN', 'usuarios', '2025-06-20 20:14:17', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(317, 3, 'LOGIN', 'usuarios', '2025-06-20 20:29:51', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(318, 3, 'LOGIN', 'usuarios', '2025-06-20 20:45:17', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(319, 3, 'LOGIN', 'usuarios', '2025-06-20 20:56:48', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(320, 3, 'LOGIN', 'usuarios', '2025-06-20 20:56:49', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(321, 3, 'LOGIN', 'usuarios', '2025-06-20 20:56:50', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(322, 3, 'LOGIN', 'usuarios', '2025-06-20 20:57:10', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(323, 3, 'LOGIN', 'usuarios', '2025-06-20 21:13:30', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(324, 3, 'LOGIN', 'usuarios', '2025-06-20 21:15:41', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(325, 3, 'LOGIN', 'usuarios', '2025-06-20 21:16:11', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(326, 3, 'LOGIN', 'usuarios', '2025-06-20 21:31:01', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(327, 3, 'LOGIN', 'usuarios', '2025-06-20 21:42:33', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(328, NULL, 'READ', 'productos', '2025-06-21 01:08:51', 'Menú consultado exitosamente - 24 registros encontrados'),
(329, NULL, 'READ', 'productos', '2025-06-21 01:08:51', 'Menú consultado exitosamente - 24 registros encontrados'),
(330, 3, 'LOGIN', 'usuarios', '2025-06-21 17:42:47', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(331, 3, 'LOGIN', 'usuarios', '2025-06-21 17:48:17', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(332, 3, 'LOGIN', 'usuarios', '2025-06-21 17:54:39', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(333, 3, 'LOGIN', 'usuarios', '2025-06-21 18:09:55', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(334, 3, 'LOGIN', 'usuarios', '2025-06-21 20:13:52', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(335, 3, 'LOGIN', 'usuarios', '2025-06-21 20:28:33', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(336, 3, 'LOGIN', 'usuarios', '2025-06-21 21:16:45', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(337, NULL, 'READ', 'productos', '2025-06-21 21:16:46', 'Menú consultado exitosamente - 24 registros encontrados'),
(338, NULL, 'READ', 'productos', '2025-06-21 21:16:46', 'Menú consultado exitosamente - 24 registros encontrados'),
(339, 3, 'LOGIN', 'usuarios', '2025-06-21 21:17:00', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(340, NULL, 'READ', 'productos', '2025-06-21 21:17:02', 'Menú consultado exitosamente - 24 registros encontrados'),
(341, NULL, 'READ', 'productos', '2025-06-21 21:17:02', 'Menú consultado exitosamente - 24 registros encontrados'),
(342, 3, 'LOGIN', 'usuarios', '2025-06-21 21:38:33', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(343, NULL, 'READ', 'productos', '2025-06-21 21:44:13', 'Menú consultado exitosamente - 24 registros encontrados'),
(344, NULL, 'READ', 'productos', '2025-06-21 21:44:13', 'Menú consultado exitosamente - 24 registros encontrados'),
(345, 3, 'LOGIN', 'usuarios', '2025-06-21 21:50:12', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(346, 3, 'LOGIN', 'usuarios', '2025-06-21 21:53:47', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(347, NULL, 'READ', 'productos', '2025-06-21 22:07:44', 'Menú consultado exitosamente - 24 registros encontrados'),
(348, NULL, 'READ', 'productos', '2025-06-21 22:07:44', 'Menú consultado exitosamente - 24 registros encontrados'),
(349, 3, 'LOGIN', 'usuarios', '2025-06-21 22:20:52', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(350, 3, 'LOGIN', 'usuarios', '2025-06-21 22:25:22', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(351, 3, 'LOGIN', 'usuarios', '2025-06-21 22:28:22', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(352, 3, 'LOGIN', 'usuarios', '2025-06-21 22:52:55', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(353, 3, 'LOGIN', 'usuarios', '2025-06-21 22:53:58', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(354, 3, 'LOGIN', 'usuarios', '2025-06-21 22:56:14', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(355, 3, 'LOGIN', 'usuarios', '2025-06-21 22:57:29', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(356, 3, 'LOGIN', 'usuarios', '2025-06-21 23:36:26', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(357, 3, 'LOGIN', 'usuarios', '2025-06-21 23:50:26', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(358, 3, 'LOGIN', 'usuarios', '2025-06-22 00:57:20', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(359, 3, 'LOGIN', 'usuarios', '2025-06-22 01:17:19', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(360, 3, 'LOGIN', 'usuarios', '2025-06-22 01:59:31', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(361, 3, 'LOGIN', 'usuarios', '2025-06-22 02:03:47', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(362, 16, 'LOGIN', 'usuarios', '2025-06-22 02:08:39', 'Inicio de sesión exitoso del usuario: milenas (milu.zelaya02@gmail.com)'),
(363, 3, 'LOGIN', 'usuarios', '2025-06-22 02:14:49', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(364, 3, 'LOGIN', 'usuarios', '2025-06-22 02:39:52', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(365, 3, 'LOGIN', 'usuarios', '2025-06-22 03:09:46', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(366, 3, 'LOGIN', 'usuarios', '2025-06-22 03:15:47', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(367, 3, 'LOGIN', 'usuarios', '2025-06-22 03:48:39', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(368, NULL, 'READ', 'productos', '2025-06-22 07:24:38', 'Menú consultado exitosamente - 24 registros encontrados'),
(369, NULL, 'READ', 'productos', '2025-06-22 07:24:39', 'Menú consultado exitosamente - 24 registros encontrados'),
(370, 25, 'LOGIN', 'usuarios', '2025-06-22 19:48:38', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(371, 3, 'LOGIN', 'usuarios', '2025-06-22 19:55:08', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(372, 3, 'LOGIN', 'usuarios', '2025-06-22 19:58:32', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(373, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-22 20:02:43', 'Intento de inicio de sesión fallido para usuario con correo: tiznadoerick3@gmail.com'),
(374, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-22 20:02:45', 'Intento de inicio de sesión fallido para usuario con correo: tiznadoerick3@gmail.com'),
(375, 12, 'LOGIN', 'usuarios', '2025-06-22 20:02:53', 'Inicio de sesión exitoso del usuario: Erick Mauricio  (tiznadoerick3@gmail.com)'),
(376, 25, 'LOGIN', 'usuarios', '2025-06-22 20:03:00', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(377, NULL, 'READ', 'productos', '2025-06-22 21:36:12', 'Menú consultado exitosamente - 24 registros encontrados'),
(378, NULL, 'READ', 'productos', '2025-06-22 21:36:12', 'Menú consultado exitosamente - 24 registros encontrados'),
(379, 3, 'LOGIN', 'usuarios', '2025-06-22 22:09:38', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(380, 3, 'LOGIN', 'usuarios', '2025-06-22 22:16:16', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(381, 3, 'LOGIN', 'usuarios', '2025-06-22 22:18:50', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(382, NULL, 'READ', 'productos', '2025-06-23 01:00:46', 'Menú consultado exitosamente - 24 registros encontrados'),
(383, NULL, 'CREATE', 'productos', '2025-06-23 01:01:13', 'Producto creado: \"Pruba\" (ID: 14) en categoría \"pizza\" con 4 precios configurados'),
(384, NULL, 'READ', 'productos', '2025-06-23 01:01:13', 'Menú consultado exitosamente - 28 registros encontrados'),
(385, 3, 'LOGIN', 'usuarios', '2025-06-23 17:35:33', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(386, NULL, 'READ', 'productos', '2025-06-23 17:48:01', 'Menú consultado exitosamente - 28 registros encontrados'),
(387, NULL, 'DELETE', 'productos', '2025-06-23 17:48:07', 'Producto eliminado (ID: 14) junto con 4 precios asociados'),
(388, 3, 'LOGIN', 'usuarios', '2025-06-23 18:04:44', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(389, NULL, 'READ', 'productos', '2025-06-23 18:04:46', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(390, NULL, 'READ', 'productos', '2025-06-23 18:04:46', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(391, NULL, 'READ', 'productos', '2025-06-23 18:04:47', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(392, NULL, 'READ', 'productos', '2025-06-23 18:04:47', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(393, 3, 'LOGIN', 'usuarios', '2025-06-23 18:07:05', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(394, NULL, 'READ', 'productos', '2025-06-23 18:07:07', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(395, NULL, 'READ', 'productos', '2025-06-23 18:07:07', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(396, NULL, 'READ', 'productos', '2025-06-23 18:07:08', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(397, NULL, 'READ', 'productos', '2025-06-23 18:07:08', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(398, 3, 'LOGIN', 'usuarios', '2025-06-23 18:25:07', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)');
INSERT INTO `logs` (`id_log`, `id_usuario`, `accion`, `tabla_afectada`, `fecha_hora`, `descripcion`) VALUES
(399, NULL, 'READ', 'productos', '2025-06-23 18:25:09', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(400, NULL, 'READ', 'productos', '2025-06-23 18:25:09', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(401, NULL, 'READ', 'productos', '2025-06-23 18:25:10', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(402, NULL, 'READ', 'productos', '2025-06-23 18:25:10', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(403, 3, 'LOGIN', 'usuarios', '2025-06-23 18:53:23', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(404, NULL, 'READ', 'productos', '2025-06-23 18:53:24', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(405, NULL, 'READ', 'productos', '2025-06-23 18:53:24', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(406, NULL, 'READ', 'productos', '2025-06-23 18:53:24', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(407, NULL, 'READ', 'productos', '2025-06-23 18:53:24', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(408, NULL, 'READ', 'productos', '2025-06-23 18:59:52', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(409, NULL, 'READ', 'productos', '2025-06-23 18:59:52', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(410, NULL, 'READ', 'productos', '2025-06-23 18:59:52', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(411, NULL, 'READ', 'productos', '2025-06-23 18:59:52', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(412, 3, 'LOGIN', 'usuarios', '2025-06-23 18:59:58', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(413, NULL, 'READ', 'productos', '2025-06-23 18:59:59', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(414, NULL, 'READ', 'productos', '2025-06-23 18:59:59', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(415, NULL, 'READ', 'productos', '2025-06-23 18:59:59', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(416, NULL, 'READ', 'productos', '2025-06-23 18:59:59', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(417, NULL, 'READ', 'productos', '2025-06-23 19:02:58', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(418, NULL, 'READ', 'productos', '2025-06-23 19:02:58', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(419, NULL, 'READ', 'productos', '2025-06-23 19:02:58', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(420, NULL, 'READ', 'productos', '2025-06-23 19:02:58', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(421, NULL, 'READ', 'productos', '2025-06-23 19:03:30', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(422, NULL, 'READ', 'productos', '2025-06-23 19:03:30', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(423, NULL, 'READ', 'productos', '2025-06-23 19:03:30', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(424, NULL, 'READ', 'productos', '2025-06-23 19:03:30', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(425, NULL, 'READ', 'productos', '2025-06-23 19:10:16', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(426, NULL, 'READ', 'productos', '2025-06-23 19:10:16', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(427, NULL, 'READ', 'productos', '2025-06-23 19:10:16', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(428, NULL, 'READ', 'productos', '2025-06-23 19:10:16', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(429, NULL, 'READ', 'productos', '2025-06-23 19:10:30', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(430, NULL, 'READ', 'productos', '2025-06-23 19:10:30', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(431, NULL, 'READ', 'productos', '2025-06-23 19:10:30', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(432, NULL, 'READ', 'productos', '2025-06-23 19:10:30', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(433, NULL, 'READ', 'productos', '2025-06-23 19:12:37', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(434, NULL, 'READ', 'productos', '2025-06-23 19:12:37', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(435, NULL, 'READ', 'productos', '2025-06-23 19:12:37', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(436, NULL, 'READ', 'productos', '2025-06-23 19:12:37', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(437, NULL, 'READ', 'productos', '2025-06-23 19:22:19', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(438, NULL, 'READ', 'productos', '2025-06-23 19:22:19', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(439, NULL, 'READ', 'productos', '2025-06-23 19:22:20', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(440, NULL, 'READ', 'productos', '2025-06-23 19:22:21', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(441, NULL, 'READ', 'productos', '2025-06-23 19:22:47', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(442, NULL, 'READ', 'productos', '2025-06-23 19:22:47', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(443, NULL, 'READ', 'productos', '2025-06-23 19:22:48', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(444, NULL, 'READ', 'productos', '2025-06-23 19:22:49', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(445, NULL, 'READ', 'productos', '2025-06-23 19:22:50', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(446, NULL, 'READ', 'productos', '2025-06-23 19:22:50', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(447, NULL, 'READ', 'productos', '2025-06-23 19:22:50', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(448, NULL, 'READ', 'productos', '2025-06-23 19:22:51', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(449, NULL, 'READ', 'productos', '2025-06-23 19:28:46', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(450, NULL, 'READ', 'productos', '2025-06-23 19:28:47', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(451, NULL, 'READ', 'productos', '2025-06-23 19:28:48', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(452, NULL, 'READ', 'productos', '2025-06-23 19:28:48', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(453, 3, 'LOGIN', 'usuarios', '2025-06-23 19:30:48', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(454, NULL, 'READ', 'productos', '2025-06-23 19:30:49', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(455, NULL, 'READ', 'productos', '2025-06-23 19:30:49', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(456, NULL, 'READ', 'productos', '2025-06-23 19:30:49', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(457, NULL, 'READ', 'productos', '2025-06-23 19:30:49', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(458, NULL, 'READ', 'productos', '2025-06-23 19:32:07', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(459, NULL, 'READ', 'productos', '2025-06-23 19:32:07', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(460, NULL, 'READ', 'productos', '2025-06-23 19:32:08', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(461, NULL, 'READ', 'productos', '2025-06-23 19:32:08', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(462, NULL, 'READ', 'productos', '2025-06-23 20:15:38', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(463, NULL, 'READ', 'productos', '2025-06-23 20:15:38', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(464, NULL, 'READ', 'productos', '2025-06-23 20:15:38', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(465, NULL, 'READ', 'productos', '2025-06-23 20:15:38', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(466, NULL, 'READ', 'productos', '2025-06-23 20:15:39', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(467, NULL, 'READ', 'productos', '2025-06-23 20:15:39', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(468, NULL, 'READ', 'productos', '2025-06-23 20:15:40', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(469, NULL, 'READ', 'productos', '2025-06-23 20:15:40', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(470, 3, 'LOGIN', 'usuarios', '2025-06-23 20:25:07', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(471, NULL, 'READ', 'productos', '2025-06-23 20:25:09', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(472, NULL, 'READ', 'productos', '2025-06-23 20:25:09', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(473, NULL, 'READ', 'productos', '2025-06-23 20:25:10', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(474, NULL, 'READ', 'productos', '2025-06-23 20:25:10', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(475, NULL, 'READ', 'productos', '2025-06-23 20:28:36', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(476, NULL, 'READ', 'productos', '2025-06-23 20:28:36', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(477, NULL, 'READ', 'productos', '2025-06-23 20:28:37', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(478, NULL, 'READ', 'productos', '2025-06-23 20:28:37', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(479, 3, 'LOGIN', 'usuarios', '2025-06-23 20:37:50', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(480, NULL, 'READ', 'productos', '2025-06-23 20:37:53', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(481, NULL, 'READ', 'productos', '2025-06-23 20:37:53', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(482, NULL, 'READ', 'productos', '2025-06-23 20:37:53', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(483, NULL, 'READ', 'productos', '2025-06-23 20:37:53', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(484, NULL, 'READ', 'productos', '2025-06-23 20:38:14', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(485, NULL, 'READ', 'productos', '2025-06-23 20:38:14', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(486, NULL, 'READ', 'productos', '2025-06-23 20:38:15', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(487, NULL, 'READ', 'productos', '2025-06-23 20:38:15', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(488, NULL, 'READ', 'productos', '2025-06-23 20:43:02', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(489, NULL, 'READ', 'productos', '2025-06-23 20:43:02', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(490, NULL, 'READ', 'productos', '2025-06-23 20:43:02', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(491, NULL, 'READ', 'productos', '2025-06-23 20:43:02', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(492, NULL, 'READ', 'productos', '2025-06-23 20:45:29', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(493, NULL, 'READ', 'productos', '2025-06-23 20:45:29', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(494, NULL, 'READ', 'productos', '2025-06-23 20:45:30', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(495, NULL, 'READ', 'productos', '2025-06-23 20:45:30', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(496, NULL, 'READ', 'productos', '2025-06-23 20:52:19', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(497, NULL, 'READ', 'productos', '2025-06-23 20:52:19', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(498, NULL, 'READ', 'productos', '2025-06-23 20:52:19', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(499, NULL, 'READ', 'productos', '2025-06-23 20:52:19', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(500, NULL, 'READ', 'productos', '2025-06-23 20:52:28', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(501, NULL, 'READ', 'productos', '2025-06-23 20:52:28', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(502, NULL, 'READ', 'productos', '2025-06-23 20:52:29', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(503, NULL, 'READ', 'productos', '2025-06-23 20:52:29', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(504, NULL, 'READ', 'productos', '2025-06-23 20:52:36', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(505, NULL, 'READ', 'productos', '2025-06-23 20:52:36', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(506, NULL, 'READ', 'productos', '2025-06-23 20:52:36', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(507, NULL, 'READ', 'productos', '2025-06-23 20:52:36', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(508, NULL, 'READ', 'productos', '2025-06-23 20:52:51', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(509, NULL, 'READ', 'productos', '2025-06-23 20:52:51', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(510, NULL, 'READ', 'productos', '2025-06-23 20:52:51', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(511, NULL, 'READ', 'productos', '2025-06-23 20:52:51', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(512, NULL, 'READ', 'productos', '2025-06-23 20:55:32', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(513, NULL, 'READ', 'productos', '2025-06-23 20:55:32', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(514, NULL, 'READ', 'productos', '2025-06-23 20:55:32', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(515, NULL, 'READ', 'productos', '2025-06-23 20:55:32', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(516, NULL, 'READ', 'productos', '2025-06-23 21:01:59', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(517, NULL, 'READ', 'productos', '2025-06-23 21:01:59', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(518, NULL, 'READ', 'productos', '2025-06-23 21:02:00', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(519, NULL, 'READ', 'productos', '2025-06-23 21:02:00', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(520, NULL, 'READ', 'productos', '2025-06-23 21:02:17', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(521, NULL, 'READ', 'productos', '2025-06-23 21:02:17', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(522, NULL, 'READ', 'productos', '2025-06-23 21:02:18', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(523, NULL, 'READ', 'productos', '2025-06-23 21:02:18', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(524, NULL, 'READ', 'productos', '2025-06-23 21:02:31', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(525, NULL, 'READ', 'productos', '2025-06-23 21:02:31', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(526, NULL, 'READ', 'productos', '2025-06-23 21:02:31', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(527, NULL, 'READ', 'productos', '2025-06-23 21:02:31', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(528, NULL, 'READ', 'productos', '2025-06-23 21:02:34', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(529, NULL, 'READ', 'productos', '2025-06-23 21:02:34', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(530, NULL, 'READ', 'productos', '2025-06-23 21:02:34', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(531, NULL, 'READ', 'productos', '2025-06-23 21:02:34', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(532, NULL, 'READ', 'productos', '2025-06-23 21:03:26', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(533, NULL, 'READ', 'productos', '2025-06-23 21:03:26', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(534, NULL, 'READ', 'productos', '2025-06-23 21:03:26', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(535, NULL, 'READ', 'productos', '2025-06-23 21:03:26', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(536, NULL, 'READ', 'productos', '2025-06-23 21:03:58', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(537, NULL, 'READ', 'productos', '2025-06-23 21:03:58', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(538, NULL, 'READ', 'productos', '2025-06-23 21:03:58', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(539, NULL, 'READ', 'productos', '2025-06-23 21:03:58', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(540, NULL, 'READ', 'productos', '2025-06-23 21:04:02', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(541, NULL, 'READ', 'productos', '2025-06-23 21:04:02', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(542, NULL, 'READ', 'productos', '2025-06-23 21:04:02', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(543, NULL, 'READ', 'productos', '2025-06-23 21:04:02', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(544, NULL, 'READ', 'productos', '2025-06-23 21:04:08', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(545, NULL, 'READ', 'productos', '2025-06-23 21:04:08', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(546, NULL, 'READ', 'productos', '2025-06-23 21:04:08', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(547, NULL, 'READ', 'productos', '2025-06-23 21:04:08', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(548, NULL, 'READ', 'productos', '2025-06-23 21:04:20', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(549, NULL, 'READ', 'productos', '2025-06-23 21:04:20', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(550, NULL, 'READ', 'productos', '2025-06-23 21:04:20', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(551, NULL, 'READ', 'productos', '2025-06-23 21:04:20', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(552, NULL, 'READ', 'productos', '2025-06-23 21:06:27', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(553, NULL, 'READ', 'productos', '2025-06-23 21:06:27', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(554, NULL, 'READ', 'productos', '2025-06-23 21:06:27', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(555, NULL, 'READ', 'productos', '2025-06-23 21:06:27', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(556, NULL, 'READ', 'productos', '2025-06-23 21:06:41', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(557, NULL, 'READ', 'productos', '2025-06-23 21:06:41', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(558, NULL, 'READ', 'productos', '2025-06-23 21:06:41', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(559, NULL, 'READ', 'productos', '2025-06-23 21:06:41', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(560, 3, 'LOGIN', 'usuarios', '2025-06-23 21:09:52', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(561, NULL, 'READ', 'productos', '2025-06-23 21:09:54', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(562, NULL, 'READ', 'productos', '2025-06-23 21:09:54', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(563, NULL, 'READ', 'productos', '2025-06-23 21:09:54', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(564, NULL, 'READ', 'productos', '2025-06-23 21:09:54', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(565, NULL, 'READ', 'productos', '2025-06-23 21:10:59', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(566, NULL, 'READ', 'productos', '2025-06-23 21:10:59', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(567, NULL, 'READ', 'productos', '2025-06-23 21:10:59', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(568, NULL, 'READ', 'productos', '2025-06-23 21:10:59', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(569, 3, 'LOGIN', 'usuarios', '2025-06-23 21:11:05', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(570, NULL, 'READ', 'productos', '2025-06-23 21:11:06', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(571, NULL, 'READ', 'productos', '2025-06-23 21:11:06', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(572, NULL, 'READ', 'productos', '2025-06-23 21:11:06', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(573, NULL, 'READ', 'productos', '2025-06-23 21:11:06', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(574, NULL, 'READ', 'productos', '2025-06-23 21:12:59', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(575, NULL, 'READ', 'productos', '2025-06-23 21:12:59', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(576, NULL, 'READ', 'productos', '2025-06-23 21:12:59', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(577, NULL, 'READ', 'productos', '2025-06-23 21:12:59', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(578, NULL, 'READ', 'productos', '2025-06-23 21:13:43', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(579, NULL, 'READ', 'productos', '2025-06-23 21:13:43', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(580, NULL, 'READ', 'productos', '2025-06-23 21:13:43', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(581, NULL, 'READ', 'productos', '2025-06-23 21:13:43', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(582, NULL, 'READ', 'productos', '2025-06-23 21:13:58', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(583, NULL, 'READ', 'productos', '2025-06-23 21:13:58', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(584, NULL, 'READ', 'productos', '2025-06-23 21:13:58', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(585, NULL, 'READ', 'productos', '2025-06-23 21:13:58', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(586, 3, 'LOGIN', 'usuarios', '2025-06-23 21:14:05', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(587, NULL, 'READ', 'productos', '2025-06-23 21:14:06', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(588, NULL, 'READ', 'productos', '2025-06-23 21:14:06', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(589, NULL, 'READ', 'productos', '2025-06-23 21:14:07', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(590, NULL, 'READ', 'productos', '2025-06-23 21:14:07', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(591, NULL, 'READ', 'productos', '2025-06-23 21:15:04', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(592, NULL, 'READ', 'productos', '2025-06-23 21:15:04', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(593, NULL, 'READ', 'productos', '2025-06-23 21:15:04', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(594, NULL, 'READ', 'productos', '2025-06-23 21:15:04', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(595, 25, 'LOGIN', 'usuarios', '2025-06-23 21:15:07', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(596, NULL, 'READ', 'productos', '2025-06-23 21:15:09', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(597, NULL, 'READ', 'productos', '2025-06-23 21:15:09', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(598, NULL, 'READ', 'productos', '2025-06-23 21:15:09', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(599, NULL, 'READ', 'productos', '2025-06-23 21:15:09', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(600, 25, 'LOGIN', 'usuarios', '2025-06-23 21:15:15', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(601, NULL, 'READ', 'productos', '2025-06-23 21:15:17', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(602, NULL, 'READ', 'productos', '2025-06-23 21:15:17', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(603, NULL, 'READ', 'productos', '2025-06-23 21:15:17', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(604, NULL, 'READ', 'productos', '2025-06-23 21:15:17', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(605, NULL, 'READ', 'productos', '2025-06-23 21:18:07', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(606, NULL, 'READ', 'productos', '2025-06-23 21:18:07', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(607, NULL, 'READ', 'productos', '2025-06-23 21:18:07', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(608, NULL, 'READ', 'productos', '2025-06-23 21:18:07', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(609, NULL, 'READ', 'productos', '2025-06-23 21:18:29', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(610, NULL, 'READ', 'productos', '2025-06-23 21:18:29', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(611, NULL, 'READ', 'productos', '2025-06-23 21:18:29', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(612, NULL, 'READ', 'productos', '2025-06-23 21:18:29', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(613, 25, 'LOGIN', 'usuarios', '2025-06-23 21:22:05', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(614, NULL, 'READ', 'productos', '2025-06-23 21:22:06', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(615, NULL, 'READ', 'productos', '2025-06-23 21:22:06', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(616, NULL, 'READ', 'productos', '2025-06-23 21:22:06', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(617, NULL, 'READ', 'productos', '2025-06-23 21:22:06', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(618, NULL, 'READ', 'productos', '2025-06-23 21:22:18', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(619, NULL, 'READ', 'productos', '2025-06-23 21:22:18', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(620, NULL, 'READ', 'productos', '2025-06-23 21:22:18', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(621, NULL, 'READ', 'productos', '2025-06-23 21:22:18', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(622, 25, 'LOGIN', 'usuarios', '2025-06-23 21:22:25', 'Inicio de sesión exitoso del usuario: Mauricio (tiznadoerick53@gmail.com)'),
(623, NULL, 'READ', 'productos', '2025-06-23 21:22:26', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(624, NULL, 'READ', 'productos', '2025-06-23 21:22:26', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(625, NULL, 'READ', 'productos', '2025-06-23 21:22:27', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(626, NULL, 'READ', 'productos', '2025-06-23 21:22:27', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(627, NULL, 'READ', 'productos', '2025-06-23 21:22:42', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(628, NULL, 'READ', 'productos', '2025-06-23 21:22:42', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(629, NULL, 'READ', 'productos', '2025-06-23 21:22:42', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(630, NULL, 'READ', 'productos', '2025-06-23 21:22:42', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(631, 3, 'LOGIN', 'usuarios', '2025-06-23 21:23:02', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(632, NULL, 'READ', 'productos', '2025-06-23 21:23:04', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(633, NULL, 'READ', 'productos', '2025-06-23 21:23:04', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(634, NULL, 'READ', 'productos', '2025-06-23 21:23:04', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(635, NULL, 'READ', 'productos', '2025-06-23 21:23:04', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(636, NULL, 'READ', 'productos', '2025-06-23 21:32:14', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(637, NULL, 'READ', 'productos', '2025-06-23 21:32:14', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(638, NULL, 'READ', 'productos', '2025-06-23 21:32:14', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(639, NULL, 'READ', 'productos', '2025-06-23 21:32:14', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(640, 3, 'LOGIN', 'usuarios', '2025-06-23 21:32:20', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(641, NULL, 'READ', 'productos', '2025-06-23 21:32:21', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(642, NULL, 'READ', 'productos', '2025-06-23 21:32:21', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(643, NULL, 'READ', 'productos', '2025-06-23 21:32:21', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(644, NULL, 'READ', 'productos', '2025-06-23 21:32:21', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(645, 3, 'LOGIN', 'usuarios', '2025-06-23 21:36:27', 'Inicio de sesión exitoso del usuario: nathaly milenas (nathy.zelaya5@gmail.com)'),
(646, NULL, 'READ', 'productos', '2025-06-23 21:36:29', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(647, NULL, 'READ', 'productos', '2025-06-23 21:36:29', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(648, NULL, 'READ', 'productos', '2025-06-23 21:36:29', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(649, NULL, 'READ', 'productos', '2025-06-23 21:36:29', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(650, NULL, 'READ', 'productos', '2025-06-23 21:47:08', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(651, NULL, 'READ', 'productos', '2025-06-23 21:47:08', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(652, NULL, 'READ', 'productos', '2025-06-23 21:47:08', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(653, NULL, 'READ', 'productos', '2025-06-23 21:47:08', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(654, NULL, 'READ', 'productos', '2025-06-23 21:47:36', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(655, NULL, 'READ', 'productos', '2025-06-23 21:47:36', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(656, NULL, 'READ', 'productos', '2025-06-23 21:47:37', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(657, NULL, 'READ', 'productos', '2025-06-23 21:47:37', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(658, NULL, 'LOGIN_FAILED', 'usuarios', '2025-06-23 21:47:58', 'Intento de inicio de sesión fallido para usuario con correo: alex33@gmail.com'),
(659, 46, 'LOGIN', 'usuarios', '2025-06-23 21:48:11', 'Inicio de sesión exitoso del usuario: Jose (alex33@gmail.com)'),
(660, NULL, 'READ', 'productos', '2025-06-23 21:48:13', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(661, NULL, 'READ', 'productos', '2025-06-23 21:48:13', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(662, NULL, 'READ', 'productos', '2025-06-23 21:48:13', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(663, NULL, 'READ', 'productos', '2025-06-23 21:48:13', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(664, NULL, 'READ', 'productos', '2025-06-23 21:48:16', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(665, NULL, 'READ', 'productos', '2025-06-23 21:48:16', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(666, NULL, 'READ', 'productos', '2025-06-23 21:48:17', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(667, NULL, 'READ', 'productos', '2025-06-23 21:48:17', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(668, 46, 'LOGIN', 'usuarios', '2025-06-23 21:49:04', 'Inicio de sesión exitoso del usuario: Jose (alex33@gmail.com)'),
(669, NULL, 'READ', 'productos', '2025-06-23 21:49:06', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(670, NULL, 'READ', 'productos', '2025-06-23 21:49:06', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(671, NULL, 'READ', 'productos', '2025-06-23 21:49:06', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(672, NULL, 'READ', 'productos', '2025-06-23 21:49:06', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(673, NULL, 'READ', 'productos', '2025-06-23 21:49:29', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(674, NULL, 'READ', 'productos', '2025-06-23 21:49:29', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(675, NULL, 'READ', 'productos', '2025-06-23 21:49:29', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(676, NULL, 'READ', 'productos', '2025-06-23 21:49:29', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(677, 46, 'LOGIN', 'usuarios', '2025-06-23 21:58:25', 'Inicio de sesión exitoso del usuario: Alex2 (alex33@gmail.com)'),
(678, NULL, 'READ', 'productos', '2025-06-23 21:58:27', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(679, NULL, 'READ', 'productos', '2025-06-23 21:58:27', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(680, NULL, 'READ', 'productos', '2025-06-23 21:58:27', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(681, NULL, 'READ', 'productos', '2025-06-23 21:58:27', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(682, NULL, 'READ', 'productos', '2025-06-23 21:59:06', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(683, NULL, 'READ', 'productos', '2025-06-23 21:59:06', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(684, NULL, 'READ', 'productos', '2025-06-23 21:59:06', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(685, NULL, 'READ', 'productos', '2025-06-23 21:59:06', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(686, NULL, 'READ', 'productos', '2025-06-23 22:04:02', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(687, NULL, 'READ', 'productos', '2025-06-23 22:04:02', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(688, NULL, 'READ', 'productos', '2025-06-23 22:04:02', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(689, NULL, 'READ', 'productos', '2025-06-23 22:04:02', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(690, NULL, 'READ', 'productos', '2025-06-23 22:12:57', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(691, NULL, 'READ', 'productos', '2025-06-23 22:12:57', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(692, NULL, 'READ', 'productos', '2025-06-23 22:12:57', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(693, NULL, 'READ', 'productos', '2025-06-23 22:12:57', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(694, NULL, 'READ', 'productos', '2025-06-23 22:18:28', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(695, NULL, 'READ', 'productos', '2025-06-23 22:18:28', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(696, NULL, 'READ', 'productos', '2025-06-23 22:18:28', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(697, NULL, 'READ', 'productos', '2025-06-23 22:18:28', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(698, NULL, 'READ', 'productos', '2025-06-23 22:23:55', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(699, NULL, 'READ', 'productos', '2025-06-23 22:23:55', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(700, NULL, 'READ', 'productos', '2025-06-23 22:23:56', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(701, NULL, 'READ', 'productos', '2025-06-23 22:23:56', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(702, NULL, 'READ', 'productos', '2025-06-23 22:28:57', 'Menú consultado exitosamente - 24 registros encontrados'),
(703, NULL, 'READ', 'productos', '2025-06-23 22:29:37', 'Menú consultado exitosamente - 24 registros encontrados'),
(704, NULL, 'READ', 'productos', '2025-06-23 22:29:37', 'Menú consultado exitosamente - 24 registros encontrados'),
(705, 3, 'LOGIN', 'usuarios', '2025-06-23 22:43:28', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(706, NULL, 'READ', 'productos', '2025-06-23 22:43:29', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(707, NULL, 'READ', 'productos', '2025-06-23 22:43:29', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(708, NULL, 'READ', 'productos', '2025-06-23 22:43:30', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(709, NULL, 'READ', 'productos', '2025-06-23 22:43:30', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(710, 3, 'LOGIN', 'usuarios', '2025-06-23 22:43:43', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(711, NULL, 'READ', 'productos', '2025-06-23 22:43:44', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(712, NULL, 'READ', 'productos', '2025-06-23 22:43:44', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(713, NULL, 'READ', 'productos', '2025-06-23 22:43:44', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(714, NULL, 'READ', 'productos', '2025-06-23 22:43:44', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(715, 3, 'LOGIN', 'usuarios', '2025-06-23 22:45:04', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(716, NULL, 'READ', 'productos', '2025-06-23 22:45:06', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(717, NULL, 'READ', 'productos', '2025-06-23 22:45:06', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(718, NULL, 'READ', 'productos', '2025-06-23 22:45:06', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(719, NULL, 'READ', 'productos', '2025-06-23 22:45:06', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(720, 3, 'LOGIN', 'usuarios', '2025-06-23 22:45:56', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(721, NULL, 'READ', 'productos', '2025-06-23 22:45:58', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(722, NULL, 'READ', 'productos', '2025-06-23 22:45:58', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(723, NULL, 'READ', 'productos', '2025-06-23 22:45:58', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(724, NULL, 'READ', 'productos', '2025-06-23 22:45:58', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(725, 3, 'LOGIN', 'usuarios', '2025-06-23 22:46:24', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(726, NULL, 'READ', 'productos', '2025-06-23 22:46:26', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(727, NULL, 'READ', 'productos', '2025-06-23 22:46:26', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(728, NULL, 'READ', 'productos', '2025-06-23 22:46:26', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(729, NULL, 'READ', 'productos', '2025-06-23 22:46:26', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(730, 3, 'LOGIN', 'usuarios', '2025-06-23 22:47:36', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(731, NULL, 'READ', 'productos', '2025-06-23 22:47:38', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(732, NULL, 'READ', 'productos', '2025-06-23 22:47:38', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(733, NULL, 'READ', 'productos', '2025-06-23 22:47:38', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(734, NULL, 'READ', 'productos', '2025-06-23 22:47:38', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(735, NULL, 'READ', 'productos', '2025-06-23 22:47:43', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(736, NULL, 'READ', 'productos', '2025-06-23 22:47:43', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(737, NULL, 'READ', 'productos', '2025-06-23 22:47:43', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(738, NULL, 'READ', 'productos', '2025-06-23 22:47:43', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(739, 3, 'LOGIN', 'usuarios', '2025-06-23 22:47:52', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(740, NULL, 'READ', 'productos', '2025-06-23 22:47:54', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(741, NULL, 'READ', 'productos', '2025-06-23 22:47:54', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(742, NULL, 'READ', 'productos', '2025-06-23 22:47:54', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(743, NULL, 'READ', 'productos', '2025-06-23 22:47:54', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(744, NULL, 'READ', 'productos', '2025-06-23 22:48:53', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(745, NULL, 'READ', 'productos', '2025-06-23 22:48:53', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(746, NULL, 'READ', 'productos', '2025-06-23 22:48:53', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(747, NULL, 'READ', 'productos', '2025-06-23 22:48:53', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(748, 3, 'LOGIN', 'usuarios', '2025-06-23 22:48:57', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(749, NULL, 'READ', 'productos', '2025-06-23 22:48:59', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(750, NULL, 'READ', 'productos', '2025-06-23 22:48:59', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(751, NULL, 'READ', 'productos', '2025-06-23 22:48:59', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(752, NULL, 'READ', 'productos', '2025-06-23 22:48:59', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(753, 3, 'LOGIN', 'usuarios', '2025-06-23 22:53:20', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(754, NULL, 'READ', 'productos', '2025-06-23 22:53:22', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(755, NULL, 'READ', 'productos', '2025-06-23 22:53:22', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(756, NULL, 'READ', 'productos', '2025-06-23 22:53:22', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(757, NULL, 'READ', 'productos', '2025-06-23 22:53:22', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(758, 3, 'LOGIN', 'usuarios', '2025-06-23 23:02:22', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(759, NULL, 'READ', 'productos', '2025-06-23 23:02:24', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(760, NULL, 'READ', 'productos', '2025-06-23 23:02:24', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(761, NULL, 'READ', 'productos', '2025-06-23 23:02:24', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(762, NULL, 'READ', 'productos', '2025-06-23 23:02:24', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(763, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-23 23:18:28', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(764, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-23 23:18:31', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(765, 3, 'LOGIN', 'usuarios', '2025-06-23 23:19:24', 'Inicio de sesión exitoso del usuario: nathaly milena (nathy.zelaya5@gmail.com)'),
(766, NULL, 'READ', 'productos', '2025-06-23 23:19:25', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(767, NULL, 'READ', 'productos', '2025-06-23 23:19:25', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(768, NULL, 'READ', 'productos', '2025-06-23 23:19:25', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(769, NULL, 'READ', 'productos', '2025-06-23 23:19:25', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados');
INSERT INTO `logs` (`id_log`, `id_usuario`, `accion`, `tabla_afectada`, `fecha_hora`, `descripcion`) VALUES
(770, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-23 23:28:19', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(771, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-23 23:28:44', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(772, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-23 23:42:41', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(773, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-24 00:22:22', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(774, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-24 00:22:38', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(775, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-24 00:23:41', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(776, NULL, 'LOGIN_FAILED', 'administradores', '2025-06-24 00:23:57', 'Intento de inicio de sesión fallido para administrador con correo: tiznadoerick3@gmail.com'),
(777, NULL, 'READ', 'productos', '2025-06-24 01:01:51', 'Menú consultado exitosamente - 24 registros encontrados'),
(778, NULL, 'READ', 'productos', '2025-06-24 01:03:03', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(779, NULL, 'READ', 'productos', '2025-06-24 01:03:04', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(780, NULL, 'READ', 'productos', '2025-06-24 01:03:04', 'Productos más populares consultados exitosamente - 3 productos encontrados'),
(781, NULL, 'READ', 'productos', '2025-06-24 01:03:04', 'Recomendaciones de la casa consultadas exitosamente - 3 productos encontrados'),
(782, 4, 'ADMIN_LOGIN', 'administradores', '2025-06-24 01:12:18', 'Login exitoso para administrador: Erick Tiznado (tiznadoerick3@gmail.com)');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodos_pago`
--

CREATE TABLE `metodos_pago` (
  `id_metodo_pago` int NOT NULL,
  `id_usuario` int NOT NULL,
  `tipo_pago` varchar(50) NOT NULL,
  `datos_pago` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_inventario`
--

CREATE TABLE `movimientos_inventario` (
  `id_movimiento` int NOT NULL,
  `id_ingrediente` int NOT NULL,
  `tipo_movimiento` enum('entrada','salida') NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `fecha_movimiento` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `motivo` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `fecha_emision` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('leida','no leida') NOT NULL DEFAULT 'no leida'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id_notificacion`, `titulo`, `mensaje`, `tipo`, `fecha_emision`, `estado`) VALUES
(1, 'Nuevo Pedido', 'Pedido AQAOWA3X por $6.78', 'pedido', '2025-06-14 03:23:47', 'no leida'),
(2, 'Nuevo Pedido', 'Pedido 79042Z29 por $4.52', 'pedido', '2025-06-14 04:57:38', 'no leida'),
(3, 'Nuevo Pedido', 'Pedido 7YXBOGNT por $4.52', 'pedido', '2025-06-14 05:02:47', 'no leida'),
(4, 'Nuevo Pedido', 'Pedido HQY73VMK por $4.52', 'pedido', '2025-06-14 05:46:11', 'no leida'),
(5, 'Nuevo Pedido', 'Pedido DCO8HO66 por $4.52', 'pedido', '2025-06-14 05:50:54', 'no leida'),
(6, 'Nuevo Pedido', 'Pedido WAP2WKAN por $13.56', 'pedido', '2025-06-14 20:16:02', 'no leida'),
(7, 'Nuevo Pedido', 'Pedido K6BH2IDQ por $13.56', 'pedido', '2025-06-14 20:17:38', 'no leida'),
(8, 'Nuevo Pedido', 'Pedido JSEEVCSE por $13.56', 'pedido', '2025-06-14 20:21:24', 'no leida'),
(9, 'Estado de pedido actualizado', 'Pedido #9WWWEAQ9 ahora está: en proceso', 'success', '2025-06-16 04:28:52', 'no leida'),
(10, 'Estado de pedido actualizado', 'Pedido #9WWWEAQ9 ahora está: en proceso', 'success', '2025-06-16 04:29:01', 'no leida'),
(11, 'Estado de pedido actualizado', 'Pedido #9WWWEAQ9 ahora está: en proceso', 'success', '2025-06-16 04:29:06', 'no leida'),
(12, 'Estado de pedido actualizado', 'Pedido #9WWWEAQ9 ahora está: en proceso', 'success', '2025-06-16 04:29:20', 'no leida'),
(13, 'Estado de pedido actualizado', 'Pedido #9WWWEAQ9 ahora está: en proceso', 'success', '2025-06-16 04:33:01', 'no leida'),
(14, 'Estado de pedido actualizado', 'Pedido #9WWWEAQ9 ahora está: en camino', 'success', '2025-06-16 04:35:26', 'no leida'),
(15, 'Estado de pedido actualizado', 'Pedido #9WWWEAQ9 ahora está: Entregado', 'success', '2025-06-16 04:35:30', 'no leida'),
(16, 'Estado de pedido actualizado', 'Pedido #RN42H92D ahora está: en proceso', 'success', '2025-06-16 04:43:59', 'no leida'),
(17, 'Estado de pedido actualizado', 'Pedido #RN42H92D ahora está: en camino', 'success', '2025-06-16 04:44:14', 'no leida'),
(18, 'Estado de pedido actualizado', 'Pedido #JSEEVCSE ahora está: en proceso', 'success', '2025-06-16 04:46:54', 'no leida'),
(19, 'Nuevo Pedido', 'Pedido G7AW9Q18 por $4.52', 'pedido', '2025-06-16 16:31:19', 'no leida'),
(20, 'Nuevo Pedido', 'Pedido 3L4LN329 por $4.52', 'pedido', '2025-06-16 16:31:19', 'no leida'),
(21, 'Nuevo Pedido', 'Pedido AE4ZC6RH por $4.52', 'pedido', '2025-06-16 16:31:21', 'no leida'),
(22, 'Nuevo Pedido', 'Pedido 8TIJ1QRC por $4.52', 'pedido', '2025-06-17 10:07:47', 'no leida'),
(23, 'Nuevo Pedido', 'Pedido 5GT39WK9 por $4.52', 'pedido', '2025-06-17 10:11:39', 'no leida'),
(24, 'Nuevo Pedido', 'Pedido ZPYN9PXJ por $4.52', 'pedido', '2025-06-17 10:11:50', 'no leida'),
(25, 'Nuevo Pedido', 'Pedido YT48URA8 por $4.52', 'pedido', '2025-06-17 10:14:25', 'no leida'),
(26, 'Nuevo Pedido', 'Pedido 1LQVPXTN por $4.52', 'pedido', '2025-06-17 10:15:28', 'no leida'),
(27, 'Nuevo Pedido', 'Pedido QD7KS74J por $4.52', 'pedido', '2025-06-19 01:58:28', 'no leida'),
(28, 'Nuevo Pedido', 'Pedido XTBKCOBG por $7.02', 'pedido', '2025-06-19 02:02:14', 'no leida'),
(29, 'Nuevo Pedido', 'Pedido TYKVG3YW por $7.02', 'pedido', '2025-06-19 02:03:55', 'no leida'),
(30, 'Nuevo Pedido', 'Pedido RPITLA4E por $7.02', 'pedido', '2025-06-19 02:05:03', 'no leida'),
(31, 'Nuevo Pedido', 'Pedido ZZG10KNI por $4.52', 'pedido', '2025-06-19 02:17:42', 'no leida'),
(32, 'Nuevo Pedido', 'Pedido DN61H35I por $9.04', 'pedido', '2025-06-19 02:23:22', 'no leida'),
(33, 'Nuevo Pedido', 'Pedido 3TCHQB62 por $4.52', 'pedido', '2025-06-19 02:27:56', 'no leida'),
(34, 'Nuevo Pedido', 'Pedido JH6AGGC9 por $4.52', 'pedido', '2025-06-19 02:52:19', 'no leida'),
(35, 'Nuevo Pedido', 'Pedido AUT0396Y por $4.52', 'pedido', '2025-06-19 03:18:16', 'no leida'),
(36, 'Estado de pedido actualizado', 'Pedido #AUT0396Y ahora está: en proceso', 'success', '2025-06-19 04:17:53', 'no leida'),
(37, 'Nuevo Pedido', 'Pedido TUUIQ8CM por $4.52', 'pedido', '2025-06-19 04:17:55', 'no leida'),
(38, 'Nuevo Pedido', 'Pedido ILH6GBHF por $4.52', 'pedido', '2025-06-19 04:44:38', 'no leida'),
(39, 'Nuevo Pedido', 'Pedido FUK1VYTO por $7.02', 'pedido', '2025-06-19 04:47:59', 'no leida'),
(40, 'Nuevo Pedido', 'Pedido CQY7DDLX por $4.52', 'pedido', '2025-06-19 04:51:10', 'no leida'),
(41, 'Nuevo Pedido', 'Pedido 3FVHG9FE por $4.52', 'pedido', '2025-06-19 14:31:37', 'no leida'),
(42, 'Nuevo Pedido', 'Pedido XJ0GAXKR por $7.02', 'pedido', '2025-06-19 14:31:46', 'no leida'),
(43, 'Nuevo Pedido', 'Pedido YXWA3CK4 por $4.52', 'pedido', '2025-06-19 14:32:03', 'no leida'),
(44, 'Nuevo Pedido', 'Pedido CT07OAJ6 por $7.02', 'pedido', '2025-06-19 14:32:55', 'no leida'),
(45, 'Nuevo Pedido', 'Pedido MR5J97V8 por $7.02', 'pedido', '2025-06-19 14:32:55', 'no leida'),
(46, 'Nuevo Pedido', 'Pedido BDIW56YJ por $4.52', 'pedido', '2025-06-19 14:33:05', 'no leida'),
(47, 'Nuevo Pedido', 'Pedido P8XPN2AB por $27.12', 'pedido', '2025-06-19 14:34:15', 'no leida'),
(48, 'Nuevo Pedido', 'Pedido 05ROSQEZ por $22.60', 'pedido', '2025-06-19 14:34:50', 'no leida'),
(49, 'Nuevo Pedido', 'Pedido 0LRW58GP por $4.52', 'pedido', '2025-06-19 14:35:05', 'no leida'),
(50, 'Nuevo Pedido', 'Pedido TISOQEUY por $27.12', 'pedido', '2025-06-19 14:35:24', 'no leida'),
(51, 'Nuevo Pedido', 'Pedido WE19U49G por $27.12', 'pedido', '2025-06-19 14:35:24', 'no leida'),
(52, 'Nuevo Pedido', 'Pedido A0HRGSOF por $9.04', 'pedido', '2025-06-19 14:35:47', 'no leida'),
(53, 'Nuevo Pedido', 'Pedido EZQ8OQC8 por $7.02', 'pedido', '2025-06-19 14:36:10', 'no leida'),
(54, 'Nuevo Pedido', 'Pedido ERHS8C7V por $7.02', 'pedido', '2025-06-19 14:36:10', 'no leida'),
(55, 'Nuevo Pedido', 'Pedido ALSWH46W por $22.60', 'pedido', '2025-06-19 14:37:35', 'no leida'),
(56, 'Nuevo Pedido', 'Pedido KL16DHKY por $22.60', 'pedido', '2025-06-19 14:37:35', 'no leida'),
(57, 'Nuevo Pedido', 'Pedido 3K73PLZJ por $22.60', 'pedido', '2025-06-19 14:38:59', 'no leida'),
(58, 'Nuevo Pedido', 'Pedido MDZTDXLO por $22.60', 'pedido', '2025-06-19 14:38:59', 'no leida'),
(59, 'Nuevo Pedido', 'Pedido KARMI5XX por $9.04', 'pedido', '2025-06-19 14:39:00', 'no leida'),
(60, 'Nuevo Pedido', 'Pedido O7PNY787 por $4.52', 'pedido', '2025-06-19 14:39:08', 'no leida'),
(61, 'Nuevo Pedido', 'Pedido VEYNWCPU por $58.76', 'pedido', '2025-06-19 14:40:21', 'no leida'),
(62, 'Nuevo Pedido', 'Pedido BQK03KIC por $58.76', 'pedido', '2025-06-19 14:40:21', 'no leida'),
(63, 'Estado de pedido actualizado', 'Pedido #BQK03KIC ahora está: en proceso', 'success', '2025-06-23 00:25:00', 'no leida'),
(64, 'Nuevo Pedido', 'Pedido 7O4Z22OA por $4.52', 'pedido', '2025-06-23 22:29:35', 'no leida');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset`
--

CREATE TABLE `password_reset` (
  `id_reset` int NOT NULL,
  `user_id` int NOT NULL,
  `user_type` enum('usuario','admin') NOT NULL,
  `reset_code` varchar(100) NOT NULL,
  `fecha_generacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expiracion` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL,
  `codigo_pedido` varchar(15) NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `id_direccion` int DEFAULT NULL,
  `fecha_pedido` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente','en proceso','en camino','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  `total` decimal(10,2) NOT NULL,
  `tipo_cliente` enum('invitado','registrado') NOT NULL DEFAULT 'registrado',
  `metodo_pago` enum('efectivo','tarjeta') NOT NULL,
  `nombre_cliente` varchar(100) DEFAULT NULL,
  `apellido_cliente` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `num_tarjeta_masked` varchar(19) DEFAULT NULL,
  `nombre_tarjeta` varchar(100) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `costo_envio` decimal(10,2) NOT NULL DEFAULT '0.00',
  `impuestos` decimal(10,2) NOT NULL DEFAULT '0.00',
  `aceptado_terminos` tinyint(1) NOT NULL DEFAULT '0',
  `tiempo_estimado_entrega` int DEFAULT NULL COMMENT 'minutos',
  `fecha_entrega` datetime DEFAULT NULL,
  `notas_adicionales` text,
  `id_usuario_invitado` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `codigo_pedido`, `id_usuario`, `id_direccion`, `fecha_pedido`, `estado`, `total`, `tipo_cliente`, `metodo_pago`, `nombre_cliente`, `apellido_cliente`, `telefono`, `email`, `num_tarjeta_masked`, `nombre_tarjeta`, `subtotal`, `costo_envio`, `impuestos`, `aceptado_terminos`, `tiempo_estimado_entrega`, `fecha_entrega`, `notas_adicionales`, `id_usuario_invitado`) VALUES
(1, 'FFL7OYRW', 1, 1, '2025-06-12 01:43:46', 'pendiente', 20.58, 'invitado', 'efectivo', 'ERICK', 'TIZNADO', '70830446', 'admin_1749692622800@mamamianpizza.com', NULL, NULL, 16.00, 2.50, 2.08, 1, 30, NULL, NULL, 1),
(2, '86JNAAMD', 2, 2, '2025-06-12 03:48:29', 'pendiente', 70.30, 'invitado', 'efectivo', 'ERICK', 'TIZNADO', '70830446', 'admin_1749700105259@mamamianpizza.com', NULL, NULL, 60.00, 2.50, 7.80, 1, 30, NULL, NULL, 1),
(3, 'DWQOPZOM', 5, 3, '2025-06-12 18:28:26', 'pendiente', 56.74, 'invitado', 'efectivo', 'ERICK', 'TIZNADO', '70830446', 'admin_1749752900416@mamamianpizza.com', NULL, NULL, 48.00, 2.50, 6.24, 1, 30, NULL, NULL, 1),
(4, '5MOK0O59', 6, 4, '2025-06-14 00:00:37', 'pendiente', 77.08, 'invitado', 'efectivo', 'Tiznado', 'TiznadoRodriguez', '70830446', 'admin_1749859237052@mamamianpizza.com', NULL, NULL, 66.00, 2.50, 8.58, 1, 30, NULL, NULL, 1),
(5, 'AQAOWA3X', 4, 5, '2025-06-14 03:23:47', 'pendiente', 6.78, 'registrado', 'efectivo', NULL, NULL, NULL, 'nathy.zelaya55@gmail.com', NULL, NULL, 6.00, 0.00, 0.78, 1, 25, NULL, NULL, NULL),
(6, '79042Z29', 4, 6, '2025-06-14 04:57:38', 'pendiente', 4.52, 'registrado', 'efectivo', NULL, NULL, NULL, 'nathy.zelaya55@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(7, '7YXBOGNT', 4, 7, '2025-06-14 05:02:47', 'pendiente', 4.52, 'registrado', 'efectivo', NULL, NULL, NULL, 'nathy.zelaya55@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(8, 'HQY73VMK', 4, 8, '2025-06-14 05:46:10', 'pendiente', 4.52, 'registrado', 'efectivo', NULL, NULL, NULL, 'nathy.zelaya55@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(9, 'DCO8HO66', 4, 9, '2025-06-14 05:50:54', 'pendiente', 4.52, 'registrado', 'efectivo', NULL, NULL, NULL, 'nathy.zelaya55@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(10, 'Q46NPWCZ', 7, 10, '2025-06-14 19:24:32', 'pendiente', 43.18, 'invitado', 'efectivo', 'ERICK', 'TIZNADO', '70830446', 'admin_1749929069946@mamamianpizza.com', NULL, NULL, 36.00, 2.50, 4.68, 1, 30, NULL, NULL, 1),
(11, 'WAP2WKAN', 8, 11, '2025-06-14 20:16:02', 'pendiente', 13.56, 'invitado', 'efectivo', 'mielna', 'wedwefdwe', '70141812', NULL, NULL, NULL, 12.00, 0.00, 1.56, 1, 25, NULL, NULL, 2),
(12, 'K6BH2IDQ', 9, 12, '2025-06-14 20:17:37', 'pendiente', 13.56, 'invitado', 'efectivo', 'mielna', 'wedwefdwe', '70141812', NULL, NULL, NULL, 12.00, 0.00, 1.56, 1, 25, NULL, NULL, 2),
(13, 'JSEEVCSE', 4, 13, '2025-06-14 20:21:23', 'en proceso', 13.56, 'registrado', 'efectivo', 'milena zelaya', NULL, '70141812', 'nathy.zelaya55@gmail.com', NULL, NULL, 12.00, 0.00, 1.56, 1, 25, NULL, NULL, NULL),
(14, 'RN42H92D', 10, 14, '2025-06-15 17:16:12', 'en camino', 11.54, 'invitado', 'efectivo', 'ERICK1213', 'TIZNADO', '70830446', 'admin_1750007765841@mamamianpizza.com', NULL, NULL, 8.00, 2.50, 1.04, 1, 30, NULL, NULL, 1),
(15, '9WWWEAQ9', 11, 15, '2025-06-15 17:46:10', 'entregado', 7.02, 'invitado', 'efectivo', 'ERICK2121', 'TIZNADO', '70830446', 'admin_1750009563808@mamamianpizza.com', NULL, NULL, 4.00, 2.50, 0.52, 1, 30, NULL, NULL, NULL),
(16, 'G7AW9Q18', 12, 16, '2025-06-16 16:31:19', 'pendiente', 4.52, 'registrado', 'efectivo', 'Erick Mauricio Tiznado', NULL, '70830446', 'tiznadoerick3@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(17, '3L4LN329', 12, 17, '2025-06-16 16:31:19', 'pendiente', 4.52, 'registrado', 'efectivo', 'Erick Mauricio Tiznado', NULL, '70830446', 'tiznadoerick3@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(18, 'AE4ZC6RH', 4, 18, '2025-06-16 16:31:21', 'pendiente', 4.52, 'registrado', 'efectivo', 'milu', NULL, '70141812', 'nathy.zelaya55@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(19, '8TIJ1QRC', 13, 19, '2025-06-17 10:07:47', 'pendiente', 4.52, 'invitado', 'efectivo', 'fgdgdfgdf', 'g43534534', '5464645646', NULL, NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, 3),
(20, '5GT39WK9', 14, 20, '2025-06-17 10:11:39', 'pendiente', 4.52, 'invitado', 'efectivo', 'fgdgdfgdf', 'g43534534', '5464645646', NULL, NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, 3),
(21, 'ZPYN9PXJ', 15, 21, '2025-06-17 10:11:50', 'pendiente', 4.52, 'invitado', 'efectivo', 'fgdgdfgdf', 'g43534534', '5464645646', NULL, NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, 3),
(22, 'YT48URA8', 4, 22, '2025-06-17 10:14:24', 'pendiente', 4.52, 'registrado', 'efectivo', 'hfghfgh', NULL, '3534534535', 'nathy.zelaya55@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(23, '1LQVPXTN', 4, 23, '2025-06-17 10:15:28', 'pendiente', 4.52, 'registrado', 'efectivo', '435345345', NULL, '353453535', 'nathy.zelaya55@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(27, 'QD7KS74J', 17, 27, '2025-06-19 01:58:28', 'pendiente', 4.52, 'invitado', 'efectivo', 'ERICK', 'TIZNADO', '70830446', NULL, NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, 1),
(28, 'XTBKCOBG', 18, 28, '2025-06-19 02:02:14', 'pendiente', 7.02, 'invitado', 'efectivo', 'ERICK', 'TIZNADO', '70830446', NULL, NULL, NULL, 4.00, 2.50, 0.52, 1, 45, NULL, NULL, 1),
(29, 'TYKVG3YW', 19, 29, '2025-06-19 02:03:54', 'pendiente', 7.02, 'invitado', 'efectivo', 'ERICK', 'TIZNADO', '70830446', NULL, NULL, NULL, 4.00, 2.50, 0.52, 1, 45, NULL, NULL, 1),
(30, 'RPITLA4E', 20, 30, '2025-06-19 02:05:02', 'pendiente', 7.02, 'invitado', 'efectivo', 'ERICK', 'TIZNADO', '70830446', NULL, NULL, NULL, 4.00, 2.50, 0.52, 1, 45, NULL, NULL, 1),
(31, 'ZZG10KNI', 16, 31, '2025-06-19 02:17:41', 'pendiente', 4.52, 'registrado', 'efectivo', 'dfgdfgdf', 'dfgfdgdfgd', '45456754756', 'milu.zelaya02@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(32, 'DN61H35I', 21, 32, '2025-06-19 02:23:22', 'pendiente', 9.04, 'invitado', 'efectivo', 'ERICK', 'TIZNADO', '70830446', NULL, NULL, NULL, 8.00, 0.00, 1.04, 1, 25, NULL, NULL, 1),
(33, '3TCHQB62', 16, 33, '2025-06-19 02:27:55', 'pendiente', 4.52, 'registrado', 'efectivo', 'yuiuyiuy', 'iyuiyuiyui', '867867867', 'milu.zelaya02@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(34, 'JH6AGGC9', 16, 34, '2025-06-19 02:52:19', 'pendiente', 4.52, 'registrado', 'efectivo', 'rtetert', 'etrtet', '354534543', 'milu.zelaya02@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(35, 'AUT0396Y', 3, 35, '2025-06-19 03:18:15', 'en proceso', 4.52, 'registrado', 'efectivo', 'thrghfgh', 'tryrthfdghfg', '56456456456', 'nathy.zelaya5@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(36, 'TUUIQ8CM', 16, 36, '2025-06-19 04:17:55', 'pendiente', 4.52, 'registrado', 'efectivo', 'gsfhfghfg', 'hfghfghfghfg', '454564565464', 'milu.zelaya02@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(37, 'ILH6GBHF', 16, 37, '2025-06-19 04:44:37', 'pendiente', 4.52, 'registrado', 'efectivo', 'rgergreg', 'etertertert', '5434534534', 'milu.zelaya02@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(38, 'FUK1VYTO', 22, 38, '2025-06-19 04:47:59', 'pendiente', 7.02, 'registrado', 'efectivo', 'Jose', 'Lobos', '55487848', 'alex1@gmail.com', NULL, NULL, 4.00, 2.50, 0.52, 1, 30, NULL, NULL, NULL),
(39, 'CQY7DDLX', 16, 39, '2025-06-19 04:51:09', 'pendiente', 4.52, 'registrado', 'efectivo', 'tretertert', 'etertertert', '534534534534', 'milu.zelaya02@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(40, '3FVHG9FE', 25, 40, '2025-06-19 14:31:36', 'pendiente', 4.52, 'registrado', 'efectivo', 'erick', 'mau', '70141812', 'tiznadoerick53@gmail.com', NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, NULL),
(41, 'XJ0GAXKR', 27, 41, '2025-06-19 14:31:45', 'pendiente', 7.02, 'registrado', 'efectivo', 'Jose', 'Lobos', '78829539', 'alex3@gmail.com', NULL, NULL, 4.00, 2.50, 0.52, 1, 30, NULL, NULL, NULL),
(42, 'YXWA3CK4', 28, 42, '2025-06-19 14:32:03', 'pendiente', 4.52, 'invitado', 'efectivo', 'Yeferin', 'Campos', '79058406', NULL, NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, 4),
(43, 'CT07OAJ6', 29, 43, '2025-06-19 14:32:54', 'pendiente', 7.02, 'invitado', 'efectivo', 'Alex', 'Jose', '55487666', NULL, NULL, NULL, 4.00, 2.50, 0.52, 1, 30, NULL, NULL, 5),
(44, 'MR5J97V8', 30, 44, '2025-06-19 14:32:54', 'pendiente', 7.02, 'invitado', 'efectivo', 'Alex', 'Jose', '55487666', NULL, NULL, NULL, 4.00, 2.50, 0.52, 1, 30, NULL, NULL, 5),
(45, 'BDIW56YJ', 31, 45, '2025-06-19 14:33:05', 'pendiente', 4.52, 'invitado', 'efectivo', 'Stanley', 'Larin', '72602346', NULL, NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, 6),
(46, 'P8XPN2AB', 32, 46, '2025-06-19 14:34:14', 'pendiente', 27.12, 'invitado', 'efectivo', 'Pedro', 'Torres', '58489833', NULL, NULL, NULL, 24.00, 0.00, 3.12, 1, 25, NULL, NULL, 7),
(47, '05ROSQEZ', 33, 47, '2025-06-19 14:34:50', 'pendiente', 22.60, 'invitado', 'efectivo', 'Stanley ', 'Larin', '72602346', NULL, NULL, NULL, 20.00, 0.00, 2.60, 1, 25, NULL, NULL, 6),
(48, '0LRW58GP', 34, 48, '2025-06-19 14:35:05', 'pendiente', 4.52, 'invitado', 'efectivo', 'tiznado', 'rodriguez', '78945654', NULL, NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, 8),
(49, 'TISOQEUY', 35, 49, '2025-06-19 14:35:24', 'pendiente', 27.12, 'invitado', 'efectivo', 'Karla', 'Rodríguez ', '55596422', NULL, NULL, NULL, 24.00, 0.00, 3.12, 1, 25, NULL, NULL, 9),
(50, 'WE19U49G', 36, 50, '2025-06-19 14:35:24', 'pendiente', 27.12, 'invitado', 'efectivo', 'Karla', 'Rodríguez ', '55596422', NULL, NULL, NULL, 24.00, 0.00, 3.12, 1, 25, NULL, NULL, 9),
(51, 'A0HRGSOF', 25, 51, '2025-06-19 14:35:47', 'pendiente', 9.04, 'registrado', 'efectivo', 'rodolfo', 'aparicio', '789955656', 'tiznadoerick53@gmail.com', NULL, NULL, 8.00, 0.00, 1.04, 1, 25, NULL, NULL, NULL),
(52, 'EZQ8OQC8', 37, 52, '2025-06-19 14:36:10', 'pendiente', 7.02, 'invitado', 'efectivo', 'Pedro', 'Tapia', '84554999', NULL, NULL, NULL, 4.00, 2.50, 0.52, 1, 30, NULL, NULL, 10),
(53, 'ERHS8C7V', 38, 53, '2025-06-19 14:36:10', 'pendiente', 7.02, 'invitado', 'efectivo', 'Pedro', 'Tapia', '84554999', NULL, NULL, NULL, 4.00, 2.50, 0.52, 1, 30, NULL, NULL, 10),
(54, 'ALSWH46W', 27, 54, '2025-06-19 14:37:35', 'pendiente', 22.60, 'registrado', 'efectivo', 'Jose', 'Lonos', '7558999', 'alex3@gmail.com', NULL, NULL, 20.00, 0.00, 2.60, 1, 25, NULL, NULL, NULL),
(55, 'KL16DHKY', 27, 55, '2025-06-19 14:37:35', 'pendiente', 22.60, 'registrado', 'efectivo', 'Jose', 'Lonos', '7558999', 'alex3@gmail.com', NULL, NULL, 20.00, 0.00, 2.60, 1, 25, NULL, NULL, NULL),
(57, '3K73PLZJ', 40, 57, '2025-06-19 14:38:59', 'pendiente', 22.60, 'invitado', 'efectivo', 'Jose', 'Lobos', '79435457', NULL, NULL, NULL, 20.00, 0.00, 2.60, 1, 25, NULL, NULL, 13),
(58, 'MDZTDXLO', 41, 58, '2025-06-19 14:38:59', 'pendiente', 22.60, 'invitado', 'efectivo', 'Jose', 'Lobos', '79435457', NULL, NULL, NULL, 20.00, 0.00, 2.60, 1, 25, NULL, NULL, 13),
(59, 'KARMI5XX', 42, 59, '2025-06-19 14:39:00', 'pendiente', 9.04, 'invitado', 'efectivo', 'Juan Carlos ', 'Martinez ', '79671218', NULL, NULL, NULL, 8.00, 0.00, 1.04, 1, 25, NULL, NULL, 14),
(60, 'O7PNY787', 43, 60, '2025-06-19 14:39:07', 'pendiente', 4.52, 'invitado', 'efectivo', 'Nathaly Milena', 'Caballero', '44616454', NULL, NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, 15),
(61, 'VEYNWCPU', 27, 61, '2025-06-19 14:40:20', 'pendiente', 58.76, 'registrado', 'efectivo', 'Prueba', 'Prueba', '58962222', 'alex3@gmail.com', NULL, NULL, 52.00, 0.00, 6.76, 1, 25, NULL, NULL, NULL),
(62, 'BQK03KIC', 27, 62, '2025-06-19 14:40:21', 'en proceso', 58.76, 'registrado', 'efectivo', 'Prueba', 'Prueba', '58962222', 'alex3@gmail.com', NULL, NULL, 52.00, 0.00, 6.76, 1, 25, NULL, NULL, NULL),
(63, '7O4Z22OA', 47, 63, '2025-06-23 22:29:35', 'pendiente', 4.52, 'invitado', 'efectivo', 'jose lobos', NULL, '7943 5457', NULL, NULL, NULL, 4.00, 0.00, 0.52, 1, 25, NULL, NULL, 16);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `precios`
--

CREATE TABLE `precios` (
  `pizza_id` int NOT NULL,
  `tamano_id` int NOT NULL,
  `precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `precios`
--

INSERT INTO `precios` (`pizza_id`, `tamano_id`, `precio`) VALUES
(8, 1, 4.00),
(8, 2, 6.00),
(8, 3, 8.00),
(8, 4, 12.00),
(9, 1, 4.00),
(9, 2, 6.00),
(9, 3, 8.00),
(9, 4, 12.00),
(10, 1, 4.00),
(10, 2, 6.00),
(10, 3, 8.00),
(10, 4, 12.00),
(11, 1, 4.00),
(11, 2, 6.00),
(11, 3, 8.00),
(11, 4, 12.00),
(12, 1, 4.00),
(12, 2, 6.00),
(12, 3, 8.00),
(12, 4, 12.00),
(13, 1, 4.00),
(13, 2, 6.00),
(13, 3, 8.00),
(13, 4, 12.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text,
  `seccion` varchar(50) DEFAULT NULL,
  `id_categoria` int DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `imagen` varchar(255) DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `titulo`, `descripcion`, `seccion`, `id_categoria`, `activo`, `imagen`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(8, 'Pizza de camarón', 'Salsa de tomate, queso mozzarella y camarón', 'Las mas Populares', 1, 1, 'https://api.mamamianpizza.com/uploads/imagen-1750310646250-158034039.png', '2025-06-19 03:43:17', '2025-06-19 05:30:01'),
(9, 'Pizza de curil', 'Salsa de tomate, queso mozzarella y curil', 'Recomendacion de la casa', 1, 1, 'https://api.mamamianpizza.com/uploads/imagen-1750310520016-805362257.png', '2025-06-19 03:43:17', '2025-06-19 05:29:45'),
(10, 'Quesos Suprema', 'Salsa de tomate y mezcla de cuatro quesos.', 'Las mas Populares', 1, 1, 'https://api.mamamianpizza.com/uploads/imagen-1750311076277-433255140.png', '2025-06-19 03:43:17', '2025-06-19 05:31:42'),
(11, 'Suprema Pizza', 'Salsa de tomate, queso mozzarella, pepperoni, jamón, salami, hongos, aceitunas y vegetales.', 'Las mas Populares', 1, 0, 'https://api.mamamianpizza.com/uploads/imagen-1750311315161-775513065.png', '2025-06-19 03:43:17', '2025-06-19 03:43:17'),
(12, 'Pepperoni Pizza', 'Salsa de tomate, queso mozzarella y rodajas de pepperoni.', 'Recomendacion de la casa', 1, 0, 'https://api.mamamianpizza.com/uploads/imagen-1750311403276-455206275.png', '2025-06-19 03:43:17', '2025-06-19 03:43:17'),
(13, 'Hawaiana Pizza', 'Salsa de tomate, queso mozzarella, jamón y piña.', 'Recomendacion de la casa', 1, 0, 'https://api.mamamianpizza.com/uploads/imagen-1750311681859-187982278.png', '2025-06-19 03:43:17', '2025-06-19 03:43:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recetas`
--

CREATE TABLE `recetas` (
  `id_receta` int NOT NULL,
  `id_producto` int NOT NULL,
  `id_ingrediente` int NOT NULL,
  `cantidad_necesaria` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resenas`
--

CREATE TABLE `resenas` (
  `id_resena` int NOT NULL,
  `id_usuario` int NOT NULL,
  `id_producto` int NOT NULL,
  `comentario` text NOT NULL,
  `valoracion` tinyint NOT NULL COMMENT '1–5 estrellas',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `aprobada` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `resenas`
--

INSERT INTO `resenas` (`id_resena`, `id_usuario`, `id_producto`, `comentario`, `valoracion`, `fecha_creacion`, `aprobada`) VALUES
(4, 16, 13, 'La pizza de piña es la mejor ❤️👌', 5, '2025-06-19 05:55:53', 1),
(5, 3, 9, 'me encanta!', 5, '2025-06-21 22:57:06', 0),
(6, 3, 12, 'e', 2, '2025-06-23 22:04:25', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id_reserva` int NOT NULL,
  `id_usuario` int DEFAULT NULL,
  `tipo_reserva` enum('pedido para recoger','reserva de mesa') NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `estado` enum('pendiente','confirmada','cancelada') NOT NULL DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tamanos`
--

CREATE TABLE `tamanos` (
  `id_tamano` int NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `indice` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tamanos`
--

INSERT INTO `tamanos` (`id_tamano`, `nombre`, `indice`) VALUES
(1, 'Personal', 1),
(2, 'Mediana', 2),
(3, 'Grande', 3),
(4, 'Gigante', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `sexo` enum('M','F','Otro') DEFAULT NULL,
  `dui` varchar(20) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `activo` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `contrasena`, `celular`, `fecha_nacimiento`, `sexo`, `dui`, `foto_perfil`, `activo`) VALUES
(1, 'ERICK', 'admin_1749692622800@mamamianpizza.com', '$2b$05$jC4KdqS8vHrlwmdjUf/uh.AhdZ1Xd7gn6yrmFsXR2.UScydB5bV/m', '70830446', NULL, NULL, NULL, NULL, 0),
(2, 'ERICK', 'admin_1749700105259@mamamianpizza.com', '$2b$05$7.bsGhXj3vV7P5fezUi8cuxn.W2NumaTVexJG3Vro8pNquGmcQmrC', '70830446', NULL, NULL, NULL, NULL, 0),
(3, 'nathaly milenas', 'nathy.zelaya5@gmail.com', '$2b$10$UkKD/yDKIIcaqN3Hl.K1KuBWENdiB.f4u9eDK7dnV9uxcwCWVxS/2', '+503 70141812', '2007-06-03', 'F', '123456789', 'https://api.mamamianpizza.com/uploads/profiles/profile-1750727212291-700980217.png', 0),
(4, 'milena zelaya', 'nathy.zelaya55@gmail.com', '$2b$10$0Wx.0HLRSnbl6amYtIy1R.MDh/55Hks0LoZBVgg4.rW8yRXYj2Gd6', '70141812', '1992-06-07', 'F', '123456789', 'https://api.mamamianpizza.com/uploads/profiles/profile-1750157108851-682143803.jpg', 0),
(5, 'ERICK', 'admin_1749752900416@mamamianpizza.com', '$2b$05$c6TBfGgTS/WLpH6gaAkWMe4vEoO6B9gIskAIXnuMCdEnjqe50EHtq', '70830446', NULL, NULL, NULL, NULL, 0),
(6, 'Tiznado', 'admin_1749859237052@mamamianpizza.com', '$2b$05$XEujTJ67Hef9AiJYy/sPFOWBi/WXVAg2B0CuvJtoewKJiK.LsRxly', '70830446', NULL, NULL, NULL, NULL, 0),
(7, 'ERICK', 'admin_1749929069946@mamamianpizza.com', '$2b$05$9DS.UcYB37aE1Wto87Et/.I/521jkEaSSz2MGDr54PVbpACqlpjfe', '70830446', NULL, NULL, NULL, NULL, 0),
(8, 'mielna', 'invitado_1749932162100@mamamianpizza.com', '$2b$05$/vyIRUH/W3az3Zx7EyA0wusL.JGQry3bOYqwkQvOv/t6di3aMIOlq', '70141812', NULL, NULL, NULL, NULL, 0),
(9, 'mielna', 'invitado_1749932257497@mamamianpizza.com', '$2b$05$NVoVLD7BInZofll48paKfOcN0/AzZfg1esm91F4GrQxGEGLqkoDnC', '70141812', NULL, NULL, NULL, NULL, 0),
(10, 'ERICK1213', 'admin_1750007765841@mamamianpizza.com', '$2b$05$eoy10StUMCZID.LIGtmMguzC4HUs/VcKsUhpg6b3.AgyYLnR2KRIu', '70830446', NULL, NULL, NULL, NULL, 0),
(11, 'ERICK2121', 'guest_70830446_1750009570414@temp.com', 'guest_user_no_password', '70830446', NULL, NULL, NULL, NULL, 0),
(12, 'Erick Mauricio ', 'tiznadoerick3@gmail.com', '$2b$12$lD8yJc8v/xi/9AdmJwjRqea6ETiU7/HuYt2yRQWaJg.ikOvz8nCkC', '70830446', '2002-10-06', 'M', '063693309', 'https://api.mamamianpizza.com/uploads/profiles/profile-1750091033242-425369579.jpg', 0),
(13, 'Invitado-fgdgdfgdf', 'invitado_5464645646_1750154867358@mamamianpizza.com', '$2b$05$x5TTU.QX2X8GUKr0JMHNre5cA/wHc0qAHZ75E.XdIzIkwji3l4tRW', '5464645646', NULL, NULL, NULL, NULL, 0),
(14, 'Invitado-fgdgdfgdf', 'invitado_5464645646_1750155099003@mamamianpizza.com', '$2b$05$CU/ndTps5/CdAUmZWAvGwuwtXrQVoHhCKR7TSF2CU5v/SVj6vqY0q', '5464645646', NULL, NULL, NULL, NULL, 0),
(15, 'Invitado-fgdgdfgdf', 'invitado_5464645646_1750155110010@mamamianpizza.com', '$2b$05$qTZKlCTWpHrFcl6vu55C6uvxpSFAkAXJLMHrV/aBHp4vCOZNkjQ6C', '5464645646', NULL, NULL, NULL, NULL, 0),
(16, 'milenas', 'milu.zelaya02@gmail.com', '$2b$10$NW.5rqKsIOwmYgcG341.FuI6EyuG4HefelopLi1s/nYWoB.A.UKc6', '12345678', '1995-06-05', 'F', '123456789', 'https://api.mamamianpizza.com/uploads/profiles/profile-1750309443884-614243724.png', 0),
(17, 'Invitado-ERICK', 'invitado_70830446_1750298308125@mamamianpizza.com', '$2b$05$ayNg.elMwG88fLYRXZx4EO/PHgXd0sLX5BWrD9172.AfShB/OopI.', '70830446', NULL, NULL, NULL, NULL, 0),
(18, 'Invitado-ERICK', 'invitado_70830446_1750298534034@mamamianpizza.com', '$2b$05$.eKVc9mS9FKF1fy0t0TvMuWa2n/bifdDTfC.cFUHtqqS6IrwuCfTS', '70830446', NULL, NULL, NULL, NULL, 0),
(19, 'Invitado-ERICK', 'invitado_70830446_1750298634892@mamamianpizza.com', '$2b$05$MtUgwhQlAsyM9RmybbD0MuELnlRq1DeY2nRtd3rboI5IHZ9QddI3C', '70830446', NULL, NULL, NULL, NULL, 0),
(20, 'Invitado-ERICK', 'invitado_70830446_1750298702468@mamamianpizza.com', '$2b$05$nFslqX.khh5eYEr48cHBZOhzEzgS3DJAaN5gDGyBvTG/dcONsRCv6', '70830446', NULL, NULL, NULL, NULL, 0),
(21, 'Invitado-ERICK', 'invitado_70830446_1750299802547@mamamianpizza.com', '$2b$05$9C.wUKHTbqK87ljWaLpieOwUqiTsHLc.P/V1sYLNSvDDAzx6goDua', '70830446', NULL, NULL, NULL, NULL, 0),
(22, 'Jose', 'alex1@gmail.com', '$2b$10$u.JpNfYZZPubZl4qI5XlTu25h0LxUpop3c8OjixRE.g.Z5tA5YNki', '+503 0000-0000', '2014-06-19', 'M', '0087667866', 'https://api.mamamianpizza.com/uploads/profiles/profile-1750308421073-636641548.jpeg', 0),
(25, 'Mauricio', 'tiznadoerick53@gmail.com', '$2b$10$pJWSqCyOFG8JFGGiXk3pz.jGgXYJAHIwDEiZzHk0i2Mq1n4lux7au', '12343465', '2007-06-02', 'F', '12345678', 'https://api.mamamianpizza.com/uploads/profiles/profile-1750713736150-743704375.png', 0),
(26, 'Jose', 'alex2@gmail.com', '$2b$10$hiRhq/.A9HP5N7RRJa6sQ.Rl.4456he4zH1mGIHt88pM7heio1ISm', '79435457', '2025-06-12', 'M', '865577908', 'https://api.mamamianpizza.com/uploads/profiles/profile-1750309375943-773684050.jpeg', 0),
(27, 'Jose', 'alex3@gmail.com', '$2b$10$Oc2/DOrPU2eQ/extVA/w9.l4S7ZyziHWJtUHRzYguE6ECF8yGsaBO', '79435457', '2025-06-12', 'M', '76656655', 'https://api.mamamianpizza.com/uploads/profiles/profile-1750346928456-684156138.jpeg', 0),
(28, 'Invitado-Yeferin', 'invitado_79058406_1750343523041@mamamianpizza.com', '$2b$05$/iGGC0At0sRaPI9lKYksjeMsQrYS.VYLPqlHpTixfh8kFPcbGAcbW', '79058406', NULL, NULL, NULL, NULL, 0),
(29, 'Invitado-Alex', 'invitado_55487666_1750343574776@mamamianpizza.com', '$2b$05$D58hHx/FDSzLMBc6S6nNluK.Nn97gr4tGFRwIm2gp5UaVC4ZxXaK.', '55487666', NULL, NULL, NULL, NULL, 0),
(30, 'Invitado-Alex', 'invitado_55487666_1750343574973@mamamianpizza.com', '$2b$05$VGDwGJEdGqKIbQEKOHNKfukv4IrL1kKpuPAm23eWmdozblRuDNTFO', '55487666', NULL, NULL, NULL, NULL, 0),
(31, 'Invitado-Stanley', 'invitado_72602346_1750343585095@mamamianpizza.com', '$2b$05$4Kl2eU.3x50K34Oah.q7Webl6uhb7Jj1HVMi9Hh1PT1Y4ubSa5ZW2', '72602346', NULL, NULL, NULL, NULL, 0),
(32, 'Invitado-Pedro', 'invitado_58489833_1750343654925@mamamianpizza.com', '$2b$05$uymCghK8isSB/rUKX2WHd.vEMjR0S6kIBz7xbX8JUVJ8GfCe4Nzh2', '58489833', NULL, NULL, NULL, NULL, 0),
(33, 'Invitado-Stanley ', 'invitado_72602346_1750343690429@mamamianpizza.com', '$2b$05$CSVwNph7Qo.UhSPe5NjI4ukgVXksHLCNg2szkdRpZr4Zie6oUjgZ6', '72602346', NULL, NULL, NULL, NULL, 0),
(34, 'Invitado-tiznado', 'invitado_78945654_1750343705375@mamamianpizza.com', '$2b$05$mseEKkI7zh0sb3/gxxFRzeQOVRFO2lCk.TwGsbaXQLQwECUVTidBm', '78945654', NULL, NULL, NULL, NULL, 0),
(35, 'Invitado-Karla', 'invitado_55596422_1750343724606@mamamianpizza.com', '$2b$05$b1CytEYIc7OBldXSsFJEbeK0UzwhhprqGkZjo8XIeMPcJpRDvRh82', '55596422', NULL, NULL, NULL, NULL, 0),
(36, 'Invitado-Karla', 'invitado_55596422_1750343724807@mamamianpizza.com', '$2b$05$l85yveQsOc6Id0HVLnK.7OamRimjZswImtwXTP9VPz.hhFDY1ALd.', '55596422', NULL, NULL, NULL, NULL, 0),
(37, 'Invitado-Pedro', 'invitado_84554999_1750343770242@mamamianpizza.com', '$2b$05$a5/VSj9ioXYejSA9vE6HpOJsojpfWlwmn4tGw/Md9nMoHPE6zD3FO', '84554999', NULL, NULL, NULL, NULL, 0),
(38, 'Invitado-Pedro', 'invitado_84554999_1750343770281@mamamianpizza.com', '$2b$05$QPTxGiXoeP2FA.Dz2tRaxOfTjb09LszO7fZ33nw.qdcb2Y8o2Jle6', '84554999', NULL, NULL, NULL, NULL, 0),
(39, 'Invitado-Jose', 'invitado_79435457_1750343920503@mamamianpizza.com', '$2b$05$69oSDa/LzraSS4YYG6uB6Olcv4yWBwOEW.WQ57gBytCNdXsOW0/8O', '79435457', NULL, NULL, NULL, NULL, 0),
(40, 'Invitado-Jose', 'invitado_79435457_1750343939384@mamamianpizza.com', '$2b$05$wZCXXS3RcrPGAGL5DMQuQunDivurGqlQXArlaNyJrMRZ8hqxj4Z5C', '79435457', NULL, NULL, NULL, NULL, 0),
(41, 'Invitado-Jose', 'invitado_79435457_1750343939445@mamamianpizza.com', '$2b$05$g1eTvoicscK9LjTFeGujKeUNTPnmA.Psv91uabA3CBwKnjnlfVvlS', '79435457', NULL, NULL, NULL, NULL, 0),
(42, 'Invitado-Juan Carlos ', 'invitado_79671218_1750343940698@mamamianpizza.com', '$2b$05$9oT0hcn0Kc5GbE0iiz3idec5OrgrjPXjWgo0dRw0IDJxmOWjNyP8e', '79671218', NULL, NULL, NULL, NULL, 0),
(43, 'Invitado-Nathaly Milena', 'invitado_44616454_1750343947870@mamamianpizza.com', '$2b$05$TK/.Y8ZahvENPTA2HZonZ.wzXHObhyLpM/9tDpMu6otNPLdOAK.AK', '44616454', NULL, NULL, NULL, NULL, 0),
(44, 'José Alexander', 'coxin94240@nab4.com', '$2b$10$UcReIgDdvDKnT.HKBEEc4.By.O/XODXbVOpaIP2DDrCemUs0xIS9G', '70141812', '1989-06-02', 'M', '123456789', 'https://api.mamamianpizza.com/uploads/profiles/profile-1750346194035-28910024.jpg', 0),
(46, 'Alex2', 'alex33@gmail.com', '$2b$10$LDyaToxtnlytUZziIgow8evTLZfQziC8CPt.Vi/97EopY7Ayx/EB.', '79435457', '2025-06-11', 'M', '977556544', 'https://api.mamamianpizza.com/uploads/profiles/profile-1750715322584-589827942.jpeg', 0),
(47, 'Invitado-jose lobos', 'invitado_7943 5457_1750717775563@mamamianpizza.com', '$2b$05$VDd37sTWGNnryYdqbiXJGO67l6uAjw1vjXJwKFmrP78CFc1CWevpa', '7943 5457', NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_invitados`
--

CREATE TABLE `usuarios_invitados` (
  `id_usuario_invitado` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `celular` varchar(20) NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ultimo_pedido` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios_invitados`
--

INSERT INTO `usuarios_invitados` (`id_usuario_invitado`, `nombre`, `apellido`, `celular`, `fecha_creacion`, `ultimo_pedido`) VALUES
(1, 'ERICK', 'TIZNADO', '70830446', '2025-06-12 01:43:46', '2025-06-19 02:23:22'),
(2, 'mielna', 'wedwefdwe', '70141812', '2025-06-14 20:16:02', '2025-06-14 20:17:37'),
(3, 'fgdgdfgdf', 'g43534534', '5464645646', '2025-06-17 10:07:47', '2025-06-17 10:11:50'),
(4, 'Yeferin', 'Campos', '79058406', '2025-06-19 14:32:03', '2025-06-19 14:32:03'),
(5, 'Alex', 'Jose', '55487666', '2025-06-19 14:32:54', '2025-06-19 14:32:54'),
(6, 'Stanley ', 'Larin', '72602346', '2025-06-19 14:33:05', '2025-06-19 14:34:50'),
(7, 'Pedro', 'Torres', '58489833', '2025-06-19 14:34:14', '2025-06-19 14:34:14'),
(8, 'tiznado', 'rodriguez', '78945654', '2025-06-19 14:35:05', '2025-06-19 14:35:05'),
(9, 'Karla', 'Rodríguez ', '55596422', '2025-06-19 14:35:24', '2025-06-19 14:35:24'),
(10, 'Pedro', 'Tapia', '84554999', '2025-06-19 14:36:10', '2025-06-19 14:36:10'),
(13, 'Jose', 'Lobos', '79435457', '2025-06-19 14:38:59', '2025-06-19 14:38:59'),
(14, 'Juan Carlos ', 'Martinez ', '79671218', '2025-06-19 14:39:00', '2025-06-19 14:39:00'),
(15, 'Nathaly Milena', 'Caballero', '44616454', '2025-06-19 14:39:07', '2025-06-19 14:39:07'),
(16, 'jose lobos', '', '7943 5457', '2025-06-23 22:29:35', '2025-06-23 22:29:35');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `contenido_web`
--
ALTER TABLE `contenido_web`
  ADD PRIMARY KEY (`id_contenido`);

--
-- Indices de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `fk_detalle_pedidos_pedido` (`id_pedido`),
  ADD KEY `fk_detalle_pedidos_producto` (`id_producto`);

--
-- Indices de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD PRIMARY KEY (`id_direccion`),
  ADD KEY `fk_direcciones_usuario` (`id_usuario`);

--
-- Indices de la tabla `experiencia`
--
ALTER TABLE `experiencia`
  ADD PRIMARY KEY (`id_experiencia`),
  ADD KEY `fk_experiencia_usuario` (`id_usuario`);

--
-- Indices de la tabla `historial_contenido`
--
ALTER TABLE `historial_contenido`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `fk_historial_contenido_contenido` (`id_contenido`),
  ADD KEY `fk_historial_contenido_admin` (`id_admin`);

--
-- Indices de la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  ADD PRIMARY KEY (`id_ingrediente`);

--
-- Indices de la tabla `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `fk_logs_usuario` (`id_usuario`);

--
-- Indices de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD PRIMARY KEY (`id_metodo_pago`),
  ADD KEY `fk_metodos_pago_usuario` (`id_usuario`);

--
-- Indices de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `fk_movimientos_inventario_ingrediente` (`id_ingrediente`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`);

--
-- Indices de la tabla `password_reset`
--
ALTER TABLE `password_reset`
  ADD PRIMARY KEY (`id_reset`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `fk_pedidos_usuario` (`id_usuario`),
  ADD KEY `fk_pedidos_direccion` (`id_direccion`),
  ADD KEY `fk_pedido_usuario_invitado` (`id_usuario_invitado`);

--
-- Indices de la tabla `precios`
--
ALTER TABLE `precios`
  ADD PRIMARY KEY (`pizza_id`,`tamano_id`),
  ADD KEY `tamano_id` (`tamano_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `fk_productos_categoria` (`id_categoria`);

--
-- Indices de la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD PRIMARY KEY (`id_receta`),
  ADD KEY `fk_recetas_producto` (`id_producto`),
  ADD KEY `fk_recetas_ingrediente` (`id_ingrediente`);

--
-- Indices de la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD PRIMARY KEY (`id_resena`),
  ADD KEY `fk_resenas_usuario` (`id_usuario`),
  ADD KEY `fk_resenas_producto` (`id_producto`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id_reserva`),
  ADD KEY `fk_reservas_usuario` (`id_usuario`);

--
-- Indices de la tabla `tamanos`
--
ALTER TABLE `tamanos`
  ADD PRIMARY KEY (`id_tamano`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `usuarios_invitados`
--
ALTER TABLE `usuarios_invitados`
  ADD PRIMARY KEY (`id_usuario_invitado`),
  ADD UNIQUE KEY `celular` (`celular`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administradores`
--
ALTER TABLE `administradores`
  MODIFY `id_admin` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `contenido_web`
--
ALTER TABLE `contenido_web`
  MODIFY `id_contenido` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  MODIFY `id_detalle` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  MODIFY `id_direccion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `experiencia`
--
ALTER TABLE `experiencia`
  MODIFY `id_experiencia` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `historial_contenido`
--
ALTER TABLE `historial_contenido`
  MODIFY `id_historial` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  MODIFY `id_ingrediente` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `logs`
--
ALTER TABLE `logs`
  MODIFY `id_log` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=783;

--
-- AUTO_INCREMENT de la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  MODIFY `id_metodo_pago` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id_movimiento` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT de la tabla `password_reset`
--
ALTER TABLE `password_reset`
  MODIFY `id_reset` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `recetas`
--
ALTER TABLE `recetas`
  MODIFY `id_receta` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resenas`
--
ALTER TABLE `resenas`
  MODIFY `id_resena` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id_reserva` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tamanos`
--
ALTER TABLE `tamanos`
  MODIFY `id_tamano` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `usuarios_invitados`
--
ALTER TABLE `usuarios_invitados`
  MODIFY `id_usuario_invitado` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD CONSTRAINT `detalle_pedidos_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_pedidos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD CONSTRAINT `direcciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `experiencia`
--
ALTER TABLE `experiencia`
  ADD CONSTRAINT `experiencia_ibfk_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `historial_contenido`
--
ALTER TABLE `historial_contenido`
  ADD CONSTRAINT `historial_contenido_ibfk_1` FOREIGN KEY (`id_contenido`) REFERENCES `contenido_web` (`id_contenido`) ON DELETE CASCADE,
  ADD CONSTRAINT `historial_contenido_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `administradores` (`id_admin`) ON DELETE SET NULL;

--
-- Filtros para la tabla `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `metodos_pago`
--
ALTER TABLE `metodos_pago`
  ADD CONSTRAINT `metodos_pago_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD CONSTRAINT `movimientos_inventario_ibfk_1` FOREIGN KEY (`id_ingrediente`) REFERENCES `ingredientes` (`id_ingrediente`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedido_usuario_invitado` FOREIGN KEY (`id_usuario_invitado`) REFERENCES `usuarios_invitados` (`id_usuario_invitado`) ON DELETE SET NULL,
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL,
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_direccion`) REFERENCES `direcciones` (`id_direccion`) ON DELETE SET NULL;

--
-- Filtros para la tabla `precios`
--
ALTER TABLE `precios`
  ADD CONSTRAINT `precios_ibfk_1` FOREIGN KEY (`pizza_id`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `precios_ibfk_2` FOREIGN KEY (`tamano_id`) REFERENCES `tamanos` (`id_tamano`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL;

--
-- Filtros para la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD CONSTRAINT `recetas_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE,
  ADD CONSTRAINT `recetas_ibfk_2` FOREIGN KEY (`id_ingrediente`) REFERENCES `ingredientes` (`id_ingrediente`) ON DELETE CASCADE;

--
-- Filtros para la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD CONSTRAINT `resenas_ibfk_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE,
  ADD CONSTRAINT `resenas_ibfk_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
