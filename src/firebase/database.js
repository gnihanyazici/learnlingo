import { 
  ref, 
  get, 
  query, 
  orderByKey, 
  limitToFirst, 
  startAfter, 
  set, 
  remove 
} from "firebase/database";
import { db } from "./config";

const TEACHERS_NODE = "teachers";
const USERS_NODE = "users";

/**
 * Öğretmenleri sayfalama (Load More) mantığı ile getirir.
 * 
 * @param {string|null} lastTeacherKey
 * @param {number} limit 
 */
export const getTeachersPaginated = async (lastTeacherKey = null, limit = 4) => {
  let teachersQuery;

  if (lastTeacherKey) {
    teachersQuery = query(
      ref(db, TEACHERS_NODE),
      orderByKey(),
      startAfter(lastTeacherKey),
      limitToFirst(limit)
    );
  } else {
    teachersQuery = query(
      ref(db, TEACHERS_NODE),
      orderByKey(),
      limitToFirst(limit)
    );
  }

  const snapshot = await get(teachersQuery);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    
    const teachersArray = Object.keys(data).map(key => ({
      id: key, 
      ...data[key]
    }));
    
    return teachersArray;
  }
  
  return [];
};

export const getUserFavorites = async (userId) => {
  if (!userId) return {};
  
  const snapshot = await get(ref(db, `${USERS_NODE}/${userId}/favorites`));
  if (snapshot.exists()) {
    return snapshot.val(); 
  }
  return {};
};

export const toggleFavorite = async (userId, teacherId, isCurrentlyFavorite) => {
  if (!userId) throw new Error("Favoriye eklemek için giriş yapmalısınız.");

  const favoriteRef = ref(db, `${USERS_NODE}/${userId}/favorites/${teacherId}`);

  if (isCurrentlyFavorite) {
    await remove(favoriteRef);
  } else {
    await set(favoriteRef, true);
  }
};

export const getTeacherById = async (teacherId) => {
  const snapshot = await get(ref(db, `${TEACHERS_NODE}/${teacherId}`));
  if (snapshot.exists()) {
    return { id: teacherId, ...snapshot.val() };
  }
  return null;
};

export const getAllTeachers = async () => {
  const snapshot = await get(ref(db, TEACHERS_NODE));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
  }
  return [];
};