import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text } from 'react-native';

// 画面コンポーネントのインポート
import MealHistoryScreen from './screens/MealHistoryScreen';
import MealSuggestionScreen from './screens/MealSuggestionScreen';
import ShoppingListScreen from './screens/ShoppingListScreen';
import MealRegisterScreen from './screens/MealRegisterScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#e74c3c',
          tabBarInactiveTintColor: '#7f8c8d',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen
          name="MealHistory"
          component={MealHistoryScreen}
          options={{
            tabBarLabel: '献立履歴',
            tabBarIcon: ({ color }) => (
              <Text style={[styles.tabIcon, { color }]}>📋</Text>
            ),
          }}
        />
        <Tab.Screen
          name="MealSuggestion"
          component={MealSuggestionScreen}
          options={{
            tabBarLabel: '献立提案',
            tabBarIcon: ({ color }) => (
              <Text style={[styles.tabIcon, { color }]}>🍽️</Text>
            ),
          }}
        />
        <Tab.Screen
          name="ShoppingList"
          component={ShoppingListScreen}
          options={{
            tabBarLabel: '買い物リスト',
            tabBarIcon: ({ color }) => (
              <Text style={[styles.tabIcon, { color }]}>🛒</Text>
            ),
          }}
        />
        <Tab.Screen
          name="MealRegister"
          component={MealRegisterScreen}
          options={{
            tabBarLabel: '献立登録',
            tabBarIcon: ({ color }) => (
              <Text style={[styles.tabIcon, { color }]}>📝</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingBottom: 5,
    height: 80,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 24,
  },
});
