import { useState } from "react";
import { BookLessonModal } from "../booking/BookLessonModal"; 

export const TeacherCard = ({ teacher, isFavorite, onToggleFavorite }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <article className="teacher-card">
      
      
      <div className="teacher-card-header">
        <img 
          src={teacher.avatar_url} 
          alt={`${teacher.name} ${teacher.surname}`} 
          className="teacher-avatar" 
        />
      </div>
      
      
      <div className="teacher-card-body">
        
        <button 
          className={`btn-favorite ${isFavorite ? "is-favorite" : ""}`}
          onClick={() => onToggleFavorite(teacher.id)}
          aria-label="Favorilere ekle/çıkar"
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

        <span className="subject">Languages</span>
        <h3>{teacher.name} {teacher.surname}</h3>
        
        <p><strong>Speaks:</strong> {teacher.languages?.join(", ")}</p>
        <p><strong>Lesson Info:</strong> {teacher.lesson_info}</p>
        <p><strong>Conditions:</strong> {teacher.conditions?.join(", ")}</p>
        
        {isExpanded && (
          <div className="expanded-content">
            <p className="experience">{teacher.experience}</p>
            
            <div className="reviews-list">
              {teacher.reviews?.map((review, idx) => (
                <div key={idx} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-avatar">
                      {review.reviewer_name.charAt(0)}
                    </div>
                    <div>
                      <h5>{review.reviewer_name}</h5>
                      <span className="rating">⭐ {review.reviewer_rating}</span>
                    </div>
                  </div>
                  <p className="review-text">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="levels">
          {teacher.levels?.map((level, idx) => (
            <span key={idx} className="level-badge">{level}</span>
          ))}
        </div>
        
        <div className="price-rating">
          <span>⭐ {teacher.rating} ({teacher.reviews?.length || 0} reviews)</span>
          <span><strong>Price:</strong> ${teacher.price_per_hour}/hour</span>
        </div>
        
        {!isExpanded ? (
          <button className="btn-read-more" onClick={() => setIsExpanded(true)}>
            Read more
          </button>
        ) : (
          <button className="btn-primary btn-book" onClick={() => setIsModalOpen(true)}>
            Book trial lesson
          </button>
        )}
      </div>

      {isModalOpen && (
        <BookLessonModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          teacher={teacher} 
        />
      )}
    </article>
  );
};