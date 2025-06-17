import React, { useState, useEffect, useMemo } from 'react';
import ProductsCards from '../productsCards/productsCards';
import Footer from '../footer/footer';
import PizzaModal from '../PizzaModal/PizzaModal';
import menuBookIcon from '../../assets/menuBook.png';
import searchIcon from '../../assets/search.png';
import './Menu.css';

const Menu = ({ onAddToCart, user }) => {
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
      
      if (activeCategory === 'Complementos' && 
          (titulo.includes('sticks') || titulo.includes('complemento') || 
           titulo.includes('pan') || titulo.includes('papas') || 
           descripcion.includes('complemento'))) {
        return true;
      }
      
      if (activeCategory === 'Bebidas' && 
          (titulo.includes('bebida') || titulo.includes('refresco') || 
           titulo.includes('agua') || titulo.includes('soda') || 
           titulo.includes('cerveza') || titulo.includes('jugo') || 
           descripcion.includes('bebida'))) {
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
    console.log("ID del producto:", product.id);
    console.log("Propiedades del producto:", Object.keys(product));
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
      {/* HEADER DEL MENÚ */}
      <div className="menu-header">
        <h1 className="menu-main-title">
          <img 
            src={menuBookIcon} 
            alt="Ícono Libro Menú" 
            className="menu-title-icon" 
          />
          Nuestro Menú
        </h1>
        <p className="menu-subtitle">Descubre nuestros deliciosos sabores</p>
      </div>      {/* SECCIÓN: FILTROS Y BÚSQUEDA */}
      <section className="menu-filters-section">
        <div className="menu-search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Buscar productos..."
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
        </div>
        
        <div className="menu-categories">
          {['Todos', 'Pizzas', 'Bebidas', 'Complementos'].map((category) => (
            <button
              key={category}
              className={`menu-category-button ${activeCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* SECCIÓN: PRODUCTOS */}
      <section className="menu-products-section">        <div className="menu-products-header">
          <h2 className="products-section-title">
            {activeCategory === 'Todos' ? 'Todos nuestros Productos' : `Categoría: ${activeCategory}`}
          </h2>
        </div>

        <div className="menu-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando productos deliciosos...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h3>¡Ups! Algo salió mal</h3>
              <p>{error}</p>
              <button onClick={fetchMenu} className="retry-button">
                <span>🔄</span> Reintentar
              </button>
            </div>
          ) : filteredMenu.length > 0 ? (
            <div className="menu-grid">
              {filteredMenu.map((item, index) => (
                <ProductsCards 
                  data={{
                    ...item,
                    nombre: item.titulo,
                    url_imagen: item.imagen,
                    precio: item.opciones && item.opciones.length > 0 ? item.opciones[0].precio : 0
                  }} 
                  key={item.id || index} 
                  onCardClick={(productData) => handleOpenModal(productData)} 
                />
              ))}
            </div>
          ) : (
            <div className="no-products-container">
              <div className="no-products-icon">🍕</div>
              <h3>No encontramos productos</h3>
              <p>
                No hay productos disponibles
                {searchTerm && <span> que coincidan con "<strong>{searchTerm}</strong>"</span>}
                {activeCategory !== 'Todos' && <span> en la categoría <strong>{activeCategory}</strong></span>}
              </p>
              <div className="no-products-suggestions">
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="clear-search-button"
                  >
                    Limpiar búsqueda
                  </button>
                )}
                {activeCategory !== 'Todos' && (
                  <button 
                    onClick={() => handleCategoryChange('Todos')}
                    className="show-all-button"
                  >
                    Ver todos los productos
                  </button>
                )}
              </div>
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
          user={user}
        />
      )}
    </div>
  );
};

export default Menu;