import React, { useState, useMemo } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Pagination from './components/Pagination';
import useLocalStorage from './hooks/useLocalStorage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ButtonGroup, Button, Container, Row, Col, Card } from 'react-bootstrap'; // Importa componentes de Bootstrap

function App() {
  const [products, setProducts] = useLocalStorage('products', []);
  const [editingProduct, setEditingProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'asc', 'desc'

  const sortedProducts = useMemo(() => {
    let sortableProducts = [...products];

    if (sortOrder === 'asc') {
      sortableProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
      sortableProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
    return sortableProducts;
  }, [products, sortOrder]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = (order) => {
    setSortOrder(order);
    setCurrentPage(1); // Volver a la primera página al cambiar el orden
  };

  const addOrUpdateProduct = (product) => {
    setProducts((prevProducts) => {
      if (product.id) {
        return prevProducts.map((p) => (p.id === product.id ? product : p));
      } else {
        return [...prevProducts, { ...product, id: Date.now() }];
      }
    });
    setEditingProduct(null);
  };

  const deleteProduct = (id) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.filter((product) => product.id !== id);
      // Ajusta la página actual si la última de la página se eliminó
      const totalPages = Math.ceil(updatedProducts.length / productsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (updatedProducts.length === 0) {
        setCurrentPage(1); // Si no quedan productos, vuelve a la página 1
      }
      return updatedProducts;
    });
  };

  const editProduct = (product) => {
    setEditingProduct(product);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  return (
    //Container para centrar el contenido y aplicar padding
    <Container className="my-5"> {/* my-5 para margin-top y margin-bottom */}
      <h1 className="mb-4 text-center text-primary"> {/* mb-4 para margin-bottom, text-center, text-primary para color */}
        <i className="bi bi-box-seam me-2"></i> {/* Icono de Bootstrap, si tienes bootstrap-icons */}
        Catálogo de Productos
      </h1>
      <Row className="justify-content-center"> {/* justify-content-center para centrar las columnas */}
        <Col md={5} className="mb-4"> {/* mb-4 para margin-bottom en pantallas medianas */}
          <Card className="shadow-sm border-0"> {/* shadow-sm para una sombra sutil, border-0 para sin borde */}
            <Card.Header className="bg-primary text-white py-3"> {/* Fondo primario, texto blanco, padding */}
              <h2 className="mb-0 fs-5">{editingProduct ? 'Editar Producto' : 'Registrar Nuevo Producto'}</h2> {/* fs-5 para tamaño de fuente más pequeño */}
            </Card.Header>
            <Card.Body>
              <ProductForm
                onSubmit={addOrUpdateProduct}
                productToEdit={editingProduct}
                onCancelEdit={cancelEditing}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light py-3 d-flex justify-content-between align-items-center"> {/* bg-light para fondo claro, d-flex para flexbox, justify-content-between para espaciar, align-items-center para alinear verticalmente */}
              <h2 className="mb-0 fs-5">Listado de Productos</h2>
              <ButtonGroup aria-label="Order products">
                <Button
                  variant={sortOrder === 'asc' ? 'primary' : 'outline-primary'}
                  onClick={() => handleSort('asc')}
                  size="sm" // Botones más pequeños
                >
                  <i className="bi bi-sort-alpha-down"></i> A-Z
                </Button>
                <Button
                  variant={sortOrder === 'desc' ? 'primary' : 'outline-primary'}
                  onClick={() => handleSort('desc')}
                  size="sm"
                >
                  <i className="bi bi-sort-alpha-up"></i> Z-A
                </Button>
                <Button
                  variant={sortOrder === 'none' ? 'secondary' : 'outline-secondary'}
                  onClick={() => handleSort('none')}
                  size="sm"
                >
                  <i className="bi bi-arrow-clockwise"></i> Reset
                </Button>
              </ButtonGroup>
            </Card.Header>
            <Card.Body>
              {products.length === 0 ? (
                <p className="text-muted text-center py-4">No hay productos registrados aún.</p>
              ) : (
                <>
                  <ProductList
                    products={currentProducts}
                    onEdit={editProduct}
                    onDelete={deleteProduct}
                  />
                  <Pagination
                    productsPerPage={productsPerPage}
                    totalProducts={products.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;