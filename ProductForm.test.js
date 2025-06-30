import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from './ProductForm';

// Pruebas para el componente ProductForm
describe('ProductForm', () => {

  // Prueba 1: Verifica que todos los campos del formulario y el botón se renderizan correctamente
  test('renders all form fields and submit button', () => {
    render(<ProductForm onSubmit={() => {}} />); // Renderiza el componente, pasando una función vacía para onSubmit

    // Busca los elementos por su etiqueta (label) o rol
    expect(screen.getByLabelText(/nombre del producto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/precio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo del proveedor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha de ingreso/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /añadir producto/i })).toBeInTheDocument();
  });

  // Prueba 2: Verifica que se muestren errores de validación para campos vacíos al enviar
  test('shows validation errors for empty fields on submit', async () => {
    const mockOnSubmit = jest.fn(); // Creamos una función mock para onSubmit
    render(<ProductForm onSubmit={mockOnSubmit} />);

    // Simula un clic en el botón de enviar
    fireEvent.click(screen.getByRole('button', { name: /añadir producto/i }));

    // Busca a que los mensajes de error aparezcan en el DOM
    // `findByText` es asíncrono y espera a que el elemento aparezca
    expect(await screen.findByText(/el nombre del producto es obligatorio./i)).toBeInTheDocument();
    expect(await screen.findByText(/el precio debe ser un número mayor a 0./i)).toBeInTheDocument();
    expect(await screen.findByText(/el correo del proveedor es obligatorio./i)).toBeInTheDocument();
    expect(await screen.findByText(/la fecha de ingreso es obligatoria./i)).toBeInTheDocument();

    // Busca que onSubmit NO fue llamado porque la validación falló
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // Prueba 3: Verifica que se muestre un error para un formato de correo inválido
  test('shows validation error for invalid email format', async () => {
    const mockOnSubmit = jest.fn();
    render(<ProductForm onSubmit={mockOnSubmit} />);

    // Escribe un correo electrónico con formato inválido
    fireEvent.change(screen.getByLabelText(/correo del proveedor/i), { target: { value: 'invalid-email' } });
    // Llena los otros campos para que solo falle el email
    fireEvent.change(screen.getByLabelText(/nombre del producto/i), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText(/precio/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/fecha de ingreso/i), { target: { value: '2025-01-01' } });


    fireEvent.click(screen.getByRole('button', { name: /añadir producto/i }));

    expect(await screen.findByText(/formato de correo electrónico inválido./i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // Prueba 4: Verifica que onSubmit se llama con los datos correctos cuando el formulario es válido
  test('calls onSubmit with correct data when form is valid', async () => {
    const mockOnSubmit = jest.fn(); // Crea una función mock para verificar si es llamada
    render(<ProductForm onSubmit={mockOnSubmit} />);

    // Simula la escritura en cada campo
    fireEvent.change(screen.getByLabelText(/nombre del producto/i), { target: { value: 'Laptop Gaming' } });
    fireEvent.change(screen.getByLabelText(/precio/i), { target: { value: '1500.50' } });
    fireEvent.change(screen.getByLabelText(/correo del proveedor/i), { target: { value: 'ventas@gamingtech.com' } });
    fireEvent.change(screen.getByLabelText(/fecha de ingreso/i), { target: { value: '2025-07-01' } });

    // Simula el envío del formulario
    fireEvent.click(screen.getByRole('button', { name: /añadir producto/i }));

    // Espera a que onSubmit sea llamado
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1); // Verifica que onSubmit fue llamado una vez
      expect(mockOnSubmit).toHaveBeenCalledWith({ // Verifica que fue llamado con los datos correctos
        name: 'Laptop Gaming',
        price: '1500.50', // Los valores de los inputs son strings
        supplierEmail: 'ventas@gamingtech.com',
        entryDate: '2025-07-01',
      });
    });

    // Verifica que el formulario se resetea después de un envío exitoso (para añadir nuevo)
    expect(screen.getByLabelText(/nombre del producto/i)).toHaveValue('');
    expect(screen.getByLabelText(/precio/i)).toHaveValue(null); // Los inputs de tipo number se resetean a null
    expect(screen.getByLabelText(/correo del proveedor/i)).toHaveValue('');
    expect(screen.getByLabelText(/fecha de ingreso/i)).toHaveValue('');
  });

  // Prueba 5: Verifica que el formulario se precarga con datos cuando se pasa productToEdit
  test('pre-fills form when productToEdit is provided', () => {
    const product = {
      id: 1,
      name: 'Teclado Mecánico',
      price: '120',
      supplierEmail: 'teclados@proveedor.com',
      entryDate: '2024-05-20',
    };
    render(<ProductForm onSubmit={() => {}} productToEdit={product} />);

    expect(screen.getByLabelText(/nombre del producto/i)).toHaveValue('Teclado Mecánico');
    expect(screen.getByLabelText(/precio/i)).toHaveValue(120); // Los inputs de tipo number devuelven números
    expect(screen.getByLabelText(/correo del proveedor/i)).toHaveValue('teclados@proveedor.com');
    expect(screen.getByLabelText(/fecha de ingreso/i)).toHaveValue('2024-05-20');
    // El botón de enviar debe cambiar a "Guardar Cambios"
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar edición/i })).toBeInTheDocument();
  });
});