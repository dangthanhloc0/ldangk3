# 🎯 Quick Start - Interactive Docs Portal

Selamat datang! Berikut cara menggunakan **Interactive Documentation Portal** untuk Keycloak Library.

---

## 🚀 Start Application

```bash
# Terminal 1: Start development server
cd c:\portfolio\keycloak-demo
ng serve

# Buka browser: http://localhost:4200
```

---

## 📚 Page 1: API Documentation (`/docs`)

### Akses:
1. Buka aplikasi di `http://localhost:4200`
2. Klik **"📚 Docs"** di navigation bar
3. Atau langsung ke `http://localhost:4200/docs`

### Apa yang Anda Lihat:

#### Sidebar (Sebelah kiri):
```
📂 Danh Mục Chức Năng
├─ 🔐 Xác Thực (Authentication)  ← 3 functions
├─ 👤 Quản Lý User              ← 6 functions
├─ 🔑 Quản Lý Role              ← 5 functions
└─ 🎫 Quản Lý Token             ← 2 functions
```

**Bật category:**
- Klik category untuk filter functions
- Highlight biru = currently selected

#### Function List (Tengah):
```
function-name()
Mô tả ngắn gọn

[Hover] → Background berubah
[Click] → Xem chi tiết di sebelah kanan
```

**Apa yang bisa dilakukan:**
- ✅ Click function card untuk lihat details
- ✅ Hover untuk preview
- ✅ Search di atas untuk mencari function

#### Details Panel (Sebelah kanan):

Ketika Anda click function, muncul:

```
1️⃣ Function Title & Description
   login()
   Đăng nhập user và nhận tokens

2️⃣ Parameters (📥)
   • userName: String (Required)
     Example: john.doe
   • password: String (Required)
     Example: SecurePass@123

3️⃣ Return Value (📤)
   Type: TokenResponse
   Example: (click "👀 Xem ví dụ" để expand)

4️⃣ Error Codes (⚠️)
   | Code | HTTP | Meaning | Solution |
   |------|------|---------|----------|
   | ... | ... | ... | ... |

5️⃣ Code Examples (💻)
   Backend (Spring Boot):
   [Code block] [📋 Copy]
   
   Frontend (Angular):
   [Code block] [📋 Copy]

6️⃣ When to Use (📋)
   ✅ Khi user click Login button
   ✅ Authenticate username/password
   ✅ First time user accesses

7️⃣ Best Practices (🏆)
   💡 Luôn check response.isSuccess()
   💡 Simpan tokens securely
   💡 Tidak log passwords
```

### Tips Penggunaan:

#### 🔍 Search Function:
```
1. Click search box di atas
2. Ketik: "login", "role", "token", dll
3. Results update realtime
4. Esc untuk clear search
```

#### 📋 Copy Code:
```
1. Baca code example di details panel
2. Baca code block Backend or Frontend
3. Klik button "📋 Copy Code"
4. Paste ke IDE Anda
5. Alert "Code copied!" muncul
```

#### 🎫 Filter by Category:
```
1. Klik category di sidebar
2. Function list update otomatis
3. Details panel clear (select function baru)
```

---

## 🚀 Page 2: Setup Guide (`/setup`)

### Akses:
1. Buka aplikasi di `http://localhost:4200`
2. Klik **"🚀 Setup"** di navigation bar
3. Atau langsung ke `http://localhost:4200/setup`

### Apa yang Anda Lihat:

#### Header dengan Progress:
```
🚀 Setup Guide
Hướng dẫn từng bước thiết lập Keycloak

Progress: ████████░░░░░░░░░░░░ 50%
✅ 4 / 8 steps completed
```

#### Sidebar (Sebelah kiri):
```
📋 Setup Steps

[1] ⚙️ Prerequisites ✓ (completed)
[2] 📦 Install Lib ✓ (completed)  
[3] 🐳 Config Keycloak ← (current)
    [checkbox] Mark complete
[4] 👑 Create Realm
[5] 🔑 Create Client
[6] 🍃 Configure Spring
[7] ⚛️ Setup Angular
[8] ✅ Test Auth
```

#### Main Content Area:

**Step Header:**
```
1   (Step number badge)
Prerequisites
Chuẩn bị môi trường...
⚙️  (Icon)
```

**Step Details:**
```
📝 Details

→ Java 17 or higher
→ Maven 3.8.x
→ Docker
→ Node.js 18+
→ Angular CLI 17+
→ Keycloak 26.x
```

**Code Example (nếu ada):**
```
💻 Code Example

[xml]  Language badge
[Code block dengan pre-formatted code]
[📋 Copy Code] button
```

**Navigation:**
```
[← Previous Step]    [Step Completion Checkbox]    [Next Step →]

Atau click sidebar untuk jump ke step manapun
```

### Tips Penggunaan:

#### ✅ Mark Step Complete:
```
1. Read instructions & follow steps
2. Klik checkbox "Mark as Completed"
3. Progress bar update
4. Sidebar badge berubah jadi ✓
```

#### 📋 Copy Code:
```
1. Baca code example
2. Klik "[📋 Copy Code]" button
3. Alert "Code copied!" 
4. Paste ke file (pom.xml, application.yaml, etc)
```

#### 🔄 Navigate Between Steps:
```
Option 1: Click [← Prev] [Next →] buttons
Option 2: Click step number di sidebar
Option 3: Arrow keys (future feature)
```

#### 📊 Check Progress:
```
1. Progress bar di atas menunjuk % complete
2. Sidebar menunjuk jumlah completed
3. Warna sidebar berubah saat complete
```

---

## 🎯 Common Tasks

### Task 1: Find Information About `login()` Function

```
1. Go to /docs
2. Click "🔐 Xác Thực" category (or search "login")
3. Click "login()" card
4. Read:
   - Description
   - Parameters (userName, password)
   - Return type (TokenResponse)
   - Error codes (401, 404)
   - Code examples (Backend & Frontend)
   - Best practices
```

### Task 2: Setup Keycloak Step by Step

```
1. Go to /setup
2. Read Step 1: Prerequisites
   - Check Anda punya Java 17+, Node.js, Docker
3. Mark Step 1 complete (checkbox)
4. Go to Step 2: Install Library
   - Copy code from block
   - Paste to pom.xml
5. Continue Step 3-8...
6. All done ✅
```

### Task 3: Get Backend Code Example

```
1. Go to /docs
2. Search/find function (e.g., "refreshToken")
3. Click function card
4. Scroll down to "💻 Code Examples"
5. Find "Backend (Spring Boot)" section
6. Click "[📋 Copy Backend Code]"
7. Paste to your Spring Boot controller
```

### Task 4: Get Frontend Code Example

```
1. Go to /docs
2. Find function (e.g., "login")
3. Click to open details
4. Find "💻 Code Examples"
5. Find "Frontend (Angular/TypeScript)"
6. Click "[📋 Copy Frontend Code]"
7. Paste to your Angular component/service
```

---

## 🔍 Search Tips

### Search Query Examples:

```
"login"           → Find login() function
"password"        → Find password-related functions
"role"            → Find role management functions
"token"           → Find token functions
"refresh"         → Find refreshToken()
"register"        → Find register() & related
"error"           → Find error handling info
```

### Search Matches:
- Function name (login, register, etc)
- Description (short text)
- Long description (detailed text)

---

## 🎨 UI Elements Reference

### Buttons:
```
[Primary Button]      Blue background → Next Step, Primary actions
[Secondary Button]    Gray background → Previous, Alternative
[Outline Button]      Border only → Copy code, Less important
[List Item Button]    Full width → Category/Step selection
```

### Badges:
```
[🔐 Authentication]   Category badge
[String]             Parameter type badge
[Required]           Red badge for required parameters
[Optional]           Gray badge for optional parameters
[401]                Error HTTP status
```

### Colors:
```
Purple (#667eea)      Primary color, headers, highlights
Gray (#333)           Text, body
Blue (#0d6efd)        Links, hover states
Green (#28a745)       Success, completed
Red (#dc3545)         Danger, required, errors
Yellow (#ffc107)      Warning, caution
```

---

## 📱 Mobile Usage

### On Mobile Phone:
```
1. Navigation bar collapses to hamburger ≡
2. Sidebar moves to top (full width)
3. Function list is full width
4. Details panel stacks below
5. All buttons are touch-friendly (larger)
6. Scroll to navigate
```

### Mobile Tips:
```
✅ Landscape mode better for code examples
✅ Use search to reduce scrolling
✅ Tap category to filter functions
✅ Double-tap to copy code
```

---

## 🆘 Troubleshooting

### "I don't see the Docs page"
```
✓ Make sure app is running (ng serve)
✓ Go to http://localhost:4200/docs
✓ Refresh page (Ctrl+R or Cmd+R)
✓ Check browser console for errors
```

### "Code copy doesn't work"
```
✓ Allow clipboard access in browser
✓ Check browser console
✓ Try different function
✓ Manual copy: Ctrl+A → Ctrl+C
```

### "Search results are empty"
```
✓ Try different search term
✓ Check spelling (case-insensitive)
✓ Clear search box & try category filter
✓ Refresh page
```

### "Progress bar doesn't update"
```
✓ Make sure checkbox is checked
✓ Refresh page to persist
✓ Try different step
✓ Check browser console
```

---

## 📞 Need Help?

### For API Documentation Questions:
1. Use search function
2. Read "When to Use" section
3. Read "Best Practices" section
4. Check error codes for solutions

### For Setup Questions:
1. Follow steps in order
2. Copy code examples carefully
3. Read Pro Tips section
4. Check prerequisites

### For Technical Issues:
1. Open browser console (F12)
2. Check for error messages
3. Refresh page
4. Clear browser cache

---

## ✨ Features Overview

| Feature | Location | How to Use |
|---------|----------|-----------|
| **Search** | /docs - top | Type to search functions |
| **Filter** | /docs - sidebar | Click category to filter |
| **Details** | /docs - right panel | Click function card |
| **Copy Code** | /docs & /setup | Click copy button |
| **Progress** | /setup - header | Visual percentage |
| **Steps** | /setup - sidebar | Click to navigate |
| **Mark Complete** | /setup - steps | Check checkbox |

---

## 🎓 Learning Path

### For New Users:
```
1. Start with /setup page
2. Follow all 8 steps
3. Understand prerequisites & setup
4. Then go to /docs
5. Read API documentation
6. Copy code examples
7. Implement in your project
```

### For Experienced Users:
```
1. Go directly to /docs
2. Search specific functions
3. Copy needed code examples
4. Refer to best practices
5. Implement immediately
```

---

## 🎉 Summary

**You now have:**
- ✅ 16 API functions documented
- ✅ 8 setup steps with code examples
- ✅ Interactive search & filter
- ✅ Copy-to-clipboard functionality
- ✅ Best practices for each function
- ✅ Error handling documentation
- ✅ Backend & Frontend code examples
- ✅ Progress tracking

**Next Steps:**
1. Open `/docs` for API documentation
2. Open `/setup` for setup guide
3. Copy code examples into your project
4. Follow best practices
5. Happy coding! 🚀

---

**Enjoy your Interactive Keycloak Documentation Portal!** 📚✨
