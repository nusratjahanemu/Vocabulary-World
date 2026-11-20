# 🌍 Vocabulary World — বাংলা-ইংরেজি শব্দভান্ডার

> **বিগিনার থেকে প্রো লেভেল পর্যন্ত আধুনিক ইংরেজি শব্দভান্ডার শেখার ইন্টারেক্টিভ ওয়েব প্ল্যাটফর্ম**

![Vocabulary World Theme](https://img.shields.io/badge/Theme-Warm%20Ivory%20%26%20Botanical%20Sage-2D5A4C)
![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?logo=github)
![Tech](https://img.shields.io/badge/Stack-HTML5%20%7C%20TailwindCSS%20%7C%20Vanilla%20JS-F3EFEA)

---

## ✨ প্রধান বৈশিষ্ট্যসমূহ (Features)

1. **৪টি দক্ষতার স্তর (4 Curriculum Levels):**
   - **Beginner (প্রাথমিক):** নিত্যপ্রয়োজনীয় মৌলিক শব্দ ও সহজ উদাহরণ।
   - **Intermediate (মাধ্যমিক):** কথোপকথন ও প্রায়োগিক ইংরেজি শব্দাবলি।
   - **Advanced (উচ্চতর):** সমৃদ্ধ সাহিত্যিক ও একাডেমিক শব্দভান্ডার।
   - **Pro (দক্ষ):** প্রফেশনাল, আইইএলটিএস এবং জিআরই মানের শব্দভান্ডার।

2. **উচ্চারণ ইঞ্জিন ও কান্ট্রি অ্যাকসেন্ট (Hybrid Pronunciation & Accent Sync):**
   - 🇬🇧 UK (British - `en-GB`), 🇺🇸 US (American - `en-US`), 🇦🇺 Australia (`en-AU`), 🇨🇦 Canada (`en-CA`), 🇧🇩 Bangladesh।
   - Web Speech API এবং হাই-কোয়ালিটি ফলব্যাক অডিও সহ সরাসরি অ্যাকসেন্ট পরিবর্তন।

3. **৩ডি ফ্ল্যাশকার্ড ও লার্নিং ডেক (3D Interactive Flashcards):**
   - বাস্তবসম্মত ৩ডি কার্ড ফ্লিপ ইফেক্ট।
   - প্রতিটি শব্দের জন্য বাংলা অর্থ, পার্টস অব স্পিচ, সিনোনিম, অ্যান্টনিম ও ব্যবহারিক বাক্য।
   - উইকিপিডিয়া/উইকিমিডিয়া এপিআই থেকে কনটেক্সচুয়াল স্বয়ংক্রিয় ছবি প্রদর্শন।

4. **ইন্টারেক্টিভ গেমস (Interactive Practice Games):**
   - **Memory Match:** শব্দ এবং বাংলা অর্থের জোড়া মেলানোর মেমোরি গেম।
   - **Meaning Quiz:** সঠিক অর্থ বাছাইয়ের কুইজ পরীক্ষা।
   - **Speed Challenge:** সময়ের সাথে দ্রুত সঠিক উত্তর বাছাই।

5. **নতুন শব্দ সংযোজন (Add Custom Words):**
   - একক শব্দ যোগ করার সহজ ফর্ম।
   - বাল্ক পেস্ট (৫০-১০০ শব্দ এক ক্লিকে)।
   - এক্সেল (.xlsx, .xls, .csv) ও পিডিএফ (.pdf) ফাইল আপলোড পার্সিং।

6. **ডার্ক / লাইট থিম (Dark & Light Mode):**
   - এক ক্লিকে ডার্ক ও লাইট মোড টগল (স্লিক সান/মুন অ্যানিমেশন সহ)।
   - কোনো পেজ-ফ্ল্যাশ ছাড়া `localStorage` এ স্থায়ী প্রিমিয়াম বোটানিক্যাল সেজ ও ওয়ার্ম আইভরি থিম।

7. **অগ্রগতি ট্র্যাকার ও সাইন ইন (Daily Tracker & Sign In):**
   - দৈনিক শব্দ পড়ার লক্ষ্যমাত্রা, স্ট্রিক কাউন্ট এবং কুইজ স্কোর সংরক্ষণ।
   - নেম/ইমেইল বা গেস্ট সাইন-ইন দিয়ে নিজস্ব প্রোফাইল ব্যবস্থাপনা।

---

## 📂 প্রোজেক্ট আর্কিটেকচার (Project Structure)

```text
Vocabulary-World/
├── index.html              # লেভেল নির্বাচন ও এন্ট্রি গেটওয়ে
├── learn.html              # শব্দ ও পাঠের বিস্তারিত তালিকা
├── flashcards.html         # ৩ডি ফ্ল্যাশকার্ড মোড
├── games.html              # মেমোরি ম্যাচ ও মিনি গেমস
├── tracker.html            # দৈনিক অগ্রগতি ও স্ট্যাটিস্টিকস
├── add-words.html          # ম্যানুয়াল, বাল্ক ও ফাইল আপলোড
├── assessment.html         # লেভেল অ্যাসেসমেন্ট টেস্ট
├── css/
│   └── style.css           # থিম ভেরিয়েবল, অ্যানিমেশন ও কাস্টম স্টাইল
├── js/
│   ├── data.js             # ৪টি লেভেলের স্বয়ংসম্পূর্ণ শব্দভান্ডার ডাটাবেস
│   └── common.js           # ন্যাভবার, অডিও ইঞ্জিন, থিম ও লোকালস্টোরেজ
├── .gitignore
└── README.md
```

---

## 🚀 লোকালি চালু করার নিয়ম (How to Run Locally)

কোনো বিল্ড স্টেপ বা প্যাকেজ ইনস্টলেশনের প্রয়োজন নেই! এটি সম্পূর্ণ ভ্যানিলা জাভাস্ক্রিপ্ট আর্কিটেকচারে তৈরি:

1. রিপোজিটরিটি ক্লোন করুন:
   ```bash
   git clone https://github.com/nusratjahanemu/Vocabulary-World.git
   cd Vocabulary-World
   ```
2. যেকোনো ব্রাউজারে `index.html` ফাইলটি সরাসরি ডাবল ক্লিক করে অথবা লাইভ সার্ভার এক্সটেনশন দিয়ে ওপেন করুন।

---

## 🌐 লাইভ ডেমো (Live GitHub Pages)

- **URL:** [https://nusratjahanemu.github.io/Vocabulary-World/](https://nusratjahanemu.github.io/Vocabulary-World/)

---

## 📄 লাইসেন্স (License)

This project is licensed under the MIT License.
