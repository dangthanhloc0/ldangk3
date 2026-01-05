# 📚 Hướng Dẫn Keycloak Library - Chi Tiết & Dễ Hiểu

## 🎯 Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
3. [Các Tính Năng Chính](#các-tính-năng-chính)
4. [Cài Đặt & Cấu Hình](#cài-đặt--cấu-hình)
5. [Hướng Dẫn Sử Dụng Chi Tiết](#hướng-dẫn-sử-dụng-chi-tiết)
6. [API Reference](#api-reference)
7. [Xử Lý Lỗi](#xử-lý-lỗi)
8. [Các Lỗi Phổ Biến & Giải Pháp](#các-lỗi-phổ-biến--giải-pháp)
9. [Best Practices](#best-practices)

---

## Giới Thiệu

### KeyCloak Library là gì?

KeyCloak Library là một **thư viện Java Spring Boot** giúp bạn dễ dàng tích hợp **Keycloak** (một hệ thống quản lý danh tính và truy cập mã nguồn mở) vào ứng dụng của mình.

```
┌─────────────────────┐
│  Ứng Dụng của bạn   │
│  (Spring Boot)      │
└──────────┬──────────┘
           │
           │ Sử dụng
           ↓
┌─────────────────────────┐
│ KeyCloak Library        │
│ (Thư viện này)          │
└──────────┬──────────────┘
           │
           │ Gọi API
           ↓
┌─────────────────────────┐
│ Keycloak Server         │
│ (Quản lý danh tính)     │
└──────────┬──────────────┘
           │
           │ Lưu trữ
           ↓
┌─────────────────────────┐
│ Database (PostgreSQL)   │
│ (Cơ sở dữ liệu)         │
└─────────────────────────┘
```

### Lợi Ích

| Lợi Ích | Mô Tả |
|---------|-------|
| ✅ **Đơn Giản** | Không cần học REST API phức tạp của Keycloak |
| ✅ **An Toàn** | Xử lý token, mã hóa mật khẩu tự động |
| ✅ **Nhanh Chóng** | Integrate chỉ trong vài phút |
| ✅ **Linh Hoạt** | Hỗ trợ mọi tính năng của Keycloak |
| ✅ **Bảo Mật** | Tuân theo OAuth2 & OpenID Connect |

---

## Yêu Cầu Hệ Thống

### Phần Mềm Bắt Buộc

```
Java 17 hoặc cao hơn
└─ Lý do: Keycloak yêu cầu Java 17+ để chạy

Spring Boot 3.x hoặc cao hơn
└─ Lý do: Tương thích với phiên bản mới nhất

Maven 3.6.0 hoặc cao hơn
└─ Lý do: Để build và quản lý dependencies

Keycloak 26.x (mới nhất)
└─ Lý do: Phiên bản ổn định nhất
```

### Phần Mềm Tùy Chọn

| Phần Mềm | Mục Đích |
|----------|---------|
| Docker | Chạy Keycloak trong container |
| PostgreSQL | Database để lưu trữ user (recommended) |
| MySQL | Database thay thế PostgreSQL |
| Git | Quản lý mã nguồn |

### Kiểm Tra Cấu Hình Máy

```bash
# Kiểm tra Java version
java -version
# Kỳ vọng: openjdk version "17" hoặc cao hơn

# Kiểm tra Maven
mvn -version
# Kỳ vọng: Apache Maven 3.6.0 hoặc cao hơn

# Kiểm tra Docker (nếu dùng)
docker --version
# Kỳ vọng: Docker version 20.x hoặc cao hơn
```

---

## Các Tính Năng Chính

### 1️⃣ **Xác Thực (Authentication)**

#### Đăng Nhập
```
Người dùng nhập username + password
         ↓
Gửi đến Keycloak
         ↓
Keycloak xác minh
         ↓
Trả về 2 tokens:
  • access_token (dùng gọi API)
  • refresh_token (dùng làm mới token)
```

**Ví dụ thực tế:**
- Người dùng đăng nhập vào ứng dụng
- Ứng dụng lưu access_token
- Dùng access_token để gọi API tiếp theo

#### Làm Mới Token
```
Access token hết hạn
         ↓
Dùng refresh_token
         ↓
Lấy access_token mới
         ↓
Tiếp tục sử dụng API
```

#### Đăng Xuất
```
Người dùng click "Đăng xuất"
         ↓
Gửi refresh_token để vô hiệu hóa
         ↓
Keycloak xóa session
         ↓
Người dùng logout
```

### 2️⃣ **Quản Lý Người Dùng (User Management)**

#### Các Thao Tác Có Thể Làm

| Thao Tác | Mô Tả | Ai Làm Được |
|----------|-------|-------------|
| Đăng Ký | Tạo user mới | Bất kỳ ai |
| Tìm User | Lấy thông tin user | Admin |
| Cập Nhật | Sửa tên, email, v.v | User + Admin |
| Đổi Mật Khẩu | User đổi mật khẩu của mình | User |
| Reset Mật Khẩu | Admin đặt mật khẩu mới | Admin |
| Kích Hoạt/Vô Hiệu | Cho phép/cấm user đăng nhập | Admin |

#### Ví Dụ Quy Trình Đăng Ký

```
Người dùng điền form:
  - Username: john.doe
  - Email: john@example.com
  - FirstName: John
  - LastName: Doe
  - Password: SecurePass123
           ↓
Ứng dụng gửi thông tin
           ↓
Keycloak kiểm tra:
  ✓ Username chưa tồn tại?
  ✓ Email hợp lệ?
  ✓ Mật khẩu đủ mạnh?
           ↓
Nếu hợp lệ → Tạo user
           ↓
Trả về user info
```

### 3️⃣ **Quản Lý Vai Trò (Role Management)**

#### 2 Loại Vai Trò

**Realm Roles (Vai Trò Toàn Cục)**
```
admin, user, moderator, ...
        ↓
Áp dụng cho toàn bộ realm
        ↓
Ai là admin thì truy cập tất cả tính năng admin
```

**Client Roles (Vai Trò Ứng Dụng)**
```
user-admin, content-editor, viewer, ...
        ↓
Áp dụng cho một ứng dụng cụ thể
        ↓
Có thể là admin của app A nhưng user của app B
```

#### Ví Dụ Thực Tế

```
Công ty XYZ có 3 ứng dụng:
  1. Admin Portal (app-admin)
  2. Employee App (app-employee)
  3. Customer Portal (app-customer)

User: john.doe
  Realm Roles: user (áp dụng cho tất cả)
  Client Roles:
    - app-admin: admin
    - app-employee: manager
    - app-customer: viewer

Kết quả:
  • john.doe là admin của app-admin
  • john.doe là manager của app-employee
  • john.doe là viewer của app-customer
```

### 4️⃣ **Quản Lý Token (Token Management)**

#### Token là gì?

Token là một **chuỗi mã** chứa thông tin về user. Giống như **vé vào sự kiện**:
- Vé có tên chủ nhân
- Vé có hạn sử dụng
- Vé không thể giả mạo (được ký)

#### 2 Loại Token

**Access Token**
```
Dùng để: Gọi API
Thời hạn: 5 phút (mặc định)
Nội dung: username, role, email, v.v.
```

**Refresh Token**
```
Dùng để: Lấy access token mới
Thời hạn: 7 ngày (mặc định)
Nội dung: Chứa reference để lấy token mới
```

#### Quy Trình Token

```
Đăng nhập
  ↓
Nhận: access_token (5 phút) + refresh_token (7 ngày)
  ↓
Dùng access_token gọi API
  ↓
Sau 5 phút → access_token hết hạn
  ↓
Dùng refresh_token để lấy access_token mới
  ↓
Tiếp tục dùng API
```

---

## Cài Đặt & Cấu Hình

### Bước 1: Clone & Build

```bash
# Clone repository
git clone https://github.com/dangthanhloc0/KeyCloackLibrary.git

# Vào thư mục
cd KeyCloackLibrary

# Build bằng Maven
mvn clean install

# Hoặc build chỉ core module
cd authz-core
mvn clean install
```

### Bước 2: Cài Đặt Keycloak

#### Cách 1: Dùng Docker (Dễ Nhất) ⭐

```bash
# Tải và chạy Keycloak
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev

# Truy cập Admin Console
# URL: http://localhost:8080/admin
# Username: admin
# Password: admin
```

**Ưu điểm:**
- ✅ Cài đặt trong 10 giây
- ✅ Không ảnh hưởng hệ thống
- ✅ Dễ xóa khi không cần

#### Cách 2: Download từ Keycloak.org

```bash
# Download (thay 26.0.0 bằng version mới nhất)
wget https://github.com/keycloak/keycloak/releases/download/26.0.0/keycloak-26.0.0.tar.gz

# Giải nén
tar -xzf keycloak-26.0.0.tar.gz
cd keycloak-26.0.0

# Chạy
./bin/kc.sh start-dev

# Truy cập
# http://localhost:8080/admin
```

### Bước 3: Cấu Hình Keycloak

#### 3.1 Đăng Nhập Admin Console

1. Truy cập: `http://localhost:8080/admin`
2. Username: `admin`
3. Password: `admin`

#### 3.2 Tạo Realm (Miền)

```
Realm = Một "không gian" riêng biệt trong Keycloak
Ví dụ:
  • ApplicationRealm (cho ứng dụng chính)
  • TestRealm (cho testing)
  • CompanyARealm (cho công ty A)
```

**Các bước:**
1. Click "Manage realms" (trên cùng bên trái)
2. Click "Create realm"
3. Nhập tên: `ApplicationRealm`
4. Click "Create"

#### 3.3 Tạo Client (Ứng Dụng)

```
Client = Ứng dụng của bạn (Spring Boot app)
Mỗi ứng dụng cần một Client riêng trong Keycloak
```

**Các bước:**
1. Chọn realm vừa tạo
2. Vào "Clients" → Click "Create"
3. Điền:
   - **Client ID**: `my-app` (tên ứng dụng)
   - **Client Protocol**: `openid-connect`
4. Click "Next"

**Cấu Hình Capability:**
1. **Client authentication**: `ON` (bật)
2. **Authorization**: `ON` (bật)
3. **Standard Flow Enabled**: `ON` (bật)
4. **Direct Access Grants Enabled**: `ON` (bật)
5. Click "Next"

**Cấu Hình URLs:**
1. **Root URL**: `http://localhost:8080`
2. **Home URL**: `/realms/ApplicationRealm/my-app/`
3. **Valid redirect URIs**: `/realms/ApplicationRealm/my-app/*`
4. Click "Save"

#### 3.4 Lấy Client Secret

1. Vào "Clients" → Chọn client vừa tạo
2. Tab "Credentials"
3. Copy giá trị **Client Secret**
   - Cần để cấu hình ứng dụng Spring Boot

### Bước 4: Cấu Hình Spring Boot

#### 4.1 Thêm Dependency vào pom.xml

```xml
<dependency>
    <groupId>org.ldang.keycloack</groupId>
    <artifactId>authz-core</artifactId>
    <version>1.0-SNAPSHOT</version>
    <scope>compile</scope>
</dependency>
```

#### 4.2 Tạo File application.properties

```properties
# ============================================
# Keycloak Server Configuration
# ============================================

# URL của Keycloak Server
keycloak.domainUrl=http://localhost:8080

# Tên realm (tạo ở bước 3.2)
keycloak.realmName=ApplicationRealm

# Client ID (tạo ở bước 3.3)
keycloak.clientId=my-app

# Client Secret (lấy ở bước 3.4)
keycloak.clientSecret=YOUR_CLIENT_SECRET_HERE

# ============================================
# Admin Credentials (để API operations)
# ============================================

# Username của admin user
keycloak.adminUsername=admin

# Password của admin user
keycloak.adminPassword=admin
```

#### 4.3 Tạo File application.yml (Thay Thế)

```yaml
keycloak:
  # URL của Keycloak server
  domainUrl: http://localhost:8080
  
  # Tên realm
  realmName: ApplicationRealm
  
  # Client ID
  clientId: my-app
  
  # Client Secret
  clientSecret: YOUR_CLIENT_SECRET_HERE
  
  # Admin credentials
  adminUsername: admin
  adminPassword: admin
```

---

## Hướng Dẫn Sử Dụng Chi Tiết

### 1. Đăng Nhập (Login)

#### Code Spring Boot

```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private KeyCloakService keycloakService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Gọi Keycloak service
        KCResponse<TokenResponse> response = 
            keycloakService.login(
                request.getUsername(),     // username
                request.getPassword()      // password
            );
        
        // Kiểm tra thành công hay lỗi
        if (response.isSuccess()) {
            // Lấy token từ response
            TokenResponse tokens = response.getData();
            
            return ResponseEntity.ok(tokens);
            // Trả về:
            // {
            //   "access_token": "eyJhbGciOiJSUzI1NiIs...",
            //   "refresh_token": "eyJhbGciOiJSUzI1NiIs...",
            //   "token_type": "Bearer",
            //   "expires_in": 3600
            // }
        }
        
        // Xử lý lỗi
        KCError error = response.getError();
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(Map.of(
                "error": error.getCode(),      // INVALID_USER_NAME_OR_PASSWORD
                "message": error.getMessage()   // Chi tiết lỗi
            ));
    }
}
```

#### Client Frontend Code (Angular/React)

```typescript
// Gửi login request
const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'john.doe',
        password: 'password123'
    })
});

const data = await response.json();

if (response.ok) {
    // Lưu tokens
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    
    // Chuyển hướng đến trang chính
    window.location.href = '/dashboard';
} else {
    // Hiển thị lỗi
    alert('Login failed: ' + data.message);
}
```

#### Quy Trình Chi Tiết

```
┌────────────────────────┐
│ Frontend (Angular)     │
│ User nhập: john.doe   │
│           password123  │
└─────────┬──────────────┘
          │ POST /auth/login
          ↓
┌────────────────────────┐
│ Spring Boot Backend    │
│ Gọi:                  │
│ keycloakService.login()│
└─────────┬──────────────┘
          │ Gọi Keycloak API
          ↓
┌────────────────────────┐
│ Keycloak Server        │
│ Xác minh thông tin    │
│ Tạo tokens            │
└─────────┬──────────────┘
          │
          ↓
┌────────────────────────┐
│ Trả về:               │
│ • access_token        │
│ • refresh_token       │
│ • expires_in: 3600    │
└─────────┬──────────────┘
          │
          ↓
┌────────────────────────┐
│ Frontend               │
│ Lưu tokens            │
│ localStorage          │
└─────────┬──────────────┘
          │
          ↓
┌────────────────────────┐
│ Dashboard              │
│ User đã đăng nhập     │
└────────────────────────┘
```

### 2. Đăng Ký Người Dùng (Register)

#### Code Spring Boot

```java
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    // Tạo user mới
    KCResponse<UserInformation> response = 
        keycloakService.register(
            request,    // Chứa: username, email, firstName, lastName, password
            "user"      // Gán role "user" tự động
        );
    
    if (response.isSuccess()) {
        UserInformation newUser = response.getData();
        
        return ResponseEntity
            .status(HttpStatus.CREATED)  // HTTP 201
            .body(Map.of(
                "message": "User registered successfully",
                "userId": newUser.getId(),
                "username": newUser.getUsername(),
                "email": newUser.getEmail()
            ));
    }
    
    // Xử lý lỗi
    KCError error = response.getError();
    String errorMessage = error.getMessage();
    
    // Có thể là:
    // "Username already exists"
    // "Email already exists"
    // "Password does not meet policy requirements"
    
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(Map.of("error": errorMessage));
}
```

#### Request Body Example

```json
{
  "userName": "john.doe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePass@123"
}
```

#### Response Example

```json
{
  "message": "User registered successfully",
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "username": "john.doe",
  "email": "john@example.com"
}
```

### 3. Làm Mới Token (Refresh Token)

#### Khi Nào Cần Làm Mới?

```
Access token hết hạn sau 5 phút
         ↓
Frontend nhận lỗi 401 Unauthorized
         ↓
Frontend tự động gọi refresh
         ↓
Lấy access token mới
         ↓
Tiếp tục request
```

#### Code Backend

```java
@PostMapping("/refresh-token")
public ResponseEntity<?> refreshToken(
        @RequestBody Map<String, String> request) {
    
    String refreshToken = request.get("refresh_token");
    
    KCResponse<TokenResponse> response = 
        keycloakService.refreshToken(refreshToken);
    
    if (response.isSuccess()) {
        TokenResponse newTokens = response.getData();
        
        return ResponseEntity.ok(newTokens);
        // {
        //   "access_token": "eyJhbGc...",
        //   "refresh_token": "eyJhbGc...",
        //   "expires_in": 3600
        // }
    }
    
    return ResponseEntity
        .status(HttpStatus.UNAUTHORIZED)
        .body(Map.of("error": "Refresh token invalid or expired"));
}
```

#### Code Frontend (Tự Động)

```typescript
// Hàm gọi API có xử lý token hết hạn
async function apiCall(url, options = {}) {
    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    
    // Nếu token hết hạn
    if (response.status === 401) {
        // Làm mới token
        const refreshResponse = await fetch('/auth/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                refresh_token: localStorage.getItem('refresh_token')
            })
        });
        
        if (refreshResponse.ok) {
            const newTokens = await refreshResponse.json();
            
            // Lưu token mới
            localStorage.setItem('access_token', newTokens.access_token);
            localStorage.setItem('refresh_token', newTokens.refresh_token);
            
            // Retry request gốc
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${newTokens.access_token}`
                }
            });
        } else {
            // Refresh thất bại → logout
            window.location.href = '/login';
        }
    }
    
    return response;
}
```

### 4. Xác Thực Token (Token Validation)

#### Code Backend

```java
@PostMapping("/validate-token")
public ResponseEntity<?> validateToken(
        @RequestHeader("Authorization") String bearerToken) {
    
    try {
        // Lấy token từ "Bearer <token>"
        String token = bearerToken.replace("Bearer ", "");
        
        // Xác minh token với Keycloak
        TokenIntrospectionResponse tokenInfo = 
            keycloakService.introspectToken(token);
        
        // Kiểm tra token còn hiệu lực không
        if (!tokenInfo.getActive()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error": "Token is invalid or expired"));
        }
        
        // Token hợp lệ
        return ResponseEntity.ok(Map.of(
            "active": true,
            "username": tokenInfo.getUsername(),
            "userId": tokenInfo.getSubject(),
            "email": tokenInfo.getEmail(),
            "expires_in": tokenInfo.getExp() - (System.currentTimeMillis() / 1000)
        ));
        
    } catch (Exception e) {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error": e.getMessage()));
    }
}
```

### 5. Kiểm Tra Quyền Hạn (Role-Based Access)

#### Code Backend - Bảo Vệ Endpoint

```java
@PostMapping("/admin/create-user")
public ResponseEntity<?> createUser(
        @RequestHeader("Authorization") String bearerToken,
        @RequestBody CreateUserRequest request) {
    
    try {
        // Lấy token
        String token = bearerToken.replace("Bearer ", "");
        
        // Xác thực token
        TokenIntrospectionResponse tokenInfo = 
            keycloakService.introspectToken(token);
        
        if (!tokenInfo.getActive()) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error": "Token invalid"));
        }
        
        // Lấy userId từ token
        String userId = tokenInfo.getSubject();
        
        // Kiểm tra user có role "admin" không
        if (!keycloakService.userHasRealmRole(userId, "admin")) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of("error": "You don't have permission"));
        }
        
        // Nếu user là admin → thực hiện tác vụ
        // ...code tạo user...
        
        return ResponseEntity.ok(Map.of("message": "User created"));
        
    } catch (Exception e) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error": e.getMessage()));
    }
}
```

#### Quy Trình Kiểm Tra Quyền

```
Frontend gửi request + access_token
         ↓
Backend nhận request
         ↓
Kiểm tra token hợp lệ?
  ✗ Token invalid → Return 401
  ✓ Token valid → Tiếp tục
         ↓
Lấy userId từ token
         ↓
Kiểm tra user có role "admin"?
  ✗ Không có → Return 403
  ✓ Có → Thực hiện tác vụ
         ↓
Trả về kết quả
```

### 6. Quản Lý Người Dùng (User Management)

#### Tìm Thông Tin User

```java
@GetMapping("/users/{userId}")
public ResponseEntity<?> getUser(@PathVariable String userId) {
    KCResponse<UserInformation> response = 
        keycloakService.getUserById(userId);
    
    if (response.isSuccess()) {
        UserInformation user = response.getData();
        
        return ResponseEntity.ok(Map.of(
            "id": user.getId(),
            "username": user.getUsername(),
            "email": user.getEmail(),
            "firstName": user.getFirstName(),
            "lastName": user.getLastName(),
            "enabled": user.isEnabled(),
            "realmRoles": user.getRealmRoles(),      // [admin, user]
            "clientRoles": user.getClientRoles()     // {my-app: [editor, viewer]}
        ));
    }
    
    return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body(Map.of("error": "User not found"));
}
```

#### Cập Nhật Thông Tin User

```java
@PutMapping("/users/{userId}")
public ResponseEntity<?> updateUser(
        @PathVariable String userId,
        @RequestBody UpdateUserRequest request) {
    
    // request chứa: firstName, lastName, email, ...
    
    KCResponse<UserInformation> response = 
        keycloakService.updateUserByUserId(userId, request);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of(
            "message": "User updated successfully"
        ));
    }
    
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(Map.of("error": response.getError().getMessage()));
}
```

#### Gán Vai Trò cho User

```java
@PostMapping("/users/{userId}/roles/{roleName}")
public ResponseEntity<?> assignRole(
        @PathVariable String userId,
        @PathVariable String roleName) {
    
    KCResponse<UserInformation> response = 
        keycloakService.assignRealmRole(userId, roleName);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of(
            "message": "Role assigned successfully",
            "role": roleName,
            "user": userId
        ));
    }
    
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(Map.of("error": response.getError().getMessage()));
}
```

#### Xóa Vai Trò khỏi User

```java
@DeleteMapping("/users/{userId}/roles/{roleName}")
public ResponseEntity<?> removeRole(
        @PathVariable String userId,
        @PathVariable String roleName) {
    
    KCResponse<UserInformation> response = 
        keycloakService.removeRealmRoleFromUser(userId, roleName);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of(
            "message": "Role removed successfully"
        ));
    }
    
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response.getError());
}
```

---

## API Reference

### Authentication API

| Hàm | Mô Tả | Trả Về |
|-----|-------|--------|
| `login(username, password)` | Đăng nhập user | TokenResponse |
| `refreshToken(refreshToken)` | Làm mới token | TokenResponse |
| `logout(refreshToken)` | Đăng xuất user | Success/Error |
| `introspectToken(token)` | Kiểm tra token | TokenIntrospectionResponse |
| `decodeToken(token)` | Giải mã JWT | TokenInfoDTO |

### User Management API

| Hàm | Mô Tả | Trả Về |
|-----|-------|--------|
| `register(request)` | Đăng ký user | UserInformation |
| `register(request, role)` | Đăng ký + gán role | UserInformation |
| `getUserById(userId)` | Lấy user theo ID | UserInformation |
| `getUserByUsername(username)` | Lấy user theo tên | UserInformation |
| `updateUserByUserId(userId, request)` | Cập nhật user | UserInformation |
| `enableUserByUserId(userId)` | Kích hoạt user | UserInformation |
| `disableUserByUserId(userId)` | Vô hiệu hóa user | UserInformation |
| `resetPassword(userId, password, temporary)` | Đặt lại mật khẩu | Success/Error |
| `changePassword(username, oldPass, newPass)` | Đổi mật khẩu | Success/Error |

### Role Management API

| Hàm | Mô Tả | Trả Về |
|-----|-------|--------|
| `assignRealmRole(userId, role)` | Gán realm role | UserInformation |
| `assignClientRole(userId, role)` | Gán client role | UserInformation |
| `removeRealmRoleFromUser(userId, role)` | Xóa realm role | UserInformation |
| `removeClientRoleFromUser(userId, role)` | Xóa client role | UserInformation |
| `getAllRolesOfUser(userId)` | Lấy tất cả role | RoleResponse |
| `userHasRealmRole(userId, role)` | Kiểm tra role | boolean |
| `userHasClientRole(userId, role)` | Kiểm tra client role | boolean |

---

## Xử Lý Lỗi

### Cấu Trúc Response

Mỗi response đều có format chuẩn:

```java
KCResponse<T> {
    boolean success;      // true = thành công, false = lỗi
    T data;              // Dữ liệu khi thành công
    KCError error;       // Lỗi khi thất bại
}
```

### Ví Dụ Xử Lý Response

```java
KCResponse<UserInformation> response = keycloakService.getUserById(userId);

// Cách 1: Kiểm tra isSuccess()
if (response.isSuccess()) {
    UserInformation user = response.getData();
    System.out.println("User: " + user.getUsername());
} else {
    KCError error = response.getError();
    System.err.println("Lỗi " + error.getCode() + ": " + error.getMessage());
}

// Cách 2: Optional (Java style)
response.getData()
    .ifPresent(user -> System.out.println(user.getUsername()))
    .orElseThrow(() -> new Exception(response.getError().getMessage()));
```

### Mã Lỗi (Error Codes)

#### Lỗi Xác Thực

| Code | HTTP | Meaning | Giải Pháp |
|------|------|---------|----------|
| `INVALID_USER_NAME_OR_PASSWORD` | 401 | Sai username/password | Kiểm tra thông tin đăng nhập |
| `USER_NOT_FOUND` | 404 | User không tồn tại | Kiểm tra username hoặc đăng ký user |
| `TOKEN_INVALID` | 401 | Token không hợp lệ/hết hạn | Làm mới token hoặc đăng nhập lại |

#### Lỗi Xác Thực (Authorization)

| Code | HTTP | Meaning | Giải Pháp |
|------|------|---------|----------|
| `FORBIDDEN` | 403 | Không có quyền truy cập | Kiểm tra role của user |
| `UNAUTHORIZED` | 401 | Chưa xác thực | Đăng nhập trước |

#### Lỗi Vai Trò

| Code | HTTP | Meaning | Giải Pháp |
|------|------|---------|----------|
| `NOT_FOUND_REALM_ROLE` | 404 | Realm role không tồn tại | Tạo role trước hoặc kiểm tra tên |
| `CLIENT_ROLE_NOT_FOUND` | 404 | Client role không tồn tại | Tạo client role trong Keycloak |

#### Lỗi Dữ Liệu

| Code | HTTP | Meaning | Giải Pháp |
|------|------|---------|----------|
| `VALIDATION_ERROR` | 400 | Dữ liệu không hợp lệ | Kiểm tra input: username, email, password |
| `DUPLICATE` | 409 | Dữ liệu đã tồn tại | Sử dụng username/email khác |

#### Lỗi Kết Nối

| Code | HTTP | Meaning | Giải Pháp |
|------|------|---------|----------|
| `KEYCLOAK_CONNECTION_ERROR` | 503 | Không kết nối được Keycloak | Kiểm tra Keycloak server chạy không |
| `KEYCLOAK_SERVER_ERROR` | 500 | Keycloak gặp lỗi | Kiểm tra log Keycloak |

---

## Các Lỗi Phổ Biến & Giải Pháp

### 1. Lỗi: "Unable to connect to Keycloak server"

**Nguyên Nhân:**
- Keycloak server chưa chạy
- URL Keycloak sai

**Giải Pháp:**
```bash
# Kiểm tra Keycloak chạy không
curl http://localhost:8080/admin

# Nếu lỗi → chạy Keycloak
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev

# Kiểm tra URL cấu hình
# application.properties
keycloak.domainUrl=http://localhost:8080  # ✓ Đúng
keycloak.domainUrl=http://localhost:9000  # ✗ Sai
```

### 2. Lỗi: "Client authentication failed"

**Nguyên Nhân:**
- Client Secret sai
- Client ID sai

**Giải Pháp:**
1. Vào Keycloak Admin Console
2. Vào "Clients" → chọn client
3. Tab "Credentials" → copy Client Secret đúng
4. Cập nhật application.properties

```properties
# Kiểm tra giá trị
keycloak.clientId=my-app
keycloak.clientSecret=YOUR_SECRET_HERE
```

### 3. Lỗi: "Realm not found"

**Nguyên Nhân:**
- Tên realm sai trong cấu hình
- Realm chưa tạo

**Giải Pháp:**
```properties
# Kiểm tra realm name
keycloak.realmName=ApplicationRealm  # ✓ Đúng (case-sensitive)
keycloak.realmName=application       # ✗ Sai

# Hoặc tạo realm trong Keycloak
# Manage realms → Create realm
```

### 4. Lỗi: "Password does not meet policy requirements"

**Nguyên Nhân:**
- Mật khẩu quá yếu
- Keycloak có policy mật khẩu

**Giải Pháp:**
```
Mật khẩu phải:
✓ Dài ít nhất 8 ký tự
✓ Chứa chữ hoa (A-Z)
✓ Chứa chữ thường (a-z)
✓ Chứa số (0-9)
✓ Chứa ký tự đặc biệt (!@#$%)

Ví dụ đúng: SecurePass@123
```

### 5. Lỗi: "User already exists"

**Nguyên Nhân:**
- Username hoặc email đã tồn tại

**Giải Pháp:**
```java
// Kiểm tra user tồn tại trước
boolean exists = keycloakService.isUserExsist(userId);

if (exists) {
    return ResponseEntity.badRequest()
        .body(Map.of("error": "Username already exists"));
}

// Hoặc xử lý error từ response
if (!response.isSuccess() && 
    response.getError().getCode().equals("DUPLICATE")) {
    return ResponseEntity.badRequest()
        .body(Map.of("error": "Username hoặc email đã tồn tại"));
}
```

### 6. Lỗi: "Maven build failed"

**Nguyên Nhân:**
- Java version sai
- Dependencies không tải được

**Giải Pháp:**
```bash
# Kiểm tra Java version
java -version
# Phải là 17 hoặc cao hơn

# Clear Maven cache
mvn clean
rm -rf ~/.m2/repository

# Build lại
mvn clean install
```

---

## Best Practices

### 1️⃣ **Quản Lý Token Một Cách An Toàn**

#### ❌ KHÔNG LÀM

```javascript
// ✗ Lưu token trong localStorage (dễ bị XSS)
localStorage.setItem('access_token', token);

// ✗ Lưu token trong sessionStorage
sessionStorage.setItem('access_token', token);

// ✗ Để token trong URL
window.location.href = '/dashboard?token=' + token;
```

#### ✅ LÀM

```javascript
// ✓ Lưu refresh_token trong HTTP-only cookie (an toàn hơn)
// Từ server set cookie:
Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict

// ✓ Lưu access_token trong memory (app variable)
let accessToken = null;
app.login = (username, password) => {
    // Lấy token từ server
    const tokens = await apiCall('/auth/login', {username, password});
    accessToken = tokens.access_token;  // Lưu trong memory
};

// ✓ Gửi token qua Authorization header
fetch('/api/users', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

### 2️⃣ **Xác Thực Token Một Cách An Toàn**

#### ❌ KHÔNG LÀM

```java
// ✗ Chỉ decode token mà không validate
String userId = decodeToken(token).getUserId();
// → Hacker có thể giả mạo token

// ✗ Tin tưởng token mà không kiểm tra
if (token != null) {
    // → Có thể là token giả
}
```

#### ✅ LÀM

```java
// ✓ Luôn validate token với Keycloak
TokenIntrospectionResponse tokenInfo = 
    keycloakService.introspectToken(token);

if (!tokenInfo.getActive()) {
    return ResponseEntity.status(401).build();
}

// ✓ Kiểm tra expiration
long nowSeconds = System.currentTimeMillis() / 1000;
if (tokenInfo.getExp() < nowSeconds) {
    return ResponseEntity.status(401).body("Token expired");
}

// ✓ Kiểm tra scope/roles
if (!keycloakService.userHasRealmRole(tokenInfo.getSub(), "admin")) {
    return ResponseEntity.status(403).body("Forbidden");
}
```

### 3️⃣ **Xử Lý Lỗi Một Cách Chuyên Nghiệp**

#### ❌ KHÔNG LÀM

```java
// ✗ Không kiểm tra response
TokenResponse tokens = keycloakService.login(user, pass).getData();

// ✗ Exception không rõ ràng
try {
    keycloakService.login(user, pass);
} catch (Exception e) {
    return ResponseEntity.status(500).body("Error");
}
```

#### ✅ LÀM

```java
// ✓ Kiểm tra response status
KCResponse<TokenResponse> response = 
    keycloakService.login(username, password);

if (!response.isSuccess()) {
    KCError error = response.getError();
    
    // Xử lý từng loại lỗi khác nhau
    return switch(error.getCode()) {
        case "INVALID_USER_NAME_OR_PASSWORD" -> 
            ResponseEntity.status(401).body("Sai username hoặc password");
        case "USER_NOT_FOUND" -> 
            ResponseEntity.status(404).body("User không tồn tại");
        case "TOKEN_INVALID" -> 
            ResponseEntity.status(401).body("Token hết hạn");
        default -> 
            ResponseEntity.status(500).body("Lỗi server");
    };
}

// ✓ Trả về token hợp lệ
return ResponseEntity.ok(response.getData());
```

### 4️⃣ **Cache Dữ Liệu Để Tăng Performance**

#### Code Example

```java
@Service
public class UserCacheService {
    
    @Autowired
    private KeyCloakService keycloakService;
    
    // Cache user info trong 5 phút
    @Cacheable(value = "users", key = "#userId", 
               unless = "#result == null")
    public UserInformation getUserWithCache(String userId) {
        KCResponse<UserInformation> response = 
            keycloakService.getUserById(userId);
        
        return response.isSuccess() ? response.getData() : null;
    }
    
    // Cache roles trong 10 phút
    @Cacheable(value = "roles", key = "#userId",
               unless = "#result.isEmpty()")
    public List<String> getUserRolesWithCache(String userId) {
        KCResponse<RoleResponse> response = 
            keycloakService.getAllRolesOfUser(userId);
        
        if (response.isSuccess()) {
            return response.getData().getRealmRoles();
        }
        return Collections.emptyList();
    }
}
```

### 5️⃣ **Logging Một Cách Hợp Lý**

#### ❌ KHÔNG LÀM

```java
// ✗ Log password
logger.info("Login: " + username + " / " + password);

// ✗ Log full token
logger.info("Token: " + accessToken);

// ✗ Log dữ liệu nhạy cảm
logger.info("User email: " + user.getEmail());
```

#### ✅ LÀM

```java
// ✓ Log thành công/thất bại mà không log dữ liệu nhạy cảm
logger.info("User login attempt for: {}", username);

// ✓ Log action mà không log token
logger.info("Token validation successful for user: {}", userId);

// ✓ Log error code mà không log toàn bộ lỗi
if (!response.isSuccess()) {
    logger.warn("Operation failed with error code: {}", 
                response.getError().getCode());
}

// ✓ Log sensitive data chỉ ở DEBUG level
logger.debug("Full response: {}", response);
```

### 6️⃣ **Retry Logic Cho Kết Nối Không Ổn Định**

```java
@Service
public class ResilientKeyCloakService {
    
    @Autowired
    private KeyCloakService keycloakService;
    
    @Retryable(
        maxAttempts = 3,
        delay = 1000,  // Chờ 1 giây trước retry
        backoff = @Backoff(multiplier = 2)  // Tăng gấp đôi mỗi lần
    )
    public KCResponse<UserInformation> getUserWithRetry(String userId) {
        try {
            return keycloakService.getUserById(userId);
        } catch (Exception e) {
            logger.warn("Retry getting user: {}", userId);
            throw new RuntimeException("Failed to get user", e);
        }
    }
}
```

### 7️⃣ **Validate Input Trước Gọi API**

```java
@Service
public class ValidationService {
    
    public boolean validateRegisterRequest(RegisterRequest request) {
        // ✓ Kiểm tra field bắt buộc
        if (request.getUserName() == null || request.getUserName().isEmpty()) {
            throw new ValidationException("Username is required");
        }
        
        // ✓ Kiểm tra format email
        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new ValidationException("Invalid email format");
        }
        
        // ✓ Kiểm tra độ dài mật khẩu
        if (request.getPassword().length() < 8) {
            throw new ValidationException("Password must be at least 8 characters");
        }
        
        // ✓ Kiểm tra mật khẩu có số/chữ hoa/ký tự đặc biệt
        if (!request.getPassword().matches("^(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$")) {
            throw new ValidationException(
                "Password must contain: uppercase, number, special character"
            );
        }
        
        return true;
    }
}
```

---

## Tóm Tắt

### Quy Trình Sử Dụng Keycloak Library

```
1. CÀI ĐẶT
   └─ Maven pom.xml → Dependency

2. CẤU HÌNH
   └─ application.properties → Keycloak settings

3. INJECT SERVICE
   └─ @Autowired KeyCloakService → Sử dụng trong Controller

4. TRIỂN KHAI FEATURES
   ├─ Login → keycloakService.login()
   ├─ Register → keycloakService.register()
   ├─ Check Role → keycloakService.userHasRealmRole()
   └─ Manage User → keycloakService.updateUserByUserId()

5. XỬ LỚI
   └─ Kiểm tra response.isSuccess() → Xử lý error
```

### Kiến Thức Cốt Lõi Cần Nhớ

| Khái Niệm | Ý Nghĩa |
|-----------|---------|
| **Realm** | Không gian riêng trong Keycloak (như công ty) |
| **Client** | Ứng dụng đăng ký với Keycloak |
| **User** | Người dùng của hệ thống |
| **Role** | Vai trò/quyền hạn của user |
| **Token** | Vé xác thực (access + refresh) |
| **Access Token** | Dùng gọi API (5 phút) |
| **Refresh Token** | Dùng lấy access token mới (7 ngày) |

---

**Tài liệu này được viết để dễ hiểu cho mọi level developer. Nếu có câu hỏi, hãy xem lại phần Best Practices!**

Happy Coding! 🚀
