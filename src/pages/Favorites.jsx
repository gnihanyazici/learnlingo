import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserFavorites, getTeacherById, toggleFavorite } from "../firebase/database";
import { TeacherCard } from "../components/teachers/TeacherCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Favorites = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [favoriteTeachers, setFavoriteTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    if (!currentUser) {
      navigate("/");
      return;
    }

    const fetchFavoriteTeachersData = async () => {
      setLoading(true);
      try {
       
        const favIdsObj = await getUserFavorites(currentUser.uid);
        const favIdsArray = Object.keys(favIdsObj);

        if (favIdsArray.length === 0) {
          setFavoriteTeachers([]);
          setLoading(false);
          return;
        }

      
        const teachersData = await Promise.all(
          favIdsArray.map((id) => getTeacherById(id))
        );

        const validTeachers = teachersData.filter(teacher => teacher !== null);
        setFavoriteTeachers(validTeachers);

      } catch (error) {
        console.error("Favoriler yüklenirken hata:", error);
        toast.error("Favori öğretmenleriniz yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteTeachersData();
  }, [currentUser, navigate]);

  
  const handleRemoveFavorite = async (teacherId) => {
    try {
      
      await toggleFavorite(currentUser.uid, teacherId, true);
      
    
      setFavoriteTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      
      toast.success("Öğretmen favorilerden çıkarıldı 🤍");
    } catch (error) {
      console.error("Favori kaldırma hatası:", error);
      toast.error("İşlem başarısız oldu.");
    }
  };

  if (loading) {
    return (
      <section className="favorites-page">
        <div className="loader-container">Favorileriniz yükleniyor...</div>
      </section>
    );
  }

  return (
    <section className="favorites-page">
      <div className="favorites-container">
        {favoriteTeachers.length === 0 ? (
          <div className="empty-state">
            Henüz favorilere eklediğiniz bir öğretmen bulunmuyor.
          </div>
        ) : (
          <div className="teachers-list">
            {favoriteTeachers.map((teacher) => (
              <TeacherCard 
                key={teacher.id} 
                teacher={teacher} 
                isFavorite={true} 
                onToggleFavorite={handleRemoveFavorite} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};