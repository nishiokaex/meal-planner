import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { addMeal } from '../data/mealStorage';

export default function MealRegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    mainDish: '',
    sideDishes: [''],
    ingredients: [''],
    cookingTime: '',
    difficulty: '普通'
  });

  const difficulties = ['簡単', '普通', '難しい'];

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateArrayField = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('エラー', '献立名を入力してください');
      return false;
    }
    if (!formData.mainDish.trim()) {
      Alert.alert('エラー', 'メイン料理を入力してください');
      return false;
    }
    if (!formData.cookingTime || isNaN(formData.cookingTime)) {
      Alert.alert('エラー', '調理時間を正しく入力してください');
      return false;
    }
    if (formData.sideDishes.filter(dish => dish.trim()).length === 0) {
      Alert.alert('エラー', '副菜を最低1つ入力してください');
      return false;
    }
    if (formData.ingredients.filter(ingredient => ingredient.trim()).length === 0) {
      Alert.alert('エラー', '材料を最低1つ入力してください');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const mealData = {
      name: formData.name.trim(),
      mainDish: formData.mainDish.trim(),
      sideDishes: formData.sideDishes.filter(dish => dish.trim()),
      ingredients: formData.ingredients.filter(ingredient => ingredient.trim()),
      cookingTime: parseInt(formData.cookingTime),
      difficulty: formData.difficulty
    };

    try {
      addMeal(mealData);
      Alert.alert(
        '登録完了',
        `「${mealData.name}」を献立に追加しました！`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MealHistory')
          }
        ]
      );
    } catch (error) {
      Alert.alert('エラー', '献立の登録に失敗しました');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mainDish: '',
      sideDishes: [''],
      ingredients: [''],
      cookingTime: '',
      difficulty: '普通'
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>新しい献立を登録</Text>
          <Text style={styles.subtitle}>お気に入りの献立を追加しましょう</Text>
        </View>

        <View style={styles.form}>
          {/* 献立名 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>献立名 *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              placeholder="例: ハンバーグ定食"
              placeholderTextColor="#bdc3c7"
            />
          </View>

          {/* メイン料理 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>メイン料理 *</Text>
            <TextInput
              style={styles.input}
              value={formData.mainDish}
              onChangeText={(value) => updateFormData('mainDish', value)}
              placeholder="例: ハンバーグ"
              placeholderTextColor="#bdc3c7"
            />
          </View>

          {/* 調理時間 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>調理時間（分） *</Text>
            <TextInput
              style={styles.input}
              value={formData.cookingTime}
              onChangeText={(value) => updateFormData('cookingTime', value)}
              placeholder="例: 30"
              keyboardType="numeric"
              placeholderTextColor="#bdc3c7"
            />
          </View>

          {/* 難易度 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>難易度</Text>
            <View style={styles.difficultyContainer}>
              {difficulties.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.difficultyButton,
                    formData.difficulty === difficulty && styles.selectedDifficulty
                  ]}
                  onPress={() => updateFormData('difficulty', difficulty)}
                >
                  <Text style={[
                    styles.difficultyText,
                    formData.difficulty === difficulty && styles.selectedDifficultyText
                  ]}>
                    {difficulty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 副菜 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>副菜・その他 *</Text>
            {formData.sideDishes.map((dish, index) => (
              <View key={index} style={styles.arrayInputContainer}>
                <TextInput
                  style={[styles.input, styles.arrayInput]}
                  value={dish}
                  onChangeText={(value) => updateArrayField('sideDishes', index, value)}
                  placeholder={`副菜 ${index + 1}`}
                  placeholderTextColor="#bdc3c7"
                />
                {formData.sideDishes.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeArrayItem('sideDishes', index)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addArrayItem('sideDishes')}
            >
              <Text style={styles.addButtonText}>+ 副菜を追加</Text>
            </TouchableOpacity>
          </View>

          {/* 材料 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>材料 *</Text>
            {formData.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.arrayInputContainer}>
                <TextInput
                  style={[styles.input, styles.arrayInput]}
                  value={ingredient}
                  onChangeText={(value) => updateArrayField('ingredients', index, value)}
                  placeholder={`材料 ${index + 1}`}
                  placeholderTextColor="#bdc3c7"
                />
                {formData.ingredients.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeArrayItem('ingredients', index)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addArrayItem('ingredients')}
            >
              <Text style={styles.addButtonText}>+ 材料を追加</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
            <Text style={styles.resetButtonText}>リセット</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>献立を登録</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    alignItems: 'center',
  },
  selectedDifficulty: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  selectedDifficultyText: {
    color: '#ffffff',
  },
  arrayInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  arrayInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    width: 36,
    height: 36,
    backgroundColor: '#e74c3c',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: '#7f8c8d',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});