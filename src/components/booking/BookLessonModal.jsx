import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "../common/Modal";
import toast from "react-hot-toast";

const bookingSchema = yup.object().shape({
  reason: yup.string().required("Lütfen bir neden seçin"),
  fullName: yup.string().required("Tam ad alanı zorunludur"),
  email: yup.string().email("Geçerli bir e-posta adresi giriniz").required("E-posta alanı zorunludur"),
  phone: yup.string().required("Telefon numarası zorunludur"),
});

export const BookLessonModal = ({ isOpen, onClose, teacher }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(bookingSchema),
    mode: "onSubmit",
  });

  
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = (data) => {
    console.log("Rezervasyon Bilgileri:", data);
    toast.success("Deneme dersi talebiniz başarıyla alındı!");
    onClose();
  };

  if (!teacher) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book trial lesson">
      <p className="modal-subtitle">
        Our experienced tutor will assess your current language level, discuss your learning goals, and tailor the lesson to your specific needs.
      </p>

      <div className="booking-teacher-info">
        <img src={teacher.avatar_url} alt={teacher.name} className="booking-avatar" />
        <div>
          <span className="subject">Your teacher</span>
          <h4>{teacher.name} {teacher.surname}</h4>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="booking-form" noValidate>
        
        <div className="form-group radio-group">
          <h3>What is your main reason for learning English?</h3>
          <label>
            <input type="radio" value="Career and business" {...register("reason")} /> Career and business
          </label>
          <label>
            <input type="radio" value="Lesson for kids" {...register("reason")} /> Lesson for kids
          </label>
          <label>
            <input type="radio" value="Living abroad" {...register("reason")} /> Living abroad
          </label>
          <label>
            <input type="radio" value="Exams and coursework" {...register("reason")} /> Exams and coursework
          </label>
          <label>
            <input type="radio" value="Culture, travel or hobby" {...register("reason")} /> Culture, travel or hobby
          </label>
          {errors.reason && <span className="error-text">{errors.reason.message}</span>}
        </div>

        <div className="form-group">
          <input type="text" placeholder="Full Name" {...register("fullName")} className={errors.fullName ? "input-error" : ""} />
          {errors.fullName && <span className="error-text">{errors.fullName.message}</span>}
        </div>

        <div className="form-group">
          <input type="email" placeholder="Email" {...register("email")} className={errors.email ? "input-error" : ""} />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <input type="tel" placeholder="Phone number" {...register("phone")} className={errors.phone ? "input-error" : ""} />
          {errors.phone && <span className="error-text">{errors.phone.message}</span>}
        </div>

        <button type="submit" className="btn-primary form-submit">
          Book
        </button>
      </form>
    </Modal>
  );
};