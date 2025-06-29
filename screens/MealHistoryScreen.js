import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { getMealHistory, getAllMeals } from '../data/mealStorage';

export default function MealHistoryScreen({ navigation }) {
  const [sortedHistory, setSortedHistory] = useState([]);

  // 画面がフォーカスされるたびに履歴を更新
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const currentHistory = getMealHistory();
      const allMeals = getAllMeals();
      const historyWithMeals = currentHistory
        .map(history => ({
          ...history,
          meal: allMeals.find(meal => meal.id === history.mealId)
        }))
        .filter(history => history.meal) // 削除された献立は除外
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setSortedHistory(historyWithMeals);
    });

    return unsubscribe;
  }, [navigation]);

  // 初回ロード時も履歴を設定
  useEffect(() => {
    const currentHistory = getMealHistory();
    const allMeals = getAllMeals();
    const historyWithMeals = currentHistory
      .map(history => ({
        ...history,
        meal: allMeals.find(meal => meal.id === history.mealId)
      }))
      .filter(history => history.meal) // 削除された献立は除外
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    setSortedHistory(historyWithMeals);
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>献立履歴</Text>
      
      <ScrollView style={styles.historyList}>
        {sortedHistory.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <View style={styles.historyHeader}>
              <Text style={styles.mealName}>{item.meal.name}</Text>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
            </View>
            
            <View style={styles.mealDetails}>
              <Text style={styles.mainDish}>メイン: {item.meal.mainDish}</Text>
              <Text style={styles.sideDishes}>
                副菜: {item.meal.sideDishes.join(', ')}
              </Text>
            </View>
            
            <View style={styles.ratingSection}>
              <Text style={styles.rating}>評価: {renderStars(item.rating)}</Text>
              <Text style={styles.cookingTime}>調理時間: {item.meal.cookingTime}分</Text>
            </View>
            
            {item.notes && (
              <Text style={styles.notes}>メモ: {item.notes}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('MealSuggestion')}
      >
        <Text style={styles.addButtonText}>新しい献立を選ぶ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  mealDetails: {
    marginBottom: 8,
  },
  mainDish: {
    fontSize: 14,
    color: '#e74c3c',
    marginBottom: 4,
  },
  sideDishes: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#f39c12',
  },
  cookingTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  notes: {
    fontSize: 12,
    color: '#34495e',
    fontStyle: 'italic',
    backgroundColor: '#ecf0f1',
    padding: 8,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: '#3498db',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});