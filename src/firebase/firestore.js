import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp, 
  deleteDoc, 
  doc,
  updateDoc 
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION_NAME = "records";

// Yeni kayıt oluşturma
export const createRecord = async (userId, data) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  });
};

// Kullanıcının kayıtlarını getirme
export const getUserRecords = async (userId) => {
  const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Kayıt silme
export const deleteRecord = async (recordId) => {
  const docRef = doc(db, COLLECTION_NAME, recordId);
  return await deleteDoc(docRef);
};

// Mevcut kaydı güncelleme
export const updateRecord = async (recordId, updatedData) => {
  const docRef = doc(db, COLLECTION_NAME, recordId);
  return await updateDoc(docRef, updatedData);
};