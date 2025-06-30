import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap'; // Asegúrate de tener Row y Col si los usas en el futuro

function ProductForm({ onSubmit, productToEdit, onCancelEdit }) {
  const initialFormState = {
    name: '',
    price: '',
    supplierEmail: '',
    entryDate: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio.';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0.';
    } else if (isNaN(formData.price)) {
      newErrors.price = 'El precio debe ser un valor numérico.';
    }
    if (!formData.supplierEmail.trim()) {
      newErrors.supplierEmail = 'El correo del proveedor es obligatorio.';
    } else if (!emailRegex.test(formData.supplierEmail)) {
      newErrors.supplierEmail = 'Formato de correo electrónico inválido.';
    }
    if (!formData.entryDate) {
      newErrors.entryDate = 'La fecha de ingreso es obligatoria.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formProductName"> {/* mb-3 para margen inferior */}
        <Form.Label>Nombre del Producto</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          isInvalid={!!errors.name} // isInvalid aplica los estilos de validación de Bootstrap
        />
        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formProductPrice">
        <Form.Label>Precio</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          isInvalid={!!errors.price}
        />
        <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formSupplierEmail">
        <Form.Label>Correo del Proveedor</Form.Label>
        <Form.Control
          type="email"
          name="supplierEmail"
          value={formData.supplierEmail}
          onChange={handleChange}
          isInvalid={!!errors.supplierEmail}
        />
        <Form.Control.Feedback type="invalid">{errors.supplierEmail}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formEntryDate">
        <Form.Label>Fecha de Ingreso</Form.Label>
        <Form.Control
          type="date"
          name="entryDate"
          value={formData.entryDate}
          onChange={handleChange}
          isInvalid={!!errors.entryDate}
        />
        <Form.Control.Feedback type="invalid">{errors.entryDate}</Form.Control.Feedback>
      </Form.Group>

      <div className="d-grid gap-2 d-md-block mt-4"> {/* d-grid para botones apilados, gap-2 para espacio entre ellos, d-md-block para que sean bloque en md+ */}
        <Button variant="primary" type="submit" className="me-md-2 mb-2 mb-md-0"> {/* me-md-2 para margen a la derecha en md+, mb-2 para margen inferior en móviles */}
          {productToEdit ? 'Guardar Cambios' : 'Añadir Producto'}
        </Button>
        {productToEdit && (
          <Button variant="secondary" onClick={onCancelEdit}>
            Cancelar Edición
          </Button>
        )}
      </div>
    </Form>
  );
}

export default ProductForm;