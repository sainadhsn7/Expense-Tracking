import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import UserDashboard from './components/UserDashboard.jsx';
import CreateGroup from './components/CreateGroup.jsx';
import GroupDashboard from './components/GroupDashBoard.jsx';
import AddMembers from './components/AddMembers.jsx';
import CreateExpense from './components/CreateExpense.jsx';
import ExpenseDetails from './components/ExpenseDetails.jsx';

function App() {
    return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user-dashboard/:id" element={<UserDashboard />} />
              <Route path="/create-group/:id" element={<CreateGroup />} />
              <Route path="/group/:groupId" element={<GroupDashboard />} />
              <Route path="/add-members/:groupId" element={<AddMembers />} />
              <Route path="/create-expense/:groupId" element={<CreateExpense />} />
              <Route path="/expense/:expenseId" element={<ExpenseDetails />} />
          </Routes>
      </Router>
    )
};

export default App;