import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default function SwipeCard({ 
  meal, 
  onSwipeLeft, 
  onSwipeRight, 
  isVisible = true,
  zIndex = 1,
  scale = 1,
  opacity = 1 
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(opacity)).current;

  React.useEffect(() => {
    cardOpacity.setValue(opacity);
  }, [opacity]);

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

  const onGestureEvent = Animated.event(
    [{
      nativeEvent: {
        translationX: translateX,
        translationY: translateY,
      },
    }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      const threshold = width * 0.3;

      if (Math.abs(translationX) > threshold) {
        // スワイプ決定
        const toValue = translationX > 0 ? width * 1.5 : -width * 1.5;
        const rotateValue = translationX > 0 ? 30 : -30;

        Animated.parallel([
          Animated.timing(translateX, {
            toValue,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: rotateValue,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(cardOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (translationX > 0) {
            onSwipeRight(meal);
          } else {
            onSwipeLeft(meal);
          }
          // Reset values
          translateX.setValue(0);
          translateY.setValue(0);
          rotate.setValue(0);
          cardOpacity.setValue(1);
        });
      } else {
        // 元の位置に戻す
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(rotate, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  };

  // ドラッグ中の回転角度を計算
  const rotateInterpolate = Animated.add(
    rotate,
    translateX.interpolate({
      inputRange: [-width / 2, 0, width / 2],
      outputRange: [-15, 0, 15],
      extrapolate: 'clamp',
    })
  );

  // スワイプ方向の判定アイコンの透明度
  const leftIconOpacity = translateX.interpolate({
    inputRange: [-width * 0.5, -50, 0],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const rightIconOpacity = translateX.interpolate({
    inputRange: [0, 50, width * 0.5],
    outputRange: [0, 0.3, 1],
    extrapolate: 'clamp',
  });

  if (!isVisible) return null;

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [
              { translateX },
              { translateY },
              { rotate: rotateInterpolate.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '1deg'],
              }) },
              { scale }
            ],
            opacity: cardOpacity,
            zIndex,
          },
        ]}
      >
        <View style={styles.card}>
          {/* スワイプ判定アイコン */}
          <Animated.View style={[styles.swipeIndicator, styles.leftIndicator, { opacity: leftIconOpacity }]}>
            <Text style={styles.rejectIcon}>✕</Text>
            <Text style={styles.rejectText}>パス</Text>
          </Animated.View>

          <Animated.View style={[styles.swipeIndicator, styles.rightIndicator, { opacity: rightIconOpacity }]}>
            <Text style={styles.acceptIcon}>♡</Text>
            <Text style={styles.acceptText}>決定</Text>
          </Animated.View>

          {/* カードコンテンツ */}
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
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: width * 0.9,
    height: height * 0.7,
    alignSelf: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 15,
    overflow: 'hidden',
  },
  swipeIndicator: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
    zIndex: 10,
    padding: 20,
  },
  leftIndicator: {
    left: 30,
  },
  rightIndicator: {
    right: 30,
  },
  rejectIcon: {
    fontSize: 60,
    color: '#e74c3c',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  acceptIcon: {
    fontSize: 60,
    color: '#27ae60',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  rejectText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginTop: 8,
  },
  acceptText: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
    marginTop: 8,
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  mealName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 24,
  },
  mainDishContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainDishLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  mainDish: {
    fontSize: 22,
    fontWeight: '600',
    color: '#e74c3c',
  },
  sideDishesContainer: {
    marginBottom: 20,
  },
  sideDishesLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  sideDishes: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  sideDish: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  ingredientsContainer: {
    marginBottom: 8,
  },
  ingredientsLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  ingredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientTag: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ingredientText: {
    fontSize: 12,
    color: '#2980b9',
    fontWeight: '500',
  },
});