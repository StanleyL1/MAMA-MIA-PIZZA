import React, { useState, useEffect, useMemo } from 'react';
import ProductsCards from '../productsCards/productsCards';
import Footer from '../footer/footer';
import PizzaModal from '../PizzaModal/PizzaModal';
import pizzaIcon from '../../assets/PizzaR.png';
import menuBookIcon from '../../assets/menuBook.png';
import searchIcon from '../../assets/search.png';
import './Menu.css';

const Menu = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Intentando obtener menú desde la API...");
      
      const response = await fetch('https://api.mamamianpizza.com/api/content/getMenu');
      const data = await response.json();
      
      if (data && data.menu && Array.isArray(data.menu) && data.menu.length > 0) {
        console.log("✅ Menú obtenido correctamente:", data.menu);
        setMenu(data.menu);
        
        // Depurar estructura de datos
        if (data.menu.length > 0) {
          const sampleItem = data.menu[0];
          console.log("Muestra de item:", sampleItem);
          console.log("Propiedades disponibles:", Object.keys(sampleItem));
          console.log("ID:", sampleItem.id);
          console.log("Título:", sampleItem.titulo);
          console.log("Imagen:", sampleItem.imagen);
          console.log("Opciones:", sampleItem.opciones);
        }
        
        // Ya no necesitamos visualizar las categorías como antes porque la estructura ha cambiado
        console.log("Número de productos cargados:", data.menu.length);
      } else {
        console.error("Error: Datos recibidos incorrectos o vacíos", data);
        setError("No se pudieron cargar los productos. La API devolvió datos incorrectos.");
        setMenu([]);
      }
    } catch (error) {
      console.error("Error al cargar el menú:", error);
      setError("No se pudo conectar con el servidor. Por favor, intenta más tarde.");
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMenu();
  }, []);

  // Filtrar productos según la categoría activa y término de búsqueda
  const filteredMenu = useMemo(() => {
    if (!menu || menu.length === 0) return [];
    
    console.log("Filtrando menú. Categoría activa:", activeCategory);
    
    return menu.filter(item => {
      if (!item) return false;
      
      // Mostrar todos los productos cuando se selecciona la categoría 'Todos'
      if (activeCategory === 'Todos') {
        return true;
      }
      
      // Determinar la categoría del producto basado en su título y/o descripción
      const titulo = (item.titulo || '').toLowerCase();
      const descripcion = (item.descripcion || '').toLowerCase();
      
      // Detectar categoría por nombre
      if (activeCategory === 'Pizzas' && 
          (titulo.includes('pizza') || descripcion.includes('pizza'))) {
        return true;
      }
      
      if (activeCategory === 'Bebidas' && 
          (titulo.includes('bebida') || titulo.includes('refresco') || 
           titulo.includes('agua') || titulo.includes('soda') || 
           titulo.includes('cerveza') || titulo.includes('jugo') || 
           descripcion.includes('bebida'))) {
        return true;
      }

      if (activeCategory === 'Postres' && 
          (titulo.includes('postre') || titulo.includes('helado') || 
           titulo.includes('pastel') || titulo.includes('torta') || 
           titulo.includes('dulce') || descripcion.includes('postre'))) {
        return true;
      }
      
      // Para categorías específicas que no coincidieron, no mostrar el producto
      return false;
    }).filter(item => {
      // Aplicar filtro de búsqueda a todos los productos ya filtrados por categoría
      if (!searchTerm) return true;
      
      const itemTitle = item.titulo || '';
      const itemDesc = item.descripcion || '';
      
      return itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
             itemDesc.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [menu, activeCategory, searchTerm]);

  const handleOpenModal = (product) => {
    console.log("Abriendo modal para producto:", product);
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddToCart = (producto, masa, tamano, instrucciones, ingredientes) => {
    console.log("Menu: Añadiendo al carrito", producto);
    
    // Determinar si es una pizza basado en el nombre o categoría
    const isPizza = producto.id_categoria === 1 || 
                   (producto.titulo && producto.titulo.toLowerCase().includes('pizza'));
    
    // Asegurarse de que los datos del producto estén en el formato esperado por el carrito
    const productToAdd = {
      ...producto,
      nombre: producto.titulo, // Compatibilidad para componentes que usan nombre en lugar de titulo
      url_imagen: producto.imagen, // Compatibilidad para componentes que usan url_imagen
      // Si no hay tamaño seleccionado pero hay opciones disponibles, usa la primera opción
      precio: tamano && tamano.precio ? 
        tamano.precio : 
        (producto.opciones && producto.opciones.length > 0 ? producto.opciones[0].precio : 0)
    };
    
    // Si es una pizza envía los datos completos, sino sólo el producto y las instrucciones
    if (isPizza) {
      onAddToCart(productToAdd, masa, tamano, instrucciones, ingredientes);
    } else {
      onAddToCart(productToAdd, null, null, instrucciones);
    }
    
    handleCloseModal();
  };

  console.log("Renderizando menú. Productos filtrados:", filteredMenu.length);

  return (
    <div className="menu-container">
      
      {/* SECCIÓN: CATEGORÍAS Y BÚSQUEDA */}
      <section className="menu-categories-section">
        <h2 className="menu-section-title">
          <span className="menu-title-text">Nuestro Menú</span>
          <img 
            src={menuBookIcon} 
            alt="Ícono Libro Menú" 
            className="menu-title-icon" 
          />
        </h2>

        <div className="menu-categories">
          <button
            className={`menu-category-button ${activeCategory === "Todos" ? "active" : ""}`}
            onClick={() => handleCategoryChange("Todos")}
          >
            Todos
          </button>
          <button
            className={`menu-category-button ${activeCategory === "Pizzas" ? "active" : ""}`}
            onClick={() => handleCategoryChange("Pizzas")}
          >
            Pizzas
          </button>
          <button
            className={`menu-category-button ${activeCategory === "Bebidas" ? "active" : ""}`}
            onClick={() => handleCategoryChange("Bebidas")}
          >
            Bebidas
          </button>
          <button
            className={`menu-category-button ${activeCategory === "Postres" ? "active" : ""}`}
            onClick={() => handleCategoryChange("Postres")}
          >
            Postres
          </button>
        </div>
        <div className="menu-search-container">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="menu-search-input"
          />
          <img 
            src={searchIcon} 
            alt="Buscar" 
            className="menu-search-icon" 
          />
        </div>
      </section>

      {/* SECCIÓN: PRODUCTOS FILTRADOS */}
      <section className="menu-recommendation-section">
        <div className="menu-recommendation-card">
          <h3 className="recommendation-title">
            {activeCategory === 'Todos' ? 'Todos los Productos' : activeCategory}{" "}
            <img src={pizzaIcon} alt="Pizza Icon" className="menu-pizza-icon" />
          </h3>
          {loading ? (
            <div className="loading-container">
              <p>Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={fetchMenu} className="retry-button">
                Reintentar
              </button>
            </div>
          ) : filteredMenu.length > 0 ? (
            <div className="menu-card-container">
              {filteredMenu.map((item, index) => (
                <ProductsCards 
                  data={{
                    ...item,
                    nombre: item.titulo, // Compatibilidad para componentes que usan nombre en lugar de titulo
                    url_imagen: item.imagen, // Compatibilidad para componentes que usan url_imagen
                    precio: item.opciones && item.opciones.length > 0 ? item.opciones[0].precio : 0 // Usar el primer precio disponible
                  }} 
                  key={item.id || index} 
                  onCardClick={() => handleOpenModal(item)} 
                />
              ))}
            </div>
          ) : (
            <div className="no-products-message">
              <img src={pizzaIcon} alt="No hay productos" className="no-products-icon" />
              <p>No se encontraron productos {searchTerm ? `que coincidan con "${searchTerm}"` : ''} 
                 {activeCategory !== 'Todos' ? ` en la categoría "${activeCategory}"` : ''}</p>
              <p>Intenta con otra búsqueda o categoría</p>
            </div>
          )}
        </div>
      </section>

      <Footer noImage={true} />

      {/* Modal del Producto */}
      {selectedProduct && (
        <PizzaModal 
          pizza={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Menu;