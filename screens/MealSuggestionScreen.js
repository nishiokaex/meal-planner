import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions
} from 'react-native';
import { mealHistory } from '../data/sampleMeals';
import { getAllMeals } from '../data/mealStorage';
import SwipeCard from '../components/SwipeCard';

const { width, height } = Dimensions.get('window');

export default function MealSuggestionScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // 画面フォーカス時に献立リストを更新
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const allMeals = getAllMeals();
      const recentMeals = mealHistory.map(h => h.mealId);
      const filteredMeals = allMeals
        .filter(meal => !recentMeals.includes(meal.id) || 
          (meal.lastMade && (new Date() - new Date(meal.lastMade)) > 7 * 24 * 60 * 60 * 1000))
        .sort(() => Math.random() - 0.5); // ランダムに並び替え
      setSuggestions(filteredMeals);
      setCurrentIndex(0);
    });

    return unsubscribe;
  }, [navigation]);

  // 初回ロード時も献立リストを設定
  useEffect(() => {
    const allMeals = getAllMeals();
    const recentMeals = mealHistory.map(h => h.mealId);
    const filteredMeals = allMeals
      .filter(meal => !recentMeals.includes(meal.id) || 
        (meal.lastMade && (new Date() - new Date(meal.lastMade)) > 7 * 24 * 60 * 60 * 1000))
      .sort(() => Math.random() - 0.5); // ランダムに並び替え
    setSuggestions(filteredMeals);
  }, []);

  const handleSwipeLeft = (meal) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // 0.3秒後に次のカードを表示
    setTimeout(() => {
      if (currentIndex >= suggestions.length - 1) {
        Alert.alert(
          "提案終了",
          "すべての献立提案を確認しました。履歴画面に戻ります。",
          [{ text: "OK", onPress: () => navigation.navigate('MealHistory') }]
        );
        return;
      }
      
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  };

  const handleSwipeRight = (meal) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      // 献立決定後、直接買い物リスト画面に遷移
      navigation.navigate('ShoppingList', { meal });
      setIsAnimating(false);
    }, 300);
  };

  if (currentIndex >= suggestions.length) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>提案できる献立がありません</Text>
        <Text style={styles.emptySubtext}>履歴画面に戻って確認してください</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>今日の献立提案</Text>
        <Text style={styles.subtitle}>
          {currentIndex + 1} / {suggestions.length}
        </Text>
        <Text style={styles.instruction}>
          左右にスワイプして選択してください
        </Text>
      </View>

      <View style={styles.cardStack}>
        {/* 次のカード（背景）- 薄く表示 */}
        {currentIndex + 1 < suggestions.length && (
          <SwipeCard
            meal={suggestions[currentIndex + 1]}
            onSwipeLeft={() => {}}
            onSwipeRight={() => {}}
            isVisible={true}
            zIndex={1}
            scale={0.95}
            opacity={0.5}
          />
        )}
        
        {/* 現在のカード */}
        <SwipeCard
          meal={suggestions[currentIndex]}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          isVisible={true}
          zIndex={2}
          scale={1}
          opacity={1}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.swipeHints}>
          <View style={styles.swipeHint}>
            <Text style={styles.rejectHint}>←</Text>
            <Text style={styles.hintText}>パス</Text>
          </View>
          <View style={styles.swipeHint}>
            <Text style={styles.acceptHint}>→</Text>
            <Text style={styles.hintText}>決定</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  cardStack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  swipeHint: {
    alignItems: 'center',
    padding: 16,
  },
  rejectHint: {
    fontSize: 32,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  acceptHint: {
    fontSize: 32,
    color: '#27ae60',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});