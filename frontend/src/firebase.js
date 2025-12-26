import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "...",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "..."
};

// 調試：檢查配置（生產環境也顯示，但隱藏敏感資訊）
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '❌ 未設定';
console.log('🔧 [Firebase] 配置檢查:');
console.log('  - API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ 已設定' : '❌ 未設定');
console.log('  - Project ID:', projectId);
console.log('  - Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '❌ 未設定');
console.log('  - Storage Bucket:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '❌ 未設定');
console.log('  - Messaging Sender ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '❌ 未設定');
console.log('  - App ID:', import.meta.env.VITE_FIREBASE_APP_ID || '❌ 未設定');
console.log('');
console.log('⚠️ [重要] 請確認 Project ID 與後端使用的 Firebase 專案一致！');
console.log('   前端 Project ID:', projectId);
console.log('   後端 Project ID: 請檢查 Railway Variables 中的 SERVICE_ACCOUNT_KEY');

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Firestore 會自動連接，不需要手動驗證
console.log('✅ [Firebase] Firestore 已初始化');
