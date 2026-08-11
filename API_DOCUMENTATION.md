# API Documentation — SCIC/EJP-13 Backend Project

Base URL (local): `http://localhost:5000/api`
Base URL (production): `<your-deployed-url>/api`

All responses follow this shape:
```json
{
  "success": true,
  "message": "Description of what happened",
  "data": {}
}
```

Authenticated routes require a header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Auth

### Register
`POST /auth/register`

Request Body:
```json
{
  "name": "Rakib Hasan",
  "email": "rakib@example.com",
  "password": "Password123",
  "phone": "01700000000",
  "address": "Rangpur, Bangladesh"
}
```
Response: `201 Created`
```json
{ "success": true, "message": "User registered successfully", "data": { "user": {}, "token": "..." } }
```

### Login
`POST /auth/login`

Request Body:
```json
{ "email": "rakib@example.com", "password": "Password123" }
```
Response: `200 OK` — same shape as register.
Errors: `404` (no account), `401` (wrong password)

---

## Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | Admin | Get all users (paginated) |
| GET | `/users/:id` | User/Admin | Get single user |
| PATCH | `/users/:id` | User/Admin | Update name/phone/address |
| DELETE | `/users/:id` | Admin | Soft delete a user |

Query params for `GET /users`: `?page=1&limit=10`

---

## Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/categories` | Admin | Create category |
| GET | `/categories` | Public | Get all categories |
| GET | `/categories/:id` | Public | Get category by id |
| PATCH | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Soft delete category |

Create Request Body:
```json
{ "name": "Electronics", "description": "Gadgets and devices" }
```

---

## Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/products` | Admin | Create product |
| GET | `/products` | Public | Get all products (filter/search/paginate) |
| GET | `/products/:id` | Public | Get product by id (with reviews) |
| PATCH | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Soft delete product |

Query params for `GET /products`: `?page=1&limit=10&search=phone&categoryId=<id>&minPrice=10&maxPrice=500`

Create Request Body:
```json
{
  "name": "Wireless Headphones",
  "description": "Noise-cancelling",
  "price": 99.99,
  "stock": 50,
  "imageUrl": "https://...",
  "categoryId": "<category-id>"
}
```

---

## Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/reviews` | User/Admin | Create review |
| GET | `/reviews` | Public | Get all reviews (filter by productId) |
| GET | `/reviews/:id` | Public | Get review by id |
| PATCH | `/reviews/:id` | Owner | Update own review |
| DELETE | `/reviews/:id` | Owner/Admin | Soft delete review |

Create Request Body:
```json
{ "productId": "<product-id>", "rating": 5, "comment": "Great product!" }
```

---

## Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | User/Admin | Place an order (multi-item, transactional) |
| GET | `/orders` | User/Admin | Get orders (users see only their own) |
| GET | `/orders/:id` | User/Admin | Get order by id |
| PATCH | `/orders/:id/status` | Admin | Update order status |
| DELETE | `/orders/:id` | Admin | Soft delete order |

Create Request Body:
```json
{
  "address": "Dhaka, Bangladesh",
  "items": [
    { "productId": "<product-id>", "quantity": 2 },
    { "productId": "<product-id-2>", "quantity": 1 }
  ]
}
```
Update Status Body:
```json
{ "status": "CONFIRMED" }
```
Valid statuses: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (role/ownership check failed) |
| 404 | Not Found |
| 500 | Internal Server Error |
