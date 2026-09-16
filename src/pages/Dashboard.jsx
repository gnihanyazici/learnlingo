import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  createRecord, 
  getUserRecords, 
  deleteRecord, 
  updateRecord 
} from "../firebase/firestore";
import toast from "react-hot-toast";

export const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  
  // State Yönetimi
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Form State - Konsol hatasını önlemek için başlangıç değerleri boş string olmalı
  const [formData, setFormData] = useState({ title: "", description: "" });

 // Verileri Getirme (Read)
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      // API isteği veya veritabanı çağrısı
      const data = await getUserRecords(currentUser.uid);
      setRecords(data);
    } catch (error) {
      toast.error("Veriler yüklenirken bir hata oluştu.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]); 
  // useEffect
  useEffect(() => {
    if (currentUser?.uid) {
      const loadData = async () => {
        await fetchRecords();
      };
      
      loadData();
    }
  }, [currentUser, fetchRecords]);

  
  useEffect(() => {
    if (currentUser?.uid) {
      const loadData = async () => {
        await fetchRecords();
      };
      
      loadData();
    }
  }, [currentUser, fetchRecords]); 

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      if (editingId) {
      
        await updateRecord(editingId, {
          title: formData.title,
          description: formData.description
        });
        toast.success("Kayıt başarıyla güncellendi!");
      } else {
        
        await createRecord(currentUser.uid, {
          title: formData.title,
          description: formData.description
        });
        toast.success("Yeni kayıt eklendi!");
      }

      
      setFormData({ title: "", description: "" });
      setEditingId(null);
      fetchRecords();
    } catch (error) {
      toast.error("İşlem başarısız oldu.");
      console.error(error);
    }
  };

 
  const handleEdit = (record) => {
    setEditingId(record.id);
    setFormData({ title: record.title, description: record.description });
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "" });
  };

  
  const handleDelete = async (recordId) => {
    if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;

    try {
      await deleteRecord(recordId);
      toast.success("Kayıt silindi.");
      fetchRecords();
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
      console.error(error);
    }
  };

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1>Hoş Geldin, {currentUser?.email}</h1>
        <button onClick={logout} className="btn-logout">Çıkış Yap</button>
      </header>

      {/* CRUD - Form Alanı */}
      <section className="form-section">
        <h2>{editingId ? "Kaydı Düzenle" : "Yeni Kayıt Ekle"}</h2>
        <form onSubmit={handleSubmit} className="record-form">
          <div className="form-group">
            <label htmlFor="title">Başlık</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Görev veya Not Başlığı"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detaylar..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? "Güncelle" : "Ekle"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                İptal
              </button>
            )}
          </div>
        </form>
      </section>

      {/* CRUD - Liste Alanı */}
      <section className="list-section">
        <h2>Kayıtlarınız</h2>
        
        {loading ? (
          <p>Veriler yükleniyor...</p>
        ) : records.length === 0 ? (
          <p>Henüz bir kayıt bulunmuyor.</p>
        ) : (
          <ul className="record-list">
            {records.map((record) => (
              <li key={record.id} className="record-item">
                <article>
                  <h3>{record.title}</h3>
                  <p>{record.description}</p>
                </article>
                <div className="record-actions">
                  <button onClick={() => handleEdit(record)} className="btn-edit">
                    Düzenle
                  </button>
                  <button onClick={() => handleDelete(record.id)} className="btn-delete">
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};