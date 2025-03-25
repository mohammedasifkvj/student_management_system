# Student Management System (MERN Stack)

## **Overview**  
The Student Management System is a web application that allows admins to manage students and assign tasks. It has two main interfaces:  
- **Admin Panel**: Admins can log in, create students, and assign tasks with deadlines.  
- **Student Interface**: Students can log in to view and manage tasks, including marking them as completed.  

---

## **Tech Stack**  

### **Frontend**:  
- React.js (with Redux Toolkit for state management)  
- Tailwind CSS (for styling)  
- Axios (for API requests)  
- React Router (for navigation)  

### **Backend**:  
- Node.js (with Express.js for API creation)  
- MongoDB Atlas(Database using Mongoose ORM)  
- JWT (for authentication and authorization)  
- Bcryptjs (for password hashing)  

### **Other Tools**:  
- Dotenv (for environment variables)  
- Nodemon (for backend development)  
- Postman (for API testing)  

---

##  **Project Structure**  

```bash
student-management-system/
├── server/                    # Backend
│   ├── config/                # Database and CORS config
│   │   ├── datbaseb.js
│   │   ├── dotenv.js
│   │   ├── corsConfig.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── studentController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── studentModel.js
│   │   ├── taskModel.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── studentRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   ├── server.js
|   ├── .env
|   ├── package.json
|   ├── package-lock.json
|
├── client/                     # Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.js
│   │   ├── index.js
|   ├── .env
|   ├── package.json
|   ├── package-lock.json
|
├── README.md
```

---

## ✨ **Features**  

### **Admin Panel**
- Login using JWT authentication  
- Create student accounts  
- Assign tasks to students with due dates  
- View student lists and their tasks  
- Track the status of tasks (Pending, Completed, Overdue)  

### **Student Interface**
- Login using JWT authentication  
- View assigned tasks with due dates and status  
- Mark tasks as **Completed**  
- Track overdue tasks  

---

## ⚙️ **Environment Variables (.env)**

Create a `.env` file in both **server** and **client** folders and configure as below:  

### **Server**
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/student_management
JWT_SECRET=your_jwt_secret
```

### **Client**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚦 **Installation and Setup**

1. **Clone the repository**  
    ```bash
    git clone https://github.com/mohammedasifkvj/student_management_system
    cd student-management-system
    ```

2. **Install Dependencies**  
    - Backend:
      ```bash
      cd server
      npm install
      ```
    - Frontend:
      ```bash
      cd ../client
      npm install
      ```

3. **Set Up Environment Variables**  
    Create `.env` files using the examples provided above.

4. **Run the Application**  
    ```bash
    # Run both frontend and backend
    npm run dev
    ```

5. **Access the Application**  
    - Frontend: `http://localhost:8001`  
    - Backend API: `http://localhost:8000/api`

---

## 🧪 **API Endpoints**  

### **Admin Routes**
| Endpoint                  | Method | Description                         | Auth Required |
|----------------------------|--------|------------------------------------|---------------|
| `/api/admin/signin`        | POST   | Admin login                        | ❌            |
| `/api/admin/createStudent` | POST   | Create a new student               | ✅            |
| `/api/admin/assignTask`    | POST   | Assign task to a student           | ✅            |
| `/api/admin/studentsList`  | GET    | Get all students                   | ✅            |
| `/api/admin/showTask/:id`  | GET    | Get all tasks for a student        | ✅            |

### **Student Routes**
| Endpoint                   | Method | Description                         | Auth Required |
|-----------------------------|--------|------------------------------------|---------------|
| `/api/student/signin`       | POST   | Student login                      | ❌            |
| `/api/student/getTasks`     | GET    | View assigned tasks                | ✅            |
|`/student/updateTask/:taskId`| PUT    | Mark task as completed             | ✅            |

---

## 🛡️ **Security Features**

- Passwords are hashed using **bcrypt.js**  
- JWT-based authentication with expiration time  
- Protected routes using **authMiddleware.js**  
- CORS configuration for secure API access  

---

## ⚡ **Future Enhancements**  
- Add task notifications using WebSockets  
- Implement admin dashboard with graphs and reports  
- Add student profile management  

---

## **Troubleshooting**

- **MongoDB not running?**  
  ```bash
  sudo service mongod start
  ```
- **Error: JWT Expired?**  
  - Ensure correct `JWT_SECRET` and token expiry time are set in `.env`
- **CORS Issues?**  
  - Verify your CORS configuration in `corsConfig.js`

---