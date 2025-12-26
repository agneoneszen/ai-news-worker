/**
 * 前端部署前檢查腳本
 * 確認 Firebase 配置是否正確
 */
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function checkConfig() {
  console.log("🔍 檢查 Firebase 配置...\n");
  
  const required = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
  ];
  
  let hasError = false;
  
  required.forEach((key) => {
    const value = import.meta.env[key];
    if (value && !value.includes("YOUR_") && value !== "...") {
      console.log(`✅ ${key}: 已設定`);
    } else {
      console.log(`❌ ${key}: 未設定或使用預設值`);
      hasError = true;
    }
  });
  
  if (hasError) {
    console.log("\n❌ 請設定所有 Firebase 環境變數");
    console.log("💡 提示: 在 .env 檔案中設定，或透過部署平台的環境變數設定");
    return false;
  }
  
  // 嘗試初始化 Firebase
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("\n✅ Firebase 初始化成功！");
    return true;
  } catch (error) {
    console.log(`\n❌ Firebase 初始化失敗: ${error.message}`);
    return false;
  }
}

// 在開發模式下執行檢查
if (import.meta.env.DEV) {
  checkConfig();
}

export { checkConfig };

