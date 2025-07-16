# Recipe app with TO-DO list

This is a full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to explore and follow recipes step-by-step. The app enables users to search, filter, and view detailed recipes based on recipe name, ingredients, and difficulty.

## Features
- **View Recipes**: Browse and explore various recipes.
- **Search**: Search for recipes by name.
- **Filter**: Filter recipes based on ingredients and difficulty level.
- **Step-by-Step Instructions**: Each recipe provides step-by-step cooking instructions, including a checklist for ingredients.
- **Responsive Design**: Fully responsive UI for a seamless experience across devices.

## Technologies Used
- **Frontend**: React, CSS, Chakra UI, Axios
- **Backend**: Node.js, Express, RESTful API
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) for user authentication and session management.

## Authentication and Authoorization Middleware
- An auth middleware is set up in server side.
- When getting api requests it checks for token and user role. If neither exhists the request is denied.

## Authwatcher
- When navigating inside the app it checks if the user has a valid/non-expired token.
- If the token is not valid the user is forwarded to the landing page.

## Getting Started

### Prerequisites
Before running the application, make sure you have the following installed:
- **Node.js** and **npm**. You can download them from (Node version: v22.14.0) [here](https://nodejs.org/en).
- A browser capable of running JavaScript.

### Clone the Repository
To clone this repository, run the following commands in your terminal:
- git clone https://github.com/asitha-bandara/recipe-todo-task.git
- cd recipe-todo-task

### Running the Application:
  Run the server (Backend):
   - cd server
   - npm run server
    
  Run the client (Frontend):
   - cd client
   - npm run dev

  Open browser and navigate to:
   - [http://localhost:5173/](http://localhost:5173/)

### Account Description:
 - There are two different account types (Admin, User).
 - As of now only one admin can exhist, no more can be added.
 - New users can signup as "User".

### Admin Login:
 - Username: admin@admin.com
 - Password: adminadmin

### API Endpoints:
  Here are some of the key API routes used by the app:
 - GET /api/recipe/get-recipes - Fetch all recipes.
 - GET /api/recipes/:id - Fetch a specific recipe by its ID.
 - POST /api/recipes/add-recipe - Add a new recipe (Admin only).
 - PUT /api/edit-recipe/:id - Edit a recipe (Admin only).

### Features Demo:
 - Search Bar: Users can type in a recipe name to search.
 - Filter by Ingredients: Select specific ingredients to narrow down search results.
 - Filter by Difficulty: Recipes can be filtered by their difficulty level (e.g., Easy, Medium, Hard).
 - Detailed Recipe View: Clicking on a recipe gives you a detailed view, including ingredients and steps.

### Future Improvements:
 - User Features: Allow users to save their favorite recipes and recommend recipes to them.
 - User Reviews and Ratings: Allow users to rate and review recipes.
 - Add more filters: Allow users to filter by cooking time, dietary preferences (vegan, gluten-free, etc.), and more.
 - Internationalization: Translate the app to other languages.
 - Ability to add more admin accounts.

### Contact:
  For any questions or suggestions, please reach out to:
 - Email: asithaic@gmail.com
 - GitHub: asitha-bandara
