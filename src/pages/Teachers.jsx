import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  getTeachersPaginated, 
  getUserFavorites, 
  toggleFavorite,
  getAllTeachers 
} from "../firebase/database";
import toast from "react-hot-toast";
import { TeacherCard } from "../components/teachers/TeacherCard";
import { FilterBar } from "../components/teachers/FilterBar";

export const Teachers = () => {
  const { currentUser } = useAuth();
  
  // State Yönetimi
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Filtreleme State'leri
  const [filters, setFilters] = useState({ language: "", level: "", price: "" });
  const [isFiltering, setIsFiltering] = useState(false);
  const [allFetchedTeachers, setAllFetchedTeachers] = useState([]);

  // İlk 4 Öğretmeni Çekme İşlemi (Sayfalama modu için)
  const fetchInitialTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTeachersPaginated(null, 4);
      if (data.length > 0) {
        setTeachers(data);
        setLastKey(data[data.length - 1].id);
        setHasMore(data.length === 4);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Öğretmenler yüklenirken hata:", error);
      toast.error("Veriler alınamadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Giriş Yapmış Kullanıcının Favorilerini Çekme
  const fetchFavorites = useCallback(async () => {
    if (currentUser?.uid) {
      const favData = await getUserFavorites(currentUser.uid);
      setFavorites(favData || {});
    } else {
      setFavorites({});
    }
  }, [currentUser]);

  // Sayfa İlk Yüklendiğinde Çalışacak Effect'ler
  useEffect(() => {
    const initData = async () => {
      await fetchInitialTeachers();
    };
    initData();
  }, [fetchInitialTeachers]);

  useEffect(() => {
    const initFavs = async () => {
      await fetchFavorites();
    };
    initFavs();
  }, [fetchFavorites]);

  // Filtreler Değiştiğinde Çalışacak Effect
  useEffect(() => {
    const applyFilters = async () => {
      const { language, level, price } = filters;
      
      // Hiçbir filtre seçili değilse orijinal sayfalama (Load More) moduna geri dön
      if (!language && !level && !price) {
        if (isFiltering) {
          setIsFiltering(false);
          await fetchInitialTeachers();
        }
        return;
      }

      setIsFiltering(true);
      setLoading(true);

      try {
        // Tüm veriler henüz çekilmediyse bir kez çek ve state'e kaydet (Cache)
        let dataToFilter = allFetchedTeachers;
        if (dataToFilter.length === 0) {
          dataToFilter = await getAllTeachers();
          setAllFetchedTeachers(dataToFilter);
        }

        // İstemci tarafında (Client-side) verileri filtrele
        const filtered = dataToFilter.filter(teacher => {
          const matchLanguage = language ? teacher.languages?.includes(language) : true;
          const matchLevel = level ? teacher.levels?.includes(level) : true;
          const matchPrice = price ? teacher.price_per_hour <= parseInt(price) : true;
          
          return matchLanguage && matchLevel && matchPrice;
        });

        setTeachers(filtered);
      } catch (error) {
        console.error("Filtreleme hatası:", error);
        toast.error("Filtreleme işlemi yapılamadı.");
      } finally {
        setLoading(false);
      }
    };

    applyFilters();
  }, [filters, allFetchedTeachers, fetchInitialTeachers, isFiltering]);

  // Load More (Daha Fazla Yükle) İşlemi
  const handleLoadMore = async () => {
    if (!lastKey) return;
    setLoadingMore(true);
    
    try {
      const data = await getTeachersPaginated(lastKey, 4);
      if (data.length > 0) {
        setTeachers((prev) => [...prev, ...data]); 
        setLastKey(data[data.length - 1].id);
        
        if (data.length < 4) setHasMore(false);
      } else {
        setHasMore(false); 
      }
    } catch (error) {
      console.error("Yeni kartlar yüklenemedi:", error);
      toast.error("Yeni öğretmenler yüklenirken bir hata oluştu.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Favori Ekleme/Çıkarma İşlemi
  const handleToggleFavorite = async (teacherId) => {
    if (!currentUser) {
      toast.error("Bu özellik sadece yetkili kullanıcılar içindir. Lütfen giriş yapın.");
      return;
    }

    const isCurrentlyFavorite = !!favorites[teacherId];

    try {
      // Optimistic UI Update (Kullanıcı deneyimi için anında tepki)
      setFavorites((prev) => {
        const newFavs = { ...prev };
        if (isCurrentlyFavorite) {
          delete newFavs[teacherId];
        } else {
          newFavs[teacherId] = true;
        }
        return newFavs;
      });

      await toggleFavorite(currentUser.uid, teacherId, isCurrentlyFavorite);
      
    } catch (error) {
      console.error("Favori işlemi başarısız:", error);
      toast.error("Favori durumu güncellenemedi.");
    }
  };

  return (
    <section className="teachers-page">
      <div className="filters-container">
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>
      
      {loading ? (
        <div className="loader-container">Öğretmenler yükleniyor...</div>
      ) : teachers.length === 0 ? (
        <div className="empty-state">Aradığınız kriterlere uygun öğretmen bulunamadı.</div>
      ) : (
        <>
          <div className="teachers-list">
            {teachers.map((teacher) => (
              <TeacherCard 
                key={teacher.id} 
                teacher={teacher} 
                isFavorite={!!favorites[teacher.id]} 
                onToggleFavorite={handleToggleFavorite} 
              />
            ))}
          </div>

          {/* Filtreleme aktif değilse ve veritabanında başka veri varsa Load More butonunu göster */}
          {hasMore && !isFiltering && (
            <div className="load-more-container">
              <button 
                className="btn-primary" 
                onClick={handleLoadMore} 
                disabled={loadingMore}
              >
                {loadingMore ? "Yükleniyor..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};