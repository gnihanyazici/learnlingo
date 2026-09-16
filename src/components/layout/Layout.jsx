import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AuthModal } from "../auth/AuthModal";

export const Layout = () => {
  const { currentUser, logout } = useAuth();
  
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState("login"); 

  const handleOpenModal = (view) => {
    setModalView(view);
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="main-header">
        <div className="logo">
          <Link to="/">LearnLingo</Link>
        </div>
        
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/teachers">Teachers</Link>
          {currentUser && <Link to="/favorites">Favorites</Link>}
        </nav>

        <div className="auth-actions">
          {currentUser ? (
            <button onClick={logout} className="btn-logout">Log out</button>
          ) : (
            <>
              <button 
                className="btn-login" 
                onClick={() => handleOpenModal("login")}
              >
                Log in
              </button>
              <button 
                className="btn-register" 
                onClick={() => handleOpenModal("register")}
              >
                Registration
              </button>
            </>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialView={modalView} 
      />
    </>
  );
};