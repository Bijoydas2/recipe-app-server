
# 🍽️ Recipe Book API

A simple and efficient RESTful API built with **Express.js** and **MongoDB** to manage recipes — including features like top liked recipes, adding, editing, deleting, and tracking user-specific items.

---

## 🚀 Live Server

> Deployed at: (https://recipe-book-app-server-eight.vercel.app )

---

## 📦 Features

- ✅ Get top 6 recipes sorted by likes
- ✅ Get all recipes
- ✅ View single recipe details by ID
- ✅ Add new recipe (likes default to 0)
- ✅ Like a recipe (increment likes)
- ✅ View recipes created by a specific user
- ✅ Delete a recipe
- ✅ Update a recipe
- ✅ Get overview statistics (total items, total likes, user-specific count)

---

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB (with MongoDB Atlas)**
- **dotenv** for environment variables
- **CORS** for cross-origin access

---

## 🧪 API Endpoints

### 📖 Public Endpoints

| Method | Endpoint                      | Description                            |
|--------|-------------------------------|----------------------------------------|
| GET    | `/`                           | Root route                             |
| GET    | `/top-recipes`               | Top 6 recipes sorted by likes          |
| GET    | `/recipes`                   | Get all recipes                        |
| GET    | `/recipes/:id`               | Get recipe by ID                       |
| PATCH  | `/recipes/:id/like`          | Increment likes for a recipe           |

---

### 🔐 User-Specific Endpoints

| Method | Endpoint                      | Description                            |
|--------|-------------------------------|----------------------------------------|
| GET    | `/api/my-recipes?email=`     | Get recipes created by a specific user |
| DELETE | `/api/recipes/:id`           | Delete recipe by ID                    |
| PUT    | `/api/recipes/:id`           | Update recipe                          |
| GET    | `/api/stats?email=`          | Get dashboard stats                    |

---

## 🧾 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_USER=your_mongodb_user
DB_PASS=your_mongodb_password














































































