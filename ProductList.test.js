import React from 'react';
import { Table, Button } from 'react-bootstrap';

function ProductList({ products, onEdit, onDelete }) {
  return (
    <Table striped bordered hover responsive className="text-nowrap"> {/* text-nowrap para evitar saltos de línea en celdas */}
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Correo del Proveedor</th>
          <th>Fecha de Ingreso</th>
          <th className="text-center">Acciones</th> {/* Centrar el encabezado*/}
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center text-muted py-3"> {/* py-3 para padding vertical */}
              No hay productos en esta página.
            </td>
          </tr>
        ) : (
          products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${parseFloat(product.price).toFixed(2)}</td>
              <td>{product.supplierEmail}</td>
              <td>{product.entryDate}</td>
              <td className="text-center"> {/* Centrar los botones de acciones */}
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(product)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(product.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default ProductList;