import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "../common/Modal";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext"; 


const loginSchema = yup.object().shape({
  email: yup.string().email("Geçerli bir e-posta adresi giriniz").required("E-posta alanı zorunludur"),
  password: yup.string().min(6, "Şifre en az 6 karakter olmalıdır").required("Şifre alanı zorunludur"),
});

const registerSchema = yup.object().shape({
  name: yup.string().required("İsim alanı zorunludur"),
  email: yup.string().email("Geçerli bir e-posta adresi giriniz").required("E-posta alanı zorunludur"),
  password: yup.string().min(6, "Şifre en az 6 karakter olmalıdır").required("Şifre alanı zorunludur"),
});

export const AuthModal = ({ isOpen, onClose, initialView = "login" }) => {
  const [isLoginView, setIsLoginView] = useState(initialView === "login");

  
  const { login, register: registerUser } = useAuth();

  
  useEffect(() => {
    const resetView = async () => {
      setIsLoginView(initialView === "login");
    };
    resetView();
  }, [initialView, isOpen]);

  
  const currentSchema = isLoginView ? loginSchema : registerSchema;

 
  const {
    register, 
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(currentSchema),
    mode: "onSubmit", 
  });

  
  const handleClose = () => {
    reset();
    setIsLoginView(true);
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      if (isLoginView) {
        
        await login(data.email, data.password);
        toast.success("Başarıyla giriş yapıldı!");
      } else {
        
        await registerUser(data.email, data.password, data.name);
        toast.success("Kayıt başarıyla tamamlandı!");
      }
      
      
      handleClose();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Bu e-posta adresi zaten kullanımda.");
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error("E-posta adresi veya şifre hatalı.");
      } else {
        toast.error("Bir hata oluştu: " + error.message);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isLoginView ? "Log In" : "Registration"}
    >
      <p className="modal-subtitle">
        {isLoginView 
          ? "Welcome back! Please enter your details." 
          : "Thank you for your interest in our platform! Please provide us with the following information."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
        {/* Sadece Kayıt modunda görünecek İsim alanı */}
        {!isLoginView && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name.message}</span>}
          </div>
        )}

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <span className="error-text">{errors.password.message}</span>}
        </div>

        <button type="submit" className="btn-primary form-submit">
          {isLoginView ? "Log In" : "Sign Up"}
        </button>
      </form>

      <p className="form-switch">
        {isLoginView ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={() => setIsLoginView(!isLoginView)}>
          {isLoginView ? "Sign up" : "Log in"}
        </button>
      </p>
    </Modal>
  );
};