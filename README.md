# L&M Importadora V1.3.1

Sistema comercial online privado para inventario, ventas, importaciones, catálogo PDF y coordinación de stock entre sucursales.

## Stack
- GitHub Pages
- Supabase Auth
- PostgreSQL + Row Level Security
- Supabase Storage para imágenes
- jsPDF para catálogo comercial

## Funciones actuales
- Registro autónomo por correo y contraseña.
- Creación de perfil interno y selección de sucursal.
- Sucursales iniciales: Santa Cruz, Cochabamba, La Paz y Sucre.
- Inventario independiente por sucursal.
- Productos genéricos: nombre, categoría, marca, modelo, variante, SKU y descripción.
- Hasta 3 imágenes por producto; la primera funciona como miniatura principal.
- Costo de origen, flete/logística, aduana/impuestos y otros gastos.
- Costo puesto en Bolivia y cálculo de márgenes.
- Precio unitario, mayorista y distribuidor.
- Ventas con descuento automático de stock y registro de movimientos.
- Importaciones por lote, proveedor, país, moneda, tipo de cambio y gastos comunes.
- Distribución proporcional de gastos de importación y actualización del costo promedio al recibir el lote.
- Catálogo PDF negro/dorado con hasta 3 imágenes por producto y precios comerciales.
- Red L&M con permisos opcionales para visualizar stock/precios, solicitar mercadería y confirmar transferencias.

## Seguridad
- Datos protegidos con RLS.
- Cada sucursal controla su inventario.
- Las funciones de transferencia requieren sesión autenticada.

## Estado
V1.3.1 — integración online activa y estabilización del flujo de perfiles, importaciones, catálogo e inventarios compartidos.
