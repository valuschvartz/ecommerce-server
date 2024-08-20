# ecommerce-server


## Arquitectura del Proyecto

La estructura del proyecto es la siguiente:

```
supleboost/
│
├── src/
│   ├── routes/
│   │   ├── products.router.js
│   │   └── carts.router.js
│   ├── services/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── home.handlebars
│   │   └── realTimeProducts.handlebars
│   └── app.js
│
└── data/
    ├── productos.json
    └── carritos.json


```

## Endpoints de Productos

### 1. Listar todos los productos

- **Método:** GET
- **Ruta:** `/api/products`
- **Descripción:** Obtiene todos los productos disponibles.

**Ejemplo de respuesta:**

```json
[
  {
    "id": 1,
    "title": "Star Whey Protein",
    "description": "Proteína de suero de leche de alta calidad.",
    "code": "SWP001",
    "price": 50.99,
    "status": true,
    "stock": 100,
    "category": "Proteínas",
    "thumbnails": [
      "http://example.com/images/star-whey-protein-1.jpg",
      "http://example.com/images/star-whey-protein-2.jpg"
    ]
  },
  {
    "id": 2,
    "title": "Ena Creatine",
    "description": "Creatina monohidratada para mejorar el rendimiento.",
    "code": "EC002",
    "price": 29.99,
    "status": true,
    "stock": 50,
    "category": "Creatinas",
    "thumbnails": [
      "http://example.com/images/ena-creatine-1.jpg"
    ]
  },
  {
    "id": 3,
    "title": "Star BCAA",
    "description": "Aminoácidos de cadena ramificada para la recuperación muscular.",
    "code": "SBCAA003",
    "price": 39.99,
    "status": true,
    "stock": 75,
    "category": "Aminoácidos",
    "thumbnails": [
      "http://example.com/images/star-bcaa-1.jpg"
    ]
  },
  {
    "id": 4,
    "title": "Ena Glutamine",
    "description": "Glutamina para la recuperación y el fortalecimiento del sistema inmune.",
    "code": "EG004",
    "price": 25.99,
    "status": true,
    "stock": 60,
    "category": "Aminoácidos",
    "thumbnails": [
      "http://example.com/images/ena-glutamine-1.jpg"
    ]
  }
]
```

### 2. Obtener un producto específico

- **Método:** GET
- **Ruta:** `/api/products/:pid`
- **Descripción:** Obtiene un producto por su ID.

**Ejemplo de respuesta:**

```json
{
  "id": 1,
  "title": "Star Whey Protein",
  "description": "Proteína de suero de leche de alta calidad.",
  "code": "SWP001",
  "price": 50.99,
  "status": true,
  "stock": 100,
  "category": "Proteínas",
  "thumbnails": [
    "http://example.com/images/star-whey-protein-1.jpg",
    "http://example.com/images/star-whey-protein-2.jpg"
  ]
}
```

### 3. Crear un nuevo producto

- **Método:** POST
- **Ruta:** `/api/products`
- **Descripción:** Crea un nuevo producto.

**Cuerpo de la solicitud:**

```json
{
  "title": "Nuevo Producto",
  "description": "Descripción del nuevo producto.",
  "code": "NP001",
  "price": 99.99,
  "status": true,
  "stock": 30,
  "category": "Suplementos",
  "thumbnails": [
    "http://example.com/images/nuevo-producto.jpg"
  ]
}
```

**Ejemplo de respuesta:**

```json
{
  "message": "Producto creado exitosamente",
  "payload": {
    "id": 5,
    "title": "Nuevo Producto",
    "description": "Descripción del nuevo producto.",
    "code": "NP001",
    "price": 99.99,
    "status": true,
    "stock": 30,
    "category": "Suplementos",
    "thumbnails": [
      "http://example.com/images/nuevo-producto.jpg"
    ]
  }
}
```

### 4. Actualizar un producto

- **Método:** PUT
- **Ruta:** `/api/products/:pid`
- **Descripción:** Actualiza un producto existente por su ID.

**Cuerpo de la solicitud:**

```json
{
  "title": "Producto Actualizado",
  "description": "Descripción actualizada.",
  "code": "PA001",
  "price": 89.99,
  "status": true,
  "stock": 25,
  "category": "Suplementos",
  "thumbnails": [
    "http://example.com/images/producto-actualizado.jpg"
  ]
}
```

**Ejemplo de respuesta:**

```json
{
  "message": "Producto actualizado exitosamente",
  "payload": {
    "id": 1,
    "title": "Producto Actualizado",
    "description": "Descripción actualizada.",
    "code": "PA001",
    "price": 89.99,
    "status": true,
    "stock": 25,
    "category": "Suplementos",
    "thumbnails": [
      "http://example.com/images/producto-actualizado.jpg"
    ]
  }
}
```

### 5. Eliminar un producto

- **Método:** DELETE
- **Ruta:** `/api/products/:pid`
- **Descripción:** Elimina un producto por su ID.

**Ejemplo de respuesta:**

```json
{
  "message": "Producto eliminado exitosamente"
}
```

## Endpoints de Carritos

### 1. Crear un nuevo carrito

- **Método:** POST
- **Ruta:** `/api/carts`
- **Descripción:** Crea un nuevo carrito.

**Ejemplo de respuesta:**

```json
{
  "id": 1,
  "products": []
}
```

### 2. Obtener productos de un carrito específico

- **Método:** GET
- **Ruta:** `/api/carts/:cid`
- **Descripción:** Obtiene los productos de un carrito por su ID.

**Ejemplo de respuesta:**

```json
{
  "products": [
    {
      "product": 2,
      "quantity": 1
    }
  ]
}
```

### 3. Agregar un producto a un carrito

- **Método:** POST
- **Ruta:** `/api/carts/:cid/product/:pid`
- **Descripción:** Agrega un producto a un carrito por su ID.

**Ejemplo de respuesta:**

```json
{
  "id": 1,
  "products": [
    {
      "product": 2,
      "quantity": 2
    }
  ]
}
```
