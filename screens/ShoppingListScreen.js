import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { addMealToHistory } from '../data/mealStorage';

export default function ShoppingListScreen({ route, navigation }) {
  const { meal } = route.params || {};
  const [checkedItems, setCheckedItems] = useState({});
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    if (meal) {
      // 選択された献立の材料を買い物リストに追加
      const ingredients = meal.ingredients.map((ingredient, index) => ({
        id: `${meal.id}-${index}`,
        name: ingredient,
        category: categorizeIngredient(ingredient),
        quantity: '適量',
        essential: true
      }));
      setShoppingList(ingredients);
    } else {
      // デフォルトの買い物リスト
      setShoppingList(getDefaultShoppingList());
    }
  }, [meal]);

  const categorizeIngredient = (ingredient) => {
    const categories = {
      '肉類': ['牛肉', '豚肉', '鶏肉', '牛ひき肉', '鶏もも肉'],
      '野菜': ['玉ねぎ', 'にんじん', 'じゃがいも', 'キャベツ', 'レタス', 'トマト', '小松菜'],
      '調味料': ['醤油', 'みりん', '砂糖', '酒', '味噌', 'カレールー'],
      '魚介類': ['さば', '魚'],
      '乳製品・卵': ['卵'],
      '穀物・パン': ['ご飯', 'パスタ', '食パン', 'パン粉'],
      '缶詰・加工食品': ['トマト缶', '福神漬け'],
      'その他': ['豆腐', 'にんにく', '生姜', '片栗粉']
    };

    for (const [category, items] of Object.entries(categories)) {
      if (items.some(item => ingredient.includes(item))) {
        return category;
      }
    }
    return 'その他';
  };

  const getDefaultShoppingList = () => [
    { id: '1', name: '牛乳', category: '乳製品・卵', quantity: '1本', essential: false },
    { id: '2', name: '卵', category: '乳製品・卵', quantity: '1パック', essential: false },
    { id: '3', name: '食パン', category: '穀物・パン', quantity: '1斤', essential: false },
    { id: '4', name: '玉ねぎ', category: '野菜', quantity: '3個', essential: false },
    { id: '5', name: 'にんじん', category: '野菜', quantity: '2本', essential: false },
  ];

  const toggleItem = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getItemsByCategory = () => {
    const grouped = shoppingList.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
    return grouped;
  };

  const getCompletionRate = () => {
    const totalItems = shoppingList.length;
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;
  };

  const handleClearList = () => {
    Alert.alert(
      "リストをクリア",
      "買い物リストをクリアしますか？",
      [
        { text: "キャンセル", style: "cancel" },
        { 
          text: "クリア", 
          style: "destructive",
          onPress: () => {
            setCheckedItems({});
            setShoppingList([]);
          }
        }
      ]
    );
  };

  const groupedItems = getItemsByCategory();
  const completionRate = getCompletionRate();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>買い物リスト</Text>
        {meal && (
          <Text style={styles.mealInfo}>献立: {meal.name}</Text>
        )}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            完了率: {completionRate}% ({Object.values(checkedItems).filter(Boolean).length}/{shoppingList.length})
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${completionRate}%` }]}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.listContainer}>
        {Object.entries(groupedItems).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.listItem,
                  checkedItems[item.id] && styles.checkedItem
                ]}
                onPress={() => toggleItem(item.id)}
              >
                <View style={styles.itemContent}>
                  <View style={styles.checkboxContainer}>
                    <View style={[
                      styles.checkbox,
                      checkedItems[item.id] && styles.checkedCheckbox
                    ]}>
                      {checkedItems[item.id] && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.itemDetails}>
                    <Text style={[
                      styles.itemName,
                      checkedItems[item.id] && styles.checkedText
                    ]}>
                      {item.name}
                    </Text>
                    <Text style={[
                      styles.itemQuantity,
                      checkedItems[item.id] && styles.checkedText
                    ]}>
                      {item.quantity}
                    </Text>
                  </View>
                  
                  {item.essential && (
                    <View style={styles.essentialBadge}>
                      <Text style={styles.essentialText}>必須</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClearList}
        >
          <Text style={styles.clearButtonText}>リストをクリア</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            // 献立決定を履歴に追加
            if (meal) {
              addMealToHistory(meal, 4, '買い物リストから追加');
            }
            navigation.navigate('MealHistory');
          }}
        >
          <Text style={styles.backButtonText}>献立履歴に戻る</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  mealInfo: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 3,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 12,
    paddingLeft: 4,
  },
  listItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkedItem: {
    backgroundColor: '#f8f9fa',
    opacity: 0.7,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  essentialBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  essentialText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    flex: 2,
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});