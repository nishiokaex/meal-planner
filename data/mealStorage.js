// 献立履歴を管理するためのユーティリティ関数
import { sampleMeals, mealHistory } from './sampleMeals';

// 献立履歴データを保持する変数（実際のアプリでは AsyncStorage や他の永続化ストレージを使用）
let currentMealHistory = [...mealHistory];

// 献立データを保持する変数
let currentMeals = [...sampleMeals];

// 新しい献立決定を履歴に追加
export const addMealToHistory = (meal, rating = null, notes = '') => {
  const newHistoryItem = {
    id: Math.max(...currentMealHistory.map(h => h.id), 0) + 1,
    mealId: meal.id,
    date: new Date(),
    rating: rating,
    notes: notes
  };
  
  currentMealHistory.unshift(newHistoryItem); // 新しいものを先頭に追加
  return newHistoryItem;
};

// 現在の献立履歴を取得
export const getMealHistory = () => {
  return currentMealHistory;
};

// 献立履歴をリセット（開発用）
export const resetMealHistory = () => {
  currentMealHistory = [...mealHistory];
};

// 履歴項目を更新
export const updateMealHistory = (historyId, updates) => {
  const index = currentMealHistory.findIndex(h => h.id === historyId);
  if (index !== -1) {
    currentMealHistory[index] = { ...currentMealHistory[index], ...updates };
    return currentMealHistory[index];
  }
  return null;
};

// 新しい献立を追加
export const addMeal = (mealData) => {
  const newMeal = {
    id: Math.max(...currentMeals.map(m => m.id), 0) + 1,
    ...mealData,
    lastMade: null
  };
  
  currentMeals.push(newMeal);
  return newMeal;
};

// 全ての献立を取得
export const getAllMeals = () => {
  return currentMeals;
};

// 献立を更新
export const updateMeal = (mealId, updates) => {
  const index = currentMeals.findIndex(m => m.id === mealId);
  if (index !== -1) {
    currentMeals[index] = { ...currentMeals[index], ...updates };
    return currentMeals[index];
  }
  return null;
};

// 献立を削除
export const deleteMeal = (mealId) => {
  const index = currentMeals.findIndex(m => m.id === mealId);
  if (index !== -1) {
    const deletedMeal = currentMeals.splice(index, 1)[0];
    return deletedMeal;
  }
  return null;
};