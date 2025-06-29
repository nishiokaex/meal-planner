import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

export default function MealCard({ meal, onAccept, onReject }) {
  const formatLastMade = (lastMade) => {
    if (!lastMade) return '初回';
    const daysDiff = Math.floor((new Date() - new Date(lastMade)) / (1000 * 60 * 60 * 24));
    return `${daysDiff}日前`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '簡単': return '#27ae60';
      case '普通': return '#f39c12';
      case '難しい': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.mealName}>{meal.name}</Text>
        
        <View style={styles.mainDishContainer}>
          <Text style={styles.mainDishLabel}>メイン料理</Text>
          <Text style={styles.mainDish}>{meal.mainDish}</Text>
        </View>

        <View style={styles.sideDishesContainer}>
          <Text style={styles.sideDishesLabel}>副菜・その他</Text>
          <View style={styles.sideDishes}>
            {meal.sideDishes.map((dish, index) => (
              <Text key={index} style={styles.sideDish}>• {dish}</Text>
            ))}
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>調理時間</Text>
            <Text style={styles.infoValue}>{meal.cookingTime}分</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>難易度</Text>
            <Text style={[styles.infoValue, { color: getDifficultyColor(meal.difficulty) }]}>
              {meal.difficulty}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>前回作成</Text>
            <Text style={styles.infoValue}>{formatLastMade(meal.lastMade)}</Text>
          </View>
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsLabel}>主な材料</Text>
          <View style={styles.ingredients}>
            {meal.ingredients.slice(0, 6).map((ingredient, index) => (
              <View key={index} style={styles.ingredientTag}>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
            {meal.ingredients.length > 6 && (
              <View style={styles.ingredientTag}>
                <Text style={styles.ingredientText}>他{meal.ingredients.length - 6}品</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <Text style={styles.rejectButtonText}>パス</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Text style={styles.acceptButtonText}>これにする！</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width - 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
  },
  mealName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  mainDishContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  mainDishLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  mainDish: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e74c3c',
  },
  sideDishesContainer: {
    marginBottom: 16,
  },
  sideDishesLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  sideDishes: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  sideDish: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  ingredientsContainer: {
    marginBottom: 8,
  },
  ingredientsLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  ingredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientTag: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ingredientText: {
    fontSize: 11,
    color: '#2980b9',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    paddingVertical: 16,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});