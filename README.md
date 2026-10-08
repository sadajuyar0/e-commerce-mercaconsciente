# Mercaconsciente

Demo estática de catálogo y pedidos para conectar pequeños productores locales con clientes interesados en productos naturales. La oferta se importa de la matriz SEP-OCT 2026; la app no procesa pagos ni valida transferencias.

## Alcance funcional

- Home con accesos al catálogo y al proyecto.
- Catálogo con búsqueda, filtro por categoría y orden por precio.
- Fichas estáticas de producto con productor, presentación, precio y disponibilidad.
- Carrito persistido en `localStorage`: agregar, quitar, cambiar cantidades y calcular subtotal.
- Confirmación de pedido con datos de entrega, código local y estado pendiente de pago; el último recibo se restaura en el navegador.
- Información de pago manual, iniciativa y contacto. Sin autenticación ni validación de transferencias.

## Decisiones técnicas

- Astro genera HTML estático para cada ruta y producto; React se reserva para controles que necesitan estado en el navegador.
- Nanostores mantiene el carrito, compartido entre islas React y persistido en `localStorage`.
- Los servicios consumen módulos de datos locales. Pueden reemplazarse por un cliente HTTP manteniendo las firmas que usa la UI.
- El pedido queda en el navegador como demostración, con estado `pending_payment`; no se crea un registro remoto.
- UI → servicios → datos: `productService.ts` es el límite entre componentes y mocks; puede cambiarse a HTTP conservando sus firmas.
- No se crea pedido remoto. El código y estado `pending_payment` solo se guardan en `localStorage` y no garantizan que la administradora lo reciba.
- Los datos de pago reales (cuenta o llave Bre-B) no fueron proporcionados. La demo indica que no se debe transferir dinero con datos de prueba.
- “Stock Abierto” se conserva como disponibilidad no cuantificada. Cantidades vacías no se inventan.

## Arquitectura

```text
public/
	favicon.svg
	images/market-cover.svg
src/
	components/
		cart/CartDrawer.tsx
		cart/CheckoutForm.tsx
		layout/Header.tsx
		layout/Footer.tsx
		products/ProductCard.tsx
		products/ProductCatalog.tsx
		products/ProductDetailActions.tsx
	data/
		offers.json
		categories.ts
	layouts/MainLayout.astro
	pages/
		index.astro
		shop.astro
		product/[id].astro
		cart.astro
		checkout.astro
		about.astro
		contact.astro
	services/productService.ts
	store/cartStore.ts
	types/ecommerce.ts
	utils/format.ts
	styles/global.css
scripts/extract-catalog.ps1
```

## Catálogo y Excel

Se exportaron 344 ofertas. Se conservan productor, teléfono, descripción original, presentación, precio, disponibilidad y fila de origen. Los identificadores se derivan de la fila; el nombre visible elimina etiquetas editoriales y, cuando puede, el texto de ingredientes, que permanece en la descripción completa.

El Excel no incluye imágenes ni categorías. La categoría se deriva de palabras del producto; las tarjetas usan fotografías remotas ilustrativas y las etiquetan como imágenes de referencia. La portada SVG también es una ilustración de referencia. Los 90 valores “Stock Abierto” no se convierten en cantidades. Se mantienen 2 stocks desconocidos, 1 precio y 1 presentación faltantes, sin inventar valores.

Regenera `src/data/offers.json` desde PowerShell con `./scripts/extract-catalog.ps1`; acepta los parámetros `-WorkbookPath` y `-OutputPath`.

## Desarrollo y validación

Requiere Node.js 20.3+ y Corepack. En el entorno de trabajo la instalación global de npm está incompleta; utiliza pnpm mediante Corepack:

```bash
corepack pnpm install
corepack pnpm dev
```

Abre la URL local que imprime Astro. Para comprobar la salida estática:

```bash
corepack pnpm check
corepack pnpm build
corepack pnpm preview
```

No se inició el servidor porque el workspace requiere confirmación antes de lanzar la app. Al desplegar, configura `site` en `astro.config.mjs` para habilitar URLs canónicas y Open Graph absolutas. Limpia el almacenamiento del navegador para reiniciar la demo.