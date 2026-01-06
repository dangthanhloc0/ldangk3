import { Injectable } from '@angular/core';

export interface Parameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  example?: string;
}

export interface ApiFunction {
  id: string;
  name: string;
  category: 'authentication' | 'user-management' | 'role-management' | 'token';
  description: string;
  longDescription: string;
  parameters: Parameter[];
  returns: {
    type: string;
    description: string;
    example: string;
  };
  errorCodes: Array<{
    code: string;
    httpStatus: string;
    meaning: string;
    solution: string;
  }>;
  codeExample: {
    backend: string;
    frontend: string;
  };
  whenToUse: string[];
  bestPractices: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiFunctionService {
  private functions: ApiFunction[] = [
    // ============= AUTHENTICATION =============
    {
      id: 'login',
      name: 'login()',
      category: 'authentication',
      description: 'Đăng nhập người dùng và nhận tokens',
      longDescription: 'Xác thực tên đăng nhập và mật khẩu, trả về access_token (cho các lệnh gọi API) và refresh_token (để gia hạn). Access token hết hạn sau 5 phút, refresh token sau 7 ngày.',
      parameters: [
        {
          name: 'userName',
          type: 'String',
          description: 'User login name (required)',
          required: true,
          example: 'john.doe'
        },
        {
          name: 'password',
          type: 'String',
          description: 'User password (required)',
          required: true,
          example: 'SecurePass@123'
        }
      ],
      returns: {
        type: 'KCResponse<TokenResponse>',
        description: 'Response contains access_token, refresh_token, expires_in',
        example: `{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJSUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}`
      },
      errorCodes: [
        {
          code: 'INVALID_USER_NAME_OR_PASSWORD',
          httpStatus: '401',
          meaning: 'Username or password is incorrect',
          solution: 'Verify the login credentials'
        },
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Create user first or use a different username'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    KCResponse<TokenResponse> response = keycloakService.login(
        request.getUsername(), 
        request.getPassword()
    );
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(response.getData());
    }
    
    return ResponseEntity.status(401).body(response.getError());
}`,
        frontend: `async function login(username: string, password: string) {
    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('refresh_token', data.data.refresh_token);
        return data.data;
    }
    
    throw new Error(data.error.message);
}`
      },
      whenToUse: [
        'When user clicks Login button',
        'Need to authenticate username and password',
        'First time user accesses application'
      ],
      bestPractices: [
        'Always check response.isSuccess() before using data',
        'Save refresh_token in HTTP-only cookie (safer than localStorage)',
        'Store access_token in memory or sessionStorage',
        'Do not log password or token to console'
      ]
    },
    {
      id: 'refreshToken',
      name: 'refreshToken()',
      category: 'authentication',
      description: 'Làm mới access token khi hết hạn',
      longDescription: 'Sử dụng refresh_token để lấy access_token mới mà không cần nhập lại mật khẩu. Giúp duy trì phiên người dùng liên tục.',
      parameters: [
        {
          name: 'refreshToken',
          type: 'String',
          description: 'Refresh token received from login() (required)',
          required: true,
          example: 'eyJhbGciOiJSUzI1NiIs...'
        }
      ],
      returns: {
        type: 'KCResponse<TokenResponse>',
        description: 'Response contains new access_token and new refresh_token',
        example: `{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJSUzI1NiIs...",
    "expires_in": 3600
  }
}`
      },
      errorCodes: [
        {
          code: 'TOKEN_INVALID',
          httpStatus: '401',
          meaning: 'Refresh token is invalid or expired',
          solution: 'Request user to login again'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/refresh-token")
public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
    String refreshToken = request.get("refresh_token");
    
    KCResponse<TokenResponse> response = keycloakService.refreshToken(refreshToken);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(response.getData());
    }
    
    return ResponseEntity.status(401).body("Token refresh failed");
}`,
        frontend: `async function refreshAccessToken(refreshToken: string) {
    try {
        const response = await fetch('/auth/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.data.access_token);
            return data.data.access_token;
        } else {
            // Refresh failed → request login again
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        window.location.href = '/login';
    }
}`
      },
      whenToUse: [
        'When access_token expires (5 minutes)',
        'Before calling API if token is about to expire',
        'Automatically refresh in background'
      ],
      bestPractices: [
        'Implement automatic token refresh before expiration',
        'Have retry mechanism if refresh fails',
        'If refresh token also expires → force login again',
        'Use HTTP Interceptor for automatic token refresh'
      ]
    },
    {
      id: 'logout',
      name: 'logout()',
      category: 'authentication',
      description: 'Đăng xuất và vô hiệu hóa refresh token',
      longDescription: 'Vô hiệu hóa refresh_token trên máy chủ Keycloak. Sau khi đăng xuất, người dùng không thể sử dụng refresh_token để lấy token mới nữa.',
      parameters: [
        {
          name: 'refreshToken',
          type: 'String',
          description: 'Refresh token to invalidate',
          required: true,
          example: 'eyJhbGciOiJSUzI1NiIs...'
        }
      ],
      returns: {
        type: 'KCResponse<?>',
        description: 'Response contains only success/error, no data',
        example: `{
  "success": true,
  "data": null
}`
      },
      errorCodes: [
        {
          code: 'TOKEN_INVALID',
          httpStatus: '401',
          meaning: 'Refresh token is invalid',
          solution: 'Token may have already been logged out'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/logout")
public ResponseEntity<?> logout(
        @RequestHeader("Authorization") String bearerToken) {
    // Get token from header
    String refreshToken = extractRefreshTokenFromStorage(bearerToken);
    
    KCResponse<?> response = keycloakService.logout(refreshToken);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
    
    return ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `async function logout() {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        const response = await fetch('/auth/logout', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            },
            body: JSON.stringify({ refresh_token: refreshToken })
        });
        
        // Delete tokens from client
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Redirect to login
        window.location.href = '/login';
        
    } catch (error) {
        console.error('Logout failed:', error);
    }
}`
      },
      whenToUse: [
        'When user clicks Logout button',
        'When account is disabled',
        'When user changes password'
      ],
      bestPractices: [
        'Always delete tokens from client after logout',
        'Redirect user to login page',
        'Clear all cached user data',
        'Log logout event for audit trail'
      ]
    },
    {
      id: 'introspectToken',
      name: 'introspectToken()',
      category: 'token',
      description: 'Kiểm tra xem token có còn hợp lệ không',
      longDescription: 'Gửi token tới Keycloak để xác minh. Máy chủ kiểm tra chữ ký, thời hết hạn và trạng thái. Trả về thông tin token chi tiết như tên người dùng, vai trò, thời gian hết hạn.',
      parameters: [
        {
          name: 'accessToken',
          type: 'String',
          description: 'Access token to verify (required)',
          required: true,
          example: 'eyJhbGciOiJSUzI1NiIs...'
        }
      ],
      returns: {
        type: 'TokenIntrospectionResponse',
        description: 'Detailed information: active, username, sub (userId), exp, iat, email, roles',
        example: `{
  "active": true,
  "sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "username": "john.doe",
  "email": "john@example.com",
  "exp": 1735524000,
  "iat": 1735520400,
  "aud": "my-app",
  "realm_access": {
    "roles": ["admin", "user"]
  }
}`
      },
      errorCodes: [
        {
          code: 'TOKEN_INVALID',
          httpStatus: '401',
          meaning: 'Token is invalid, fake, or expired',
          solution: 'Request user to refresh token or login again'
        }
      ],
      codeExample: {
        backend: `@GetMapping("/protected-resource")
public ResponseEntity<?> getProtectedResource(
        @RequestHeader("Authorization") String bearerToken) {
    
    // Get token from "Bearer <token>"
    String token = bearerToken.replace("Bearer ", "");
    
    // Check token with Keycloak
    TokenIntrospectionResponse tokenInfo = keycloakService.introspectToken(token);
    
    if (!tokenInfo.getActive()) {
        return ResponseEntity.status(401).body("Token invalid or expired");
    }
    
    // Token hợp lệ → trả về dữ liệu
    return ResponseEntity.ok(Map.of(
        "message", "Hello " + tokenInfo.getUsername(),
        "userId", tokenInfo.getSubjectUserId()
    ));
}`,
        frontend: `async function validateToken(accessToken: string) {
    try {
        const response = await fetch('/validate-token', {
            method: 'POST',
            headers: { 
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const tokenInfo = await response.json();
            console.log('Token valid until:', new Date(tokenInfo.exp * 1000));
            return tokenInfo;
        } else {
            console.error('Token is invalid');
            return null;
        }
    } catch (error) {
        console.error('Token validation failed:', error);
        return null;
    }
}`
      },
      whenToUse: [
        'Before processing request with Authorization',
        'Check if token is still valid',
        'Get user information from token (username, roles)',
        'Use in middleware/filter'
      ],
      bestPractices: [
        'Always validate token on server, not just on client',
        'Cache introspection result for 5-10 minutes to reduce API calls',
        'Check expiration time before using token',
        'Implement introspection in HTTP Interceptor'
      ]
    },
    {
      id: 'decodeToken',
      name: 'decodeToken()',
      category: 'token',
      description: 'Giải mã JWT token (KHÔNG xác thực)',
      longDescription: 'Chỉ giải mã JWT mà không kiểm tra chữ ký. Dùng để đọc thông tin từ token mà không cần gọi API. CẢNH BÁO: Không sử dụng để kiểm tra bảo mật, chỉ để đọc thông tin.',
      parameters: [
        {
          name: 'token',
          type: 'String',
          description: 'JWT token to decode',
          required: true,
          example: 'eyJhbGciOiJSUzI1NiIs...'
        }
      ],
      returns: {
        type: 'KCResponse<TokenInfoDTO>',
        description: 'Decoded information from token (not validated)',
        example: `{
  "success": true,
  "data": {
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "email": "john@example.com",
    "realmRoles": ["admin", "user"],
    "clientRoles": {"my-app": ["editor", "viewer"]}
  }
}`
      },
      errorCodes: [
        {
          code: 'UNKNOWN_ERROR',
          httpStatus: '500',
          meaning: 'Token is not a valid JWT',
          solution: 'Check token format, use introspectToken instead'
        }
      ],
      codeExample: {
        backend: `// ⚠️ Only for reading information, NOT for security checks!
@GetMapping("/token-info")
public ResponseEntity<?> getTokenInfo(
        @RequestHeader("Authorization") String bearerToken) {
    
    String token = bearerToken.replace("Bearer ", "");
    
    KCResponse<TokenInfoDTO> response = keycloakService.decodeToken(token);
    
    if (response.isSuccess()) {
        TokenInfoDTO info = response.getData();
        return ResponseEntity.ok(info);
    }
    
    return ResponseEntity.status(400).body("Invalid token");
}`,
        frontend: `// ⚠️ Do not use for security checks on client!
function getTokenInfo(token: string) {
    try {
        const parts = token.split('.');
        const decoded = JSON.parse(atob(parts[1]));
        console.log('Token info:', decoded);
        return decoded;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}`
      },
      whenToUse: [
        'For logging token information',
        'Display username/email on UI',
        'Debug JWT token',
        'Only for informational purposes, NOT for security'
      ],
      bestPractices: [
        '⚠️ NEVER use decodeToken for security checks (always use introspectToken)',
        'To validate signature and expiration, must use introspectToken',
        'Hackers can create fake tokens if you only decode without validation',
        'Only use for reading display information, not for authorization'
      ]
    },

    // ============= USER MANAGEMENT =============
    {
      id: 'register',
      name: 'register()',
      category: 'user-management',
      description: 'Tạo người dùng mới',
      longDescription: 'Đăng ký người dùng mới trong Keycloak. Hai phiên bản: register(request) để tạo người dùng mà không gán vai trò, hoặc register(request, role) để tự động gán vai trò.',
      parameters: [
        {
          name: 'request',
          type: 'RegisterRequest',
          description: 'Contains: userName, email, firstName, lastName, password (required)',
          required: true,
          example: `{
  "userName": "john.doe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePass@123"
}`
        },
        {
          name: 'role (optional)',
          type: 'String',
          description: 'Realm role to auto-assign (example: "user", "admin")',
          required: false,
          example: 'user'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'Information of newly created user',
        example: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "enabled": true,
    "realmRoles": ["user"],
    "clientRoles": {}
  }
}`
      },
      errorCodes: [
        {
          code: 'VALIDATION_ERROR',
          httpStatus: '400',
          meaning: 'Email/username invalid or password too weak',
          solution: 'Check email format, password must have: UPPERCASE, lowercase, number, special character'
        },
        {
          code: 'DUPLICATE',
          httpStatus: '409',
          meaning: 'Username or email already exists',
          solution: 'Use different username/email or find old user'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    // Version 1: Register without assigning role
    // KCResponse<UserInformation> response = keycloakService.register(request);
    
    // Version 2: Register + auto-assign role "user"
    KCResponse<UserInformation> response = keycloakService.register(request, "user");
    
    if (response.isSuccess()) {
        UserInformation newUser = response.getData();
        return ResponseEntity.status(201).body(newUser);  // HTTP 201 Created
    }
    
    KCError error = response.getError();
    return ResponseEntity.status(400).body(Map.of(
        "error", error.getCode(),
        "message", error.getMessage()
    ));
}`,
        frontend: `async function register(formData: RegisterFormData) {
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: formData.username,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password
            })
        });
        
        const data = await response.json();
        
        if (response.status === 201) {
            alert('Registration successful! Please login.');
            window.location.href = '/login';
            return data.data;
        } else {
            alert('Registration failed: ' + data.message);
            return null;
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
}`
      },
      whenToUse: [
        'When user creates new account',
        'Admin create account for other user',
        'Automatically create user during onboarding'
      ],
      bestPractices: [
        'Validate password on client before sending',
        'Send email confirmation after register',
        'Assign default role "user" to new user',
        'Do not log email/password',
        'Check if username/email already exists first'
      ]
    },
    {
      id: 'getUserById',
      name: 'getUserById()',
      category: 'user-management',
      description: 'Get user information by ID',
      longDescription: 'Truy vấn Keycloak để lấy hồ sơ người dùng đầy đủ bao gồm: tên, email, vai trò, trạng thái tài khoản.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID (bắt buộc)',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'Thông tin người dùng hoàn chỉnh',
        example: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "enabled": true,
    "realmRoles": ["admin", "user"],
    "clientRoles": {
      "my-app": ["editor", "viewer"],
      "admin-portal": ["admin"]
    }
  }
}`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'ID người dùng không tồn tại',
          solution: 'Kiểm tra ID người dùng hoặc sử dụng getUserByUsername thay thế'
        }
      ],
      codeExample: {
        backend: `@GetMapping("/users/{userId}")
public ResponseEntity<?> getUser(@PathVariable String userId) {
    KCResponse<UserInformation> response = keycloakService.getUserById(userId);
    
    if (response.isSuccess()) {
        UserInformation user = response.getData();
        return ResponseEntity.ok(user);
    }
    
    return ResponseEntity.status(404).body(
        Map.of("error", "User not found")
    );
}`,
        frontend: `async function getUserInfo(userId: string) {
    const response = await fetch(\`/users/\${userId}\`, {
        headers: { 
            'Authorization': 'Bearer ' + getAccessToken()
        }
    });
    
    if (response.ok) {
        const user = await response.json();
        console.log('User:', user.data);
        return user.data;
    }
}`
      },
      whenToUse: [
        'Lấy hồ sơ người dùng để hiển thị',
        'Kiểm tra thông tin người dùng trước khi xử lý',
        'Hiển thị vai trò người dùng',
        'Quản trị viên xem thông tin người dùng'
      ],
      bestPractices: [
        'Lưu kết quả trong 5-10 phút',
        'Không tiết lộ userId công khai',
        'Xác thực định dạng userId trước khi sử dụng',
        'Kiểm tra quyền (quản trị viên hoặc bản thân người dùng)'
      ]
    },
    {
      id: 'updateUser',
      name: 'updateUserByUserId()',
      category: 'user-management',
      description: 'Cập nhật thông tin người dùng',
      longDescription: 'Chỉnh sửa thông tin người dùng như firstName, lastName, email. Quản trị viên có thể cập nhật bất kỳ người dùng nào, người dùng thông thường chỉ có thể cập nhật của họ.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'UUID of user to update',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        },
        {
          name: 'request',
          type: 'UpdateUserRequest',
          description: 'Data to update: firstName, lastName, email, enabled',
          required: true,
          example: `{
  "firstName": "Jonathan",
  "lastName": "Doe",
  "email": "jonathan@example.com"
}`
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'User information after update',
        example: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "firstName": "Jonathan",
    "lastName": "Doe",
    "email": "jonathan@example.com",
    "enabled": true
  }
}`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        },
        {
          code: 'DUPLICATE',
          httpStatus: '409',
          meaning: 'Email already in use',
          solution: 'Use different email'
        }
      ],
      codeExample: {
        backend: `@PutMapping("/users/{userId}")
public ResponseEntity<?> updateUser(
        @PathVariable String userId,
        @RequestBody UpdateUserRequest request) {
    
    KCResponse<UserInformation> response = 
        keycloakService.updateUserByUserId(userId, request);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(response.getData());
    }
    
    return ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `async function updateProfile(userId: string, updates: any) {
    const response = await fetch(\`/users/\${userId}\`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getAccessToken()
        },
        body: JSON.stringify(updates)
    });
    
    if (response.ok) {
        const updated = await response.json();
        alert('Profile updated successfully');
        return updated.data;
    }
}`
      },
      whenToUse: [
        'User updates own profile',
        'Admin edits user information',
        'Batch update user from CSV import'
      ],
      bestPractices: [
        'Validate email format before update',
        'Check permission: only user or admin can edit',
        'Log changes for audit trail',
        'Refresh user cache after update'
      ]
    },
    {
      id: 'resetPassword',
      name: 'resetPassword()',
      category: 'user-management',
      description: 'Quản trị viên đặt lại mật khẩu cho người dùng',
      longDescription: 'Quản trị viên có thể đặt mật khẩu mới cho người dùng mà không biết mật khẩu cũ. Có tùy chọn bắt người dùng thay đổi mật khẩu khi đăng nhập lần đầu.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        },
        {
          name: 'newPassword',
          type: 'String',
          description: 'New password (must be strong)',
          required: true,
          example: 'SecurePass@123'
        },
        {
          name: 'temporary',
          type: 'boolean',
          description: 'true = user must change password on first login, false = use immediately',
          required: true,
          example: 'false'
        }
      ],
      returns: {
        type: 'KCResponse<?>',
        description: 'Only returns success/error, no data',
        example: `{
  "success": true,
  "data": null
}`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        },
        {
          code: 'VALIDATION_ERROR',
          httpStatus: '400',
          meaning: 'Password does not meet policy',
          solution: 'Password must have: UPPERCASE, lowercase, number, special character'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/admin/users/{userId}/reset-password")
public ResponseEntity<?> resetPassword(
        @PathVariable String userId,
        @RequestBody Map<String, Object> request) {
    
    String newPassword = (String) request.get("password");
    Boolean temporary = (Boolean) request.getOrDefault("temporary", false);
    
    KCResponse<?> response = keycloakService.resetPassword(
        userId, 
        newPassword, 
        temporary
    );
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of("message", "Password reset"));
    }
    
    return ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `async function resetUserPassword(userId: string, newPassword: string) {
    const response = await fetch(\`/admin/users/\${userId}/reset-password\`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getAdminToken()
        },
        body: JSON.stringify({
            password: newPassword,
            temporary: false  // User use immediately
        })
    });
    
    if (response.ok) {
        alert('Password reset successfully');
    }
}`
      },
      whenToUse: [
        'Admin reset password for forgot user',
        'Force user to change password on first login',
        'Security incident → reset all passwords'
      ],
      bestPractices: [
        'Only admin can call this function',
        'Always use HTTPS',
        'Log who reset password for whom',
        'Send email notification to user',
        'If temporary=true, user must change password immediately'
      ]
    },
    {
      id: 'changePassword',
      name: 'changePassword()',
      category: 'user-management',
      description: 'Người dùng tự thay đổi mật khẩu của mình',
      longDescription: 'Người dùng tự thay đổi mật khẩu bằng cách cung cấp mật khẩu cũ. An toàn hơn đặt lại mật khẩu vì mật khẩu cũ phải được xác minh.',
      parameters: [
        {
          name: 'userName',
          type: 'String',
          description: 'Username',
          required: true,
          example: 'john.doe'
        },
        {
          name: 'oldPassword',
          type: 'String',
          description: 'Old password (for verification)',
          required: true,
          example: 'OldPass@123'
        },
        {
          name: 'newPassword',
          type: 'String',
          description: 'New password',
          required: true,
          example: 'NewPass@456'
        }
      ],
      returns: {
        type: 'KCResponse<?>',
        description: 'Success/error response',
        example: `{
  "success": true,
  "data": null
}`
      },
      errorCodes: [
        {
          code: 'INVALID_USER_NAME_OR_PASSWORD',
          httpStatus: '401',
          meaning: 'Old password is wrong',
          solution: 'Re-enter old password correctly'
        },
        {
          code: 'VALIDATION_ERROR',
          httpStatus: '400',
          meaning: 'New password is invalid',
          solution: 'New password must be different from old password and meet policy'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/change-password")
public ResponseEntity<?> changePassword(
        @RequestHeader("Authorization") String bearerToken,
        @RequestBody Map<String, String> request) {
    
    // Get username from token
    String token = bearerToken.replace("Bearer ", "");
    TokenIntrospectionResponse tokenInfo = keycloakService.introspectToken(token);
    
    String username = tokenInfo.getUsername();
    String oldPassword = request.get("oldPassword");
    String newPassword = request.get("newPassword");
    
    KCResponse<?> response = keycloakService.changePassword(
        username, 
        oldPassword, 
        newPassword
    );
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of("message", "Password changed"));
    }
    
    return ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `async function changePassword(
    oldPassword: string, 
    newPassword: string,
    confirmPassword: string) {
    
    // Client-side validation
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (newPassword === oldPassword) {
        alert('New password must be different');
        return;
    }
    
    const response = await fetch('/change-password', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getAccessToken()
        },
        body: JSON.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword
        })
    });
    
    if (response.ok) {
        alert('Password changed successfully');
    } else {
        alert('Failed to change password');
    }
}`
      },
      whenToUse: [
        'User wants to change own password',
        'User periodically change password (security policy)',
        'User feels password is compromised'
      ],
      bestPractices: [
        'Require old password → more secure',
        'New password must be different from old password',
        'Validate password strength',
        'Send email confirmation after change',
        'Logout all old sessions after password change'
      ]
    },

    // ============= ROLE MANAGEMENT =============
    {
      id: 'assignRealmRole',
      name: 'assignRealmRole()',
      category: 'role-management',
      description: 'Gán vai trò realm cho người dùng',
      longDescription: 'Gán vai trò toàn cầu (vai trò realm) cho người dùng. Vai trò realm áp dụng cho toàn bộ realm, không giới hạn ở một ứng dụng cụ thể.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        },
        {
          name: 'roleName',
          type: 'String',
          description: 'Role name to assign (example: admin, moderator, user)',
          required: true,
          example: 'admin'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'User info with new role added to realmRoles list',
        example: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "realmRoles": ["user", "admin"],
    "clientRoles": {...}
  }
}`
      },
      errorCodes: [
        {
          code: 'NOT_FOUND_REALM_ROLE',
          httpStatus: '404',
          meaning: 'Role does not exist',
          solution: 'Create role first or check role name'
        },
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/admin/users/{userId}/realm-roles/{roleName}")
public ResponseEntity<?> assignRealmRole(
        @PathVariable String userId,
        @PathVariable String roleName) {
    
    KCResponse<UserInformation> response = 
        keycloakService.assignRealmRole(userId, roleName);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of(
            "message", "Role assigned",
            "role", roleName,
            "user", userId
        ));
    }
    
    return ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `async function assignAdminRole(userId: string) {
    const response = await fetch(
        \`/admin/users/\${userId}/realm-roles/admin\`, 
        {
            method: 'POST',
            headers: { 
                'Authorization': 'Bearer ' + getAdminToken()
            }
        }
    );
    
    if (response.ok) {
        alert('Admin role assigned');
    }
}`
      },
      whenToUse: [
        'Admin promotes user to admin',
        'Assign role "moderator" to user',
        'Bulk assign roles from import'
      ],
      bestPractices: [
        'Only admin can assign role',
        'Validate role exists before assigning',
        'Log who assigns role to whom',
        'Do not assign admin role to new users'
      ]
    },
    {
      id: 'userHasRealmRole',
      name: 'userHasRealmRole()',
      category: 'role-management',
      description: 'Kiểm tra xem người dùng có vai trò không',
      longDescription: 'Kiểm tra xem người dùng có vai trò realm cụ thể không. Trả về boolean (true/false). Thường được sử dụng để kiểm tra quyền trước khi xử lý.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        },
        {
          name: 'roleName',
          type: 'String',
          description: 'Role name to check',
          required: true,
          example: 'admin'
        }
      ],
      returns: {
        type: 'boolean',
        description: 'true = user has role, false = does not have',
        example: 'true'
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Return false or throw exception'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/admin-only-action")
public ResponseEntity<?> adminAction(
        @RequestHeader("Authorization") String bearerToken) {
    
    String token = bearerToken.replace("Bearer ", "");
    TokenIntrospectionResponse tokenInfo = keycloakService.introspectToken(token);
    
    String userId = tokenInfo.getSubjectUserId();
    
    // Check if user has admin role
    if (keycloakService.userHasRealmRole(userId, "admin")) {
        // User is admin → perform admin action
        return ResponseEntity.ok(Map.of("message", "Action performed"));
    } else {
        // User is not admin → deny
        return ResponseEntity.status(403).body(
            Map.of("error", "You are not authorized")
        );
    }
}`,
        frontend: `// Sau khi user login
async function setupUserUI(accessToken: string) {
    // Decode token to get roles (or call API)
    const user = await getUserInfo(accessToken);
    
    if (user.realmRoles.includes('admin')) {
        // Display admin menu
        document.getElementById('admin-menu').style.display = 'block';
    } else {
        document.getElementById('admin-menu').style.display = 'none';
    }
    
    if (user.realmRoles.includes('moderator')) {
        // Display moderator tools
        document.getElementById('moderator-tools').style.display = 'block';
    }
}`
      },
      whenToUse: [
        'Check permission before handling admin action',
        'Decide to show/hide menu',
        'Authenticate role in middleware',
        'Audit log permissions'
      ],
      bestPractices: [
        'Always check role on server, not just client',
        'Do not cache result too long (max 5-10 minutes)',
        'Log access denied attempts',
        'Check role from token, do not trust client'
      ]
    },
    {
      id: 'getAllRolesOfUser',
      name: 'getAllRolesOfUser()',
      category: 'role-management',
      description: 'Lấy tất cả vai trò của người dùng',
      longDescription: 'Lấy danh sách đầy đủ tất cả vai trò realm và vai trò client của người dùng. Trả về đối tượng chứa realmRoles (danh sách) và clientRoles (bản đồ).',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        }
      ],
      returns: {
        type: 'KCResponse<RoleResponse>',
        description: 'Contains realmRoles (list) and clientRoles (map)',
        example: `{
  "success": true,
  "data": {
    "realmRoles": ["admin", "user", "moderator"],
    "clientRoles": {
      "my-app": ["editor", "viewer"],
      "admin-portal": ["admin"],
      "customer-app": ["user"]
    }
  }
}`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        }
      ],
      codeExample: {
        backend: `@GetMapping("/users/{userId}/roles")
public ResponseEntity<?> getUserRoles(@PathVariable String userId) {
    KCResponse<RoleResponse> response = 
        keycloakService.getAllRolesOfUser(userId);
    
    if (response.isSuccess()) {
        RoleResponse roles = response.getData();
        
        return ResponseEntity.ok(Map.of(
            "realmRoles", roles.getRealmRoles(),
            "clientRoles", roles.getClientRoles(),
            "totalRoles", 
                roles.getRealmRoles().size() + 
                roles.getClientRoles().values().stream()
                    .mapToInt(List::size).sum()
        ));
    }
    
    return ResponseEntity.status(404).body("User not found");
}`,
        frontend: `async function displayUserRoles(userId: string) {
    const response = await fetch(\`/users/\${userId}/roles\`, {
        headers: { 'Authorization': 'Bearer ' + getAccessToken() }
    });
    
    if (response.ok) {
        const rolesData = await response.json();
        const { realmRoles, clientRoles } = rolesData.data;
        
        // Display realm roles
        console.log('Realm Roles:', realmRoles);
        
        // Display client roles
        Object.entries(clientRoles).forEach(([clientName, roles]) => {
            console.log(\`\${clientName}: \${roles.join(', ')}\`);
        });
    }
}`
      },
      whenToUse: [
        'Get all user permissions to display',
        'Audit log all roles',
        'Admin review all user permissions',
        'Migrate roles to another system'
      ],
      bestPractices: [
        'Cache result with TTL 5-10 minutes',
        'Use in admin dashboard',
        'Do not expose all roles to client',
        'Periodically check for inappropriate roles'
      ]
    },
    {
      id: 'removeRealmRole',
      name: 'removeRealmRoleFromUser()',
      category: 'role-management',
      description: 'Xóa vai trò realm khỏi người dùng',
      longDescription: 'Xóa vai trò realm khỏi người dùng. Sau đó, người dùng sẽ mất quyền liên quan đến vai trò đó.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        },
        {
          name: 'roleName',
          type: 'String',
          description: 'Role name to remove',
          required: true,
          example: 'admin'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'User info with role removed',
        example: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "realmRoles": ["user"],
    "clientRoles": {...}
  }
}`
      },
      errorCodes: [
        {
          code: 'NOT_FOUND_REALM_ROLE',
          httpStatus: '404',
          meaning: 'Role does not exist',
          solution: 'Check role name'
        },
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        }
      ],
      codeExample: {
        backend: `@DeleteMapping("/admin/users/{userId}/realm-roles/{roleName}")
public ResponseEntity<?> removeRealmRole(
        @PathVariable String userId,
        @PathVariable String roleName) {
    
    KCResponse<UserInformation> response = 
        keycloakService.removeRealmRoleFromUser(userId, roleName);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of(
            "message", "Role removed",
            "role", roleName,
            "user", userId
        ));
    }
    
    return ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `async function demoteUserFromAdmin(userId: string) {
    const response = await fetch(
        \`/admin/users/\${userId}/realm-roles/admin\`, 
        {
            method: 'DELETE',
            headers: { 
                'Authorization': 'Bearer ' + getAdminToken()
            }
        }
    );
    
    if (response.ok) {
        alert('Admin role removed');
    }
}`
      },
      whenToUse: [
        'Admin revokes admin role from user',
        'Remove moderator role',
        'User resign from position'
      ],
      bestPractices: [
        'Only admin can remove role',
        'Log who removes role from whom',
        'Confirm with admin before removing',
        'If removing admin role, invalidate existing sessions'
      ]
    },
    {
      id: 'assignClientRole',
      name: 'assignClientRole()',
      category: 'role-management',
      description: 'Gán vai trò client cho người dùng',
      longDescription: 'Gán vai trò cụ thể của client cho người dùng. Vai trò client được giới hạn trong một ứng dụng client cụ thể và không hiển thị cho các client khác.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        },
        {
          name: 'roleName',
          type: 'String',
          description: 'Client role name to assign',
          required: true,
          example: 'editor'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'User info with new client role added',
        example: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "clientRoles": {
      "my-app": ["editor", "viewer"]
    }
  }
}`
      },
      errorCodes: [
        {
          code: 'UNKNOWN_ERROR',
          httpStatus: '400',
          meaning: 'Client role does not exist',
          solution: 'Create client role first or check role name'
        },
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/admin/users/{userId}/client-roles/{roleName}")
public ResponseEntity<?> assignClientRole(
        @PathVariable String userId,
        @PathVariable String roleName) {
    
    KCResponse<UserInformation> response = 
        keycloakService.assignClientRole(userId, roleName);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of(
            "message", "Client role assigned",
            "role", roleName
        ));
    }
    
    return ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `async function assignEditorRole(userId: string) {
    const response = await fetch(
        \`/admin/users/\${userId}/client-roles/editor\`, 
        {
            method: 'POST',
            headers: { 
                'Authorization': 'Bearer ' + getAdminToken()
            }
        }
    );
    
    if (response.ok) {
        alert('Editor role assigned');
    }
}`
      },
      whenToUse: [
        'Assign editor role to content manager',
        'Give viewer role to guest users',
        'Assign app-specific roles'
      ],
      bestPractices: [
        'Only admin can assign client roles',
        'Validate client role exists first',
        'Log role assignments for audit',
        'Use client roles for app-specific permissions'
      ]
    },
    {
      id: 'getUserByUsername',
      name: 'getUserByUsername()',
      category: 'user-management',
      description: 'Lấy thông tin người dùng theo tên đăng nhập',
      longDescription: 'Truy xuất hồ sơ người dùng đầy đủ theo tên đăng nhập bao gồm tên, email, vai trò và trạng thái tài khoản.',
      parameters: [
        {
          name: 'userName',
          type: 'String',
          description: 'Username to lookup',
          required: true,
          example: 'john.doe'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'Complete user information',
        example: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "enabled": true,
    "realmRoles": ["admin", "user"]
  }
}`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check username or use getUserById instead'
        }
      ],
      codeExample: {
        backend: `@GetMapping("/users/search/{username}")
public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
    KCResponse<UserInformation> response = 
        keycloakService.getUserByUsername(username);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(response.getData());
    }
    
    return ResponseEntity.status(404).body(response.getError());
}`,
        frontend: `async function searchUser(username: string) {
    const response = await fetch(\`/users/search/\${username}\`, {
        headers: { 
            'Authorization': 'Bearer ' + getAccessToken()
        }
    });
    
    if (response.ok) {
        const user = await response.json();
        console.log('Found user:', user.data);
        return user.data;
    }
}`
      },
      whenToUse: [
        'Search user by username instead of ID',
        'Find user before sending friend request',
        'Admin search user in dashboard',
        'Auto-complete user search'
      ],
      bestPractices: [
        'Cache result for 5-10 minutes',
        'Username is case-sensitive',
        'Use getUserById if you have the ID',
        'Sanitize username input to prevent injection'
      ]
    },
    {
      id: 'removeClientRole',
      name: 'removeClientRoleFromUser()',
      category: 'role-management',
      description: 'Xóa vai trò client khỏi người dùng',
      longDescription: 'Hủy một vai trò client được gán trước đó từ người dùng. Vai trò client được giới hạn trong các ứng dụng client cụ thể.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        },
        {
          name: 'roleName',
          type: 'String',
          description: 'Client role name to remove',
          required: true,
          example: 'editor'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'User info with client role removed',
        example: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "clientRoles": {
      "my-app": ["viewer"]
    }
  }
}`
      },
      errorCodes: [
        {
          code: 'UNKNOWN_ERROR',
          httpStatus: '400',
          meaning: 'Client role does not exist',
          solution: 'Check role name'
        },
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        }
      ],
      codeExample: {
        backend: `@DeleteMapping("/admin/users/{userId}/client-roles/{roleName}")
public ResponseEntity<?> removeClientRole(
        @PathVariable String userId,
        @PathVariable String roleName) {
    
    KCResponse<UserInformation> response = 
        keycloakService.removeClientRoleFromUser(userId, roleName);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of("message", "Role removed"));
    }
    
    return ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `async function removeEditorRole(userId: string) {
    const response = await fetch(
        \`/admin/users/\${userId}/client-roles/editor\`, 
        {
            method: 'DELETE',
            headers: { 
                'Authorization': 'Bearer ' + getAdminToken()
            }
        }
    );
    
    if (response.ok) {
        alert('Editor role removed');
    }
}`
      },
      whenToUse: [
        'Revoke editor role from user',
        'Remove viewer access',
        'Downgrade user permissions'
      ],
      bestPractices: [
        'Only admin can remove roles',
        'Log role removals for audit',
        'Confirm before removing critical roles',
        'Refresh user session after removal'
      ]
    },
    {
      id: 'enableUser',
      name: 'enableUserByUserId()',
      category: 'user-management',
      description: 'Kích hoạt người dùng đã bị vô hiệu hóa',
      longDescription: 'Kích hoạt lại tài khoản người dùng đã bị vô hiệu hóa trước đó. Người dùng được kích hoạt có thể đăng nhập và truy cập tài nguyên.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'Updated user with enabled status',
        example: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "enabled": true
  }
}`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/admin/users/{userId}/enable")
public ResponseEntity<?> enableUser(@PathVariable String userId) {
    KCResponse<UserInformation> response = 
        keycloakService.enableUserByUserId(userId);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of("message", "User enabled"));
    }
    
    return ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `async function enableUser(userId: string) {
    const response = await fetch(\`/admin/users/\${userId}/enable\`, {
        method: 'POST',
        headers: { 
            'Authorization': 'Bearer ' + getAdminToken()
        }
    });
    
    if (response.ok) {
        alert('User enabled');
    }
}`
      },
      whenToUse: [
        'Admin reactivates suspended user',
        'Restore access after temporary disable',
        'Reinstate user in system'
      ],
      bestPractices: [
        'Only admin can enable users',
        'Send notification to user when enabled',
        'Log user enable events',
        'Verify user identity before enabling'
      ]
    },
    {
      id: 'disableUser',
      name: 'disableUserByUserId()',
      category: 'user-management',
      description: 'Vô hiệu hóa tài khoản người dùng',
      longDescription: 'Vô hiệu hóa tài khoản người dùng mà không xóa nó. Người dùng bị vô hiệu hóa không thể đăng nhập hoặc truy cập tài nguyên nhưng dữ liệu tài khoản được lưu giữ.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'Updated user with disabled status',
        example: `{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "username": "john.doe",
    "enabled": false
  }
}`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/admin/users/{userId}/disable")
public ResponseEntity<?> disableUser(@PathVariable String userId) {
    KCResponse<UserInformation> response = 
        keycloakService.disableUserByUserId(userId);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(Map.of("message", "User disabled"));
    }
    
    return ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `async function disableUser(userId: string) {
    const response = await fetch(\`/admin/users/\${userId}/disable\`, {
        method: 'POST',
        headers: { 
            'Authorization': 'Bearer ' + getAdminToken()
        }
    });
    
    if (response.ok) {
        alert('User disabled');
    }
}`
      },
      whenToUse: [
        'Suspend user for security reasons',
        'Temporarily block user access',
        'Admin removes user permission',
        'Deactivate employee account'
      ],
      bestPractices: [
        'Only admin can disable users',
        'Log reason for disabling user',
        'Notify user of account suspension',
        'Check for pending transactions before disabling'
      ]
    },
    {
      id: 'enableUserByUsername',
      name: 'enableUserByUserName()',
      category: 'user-management',
      description: 'Kích hoạt người dùng theo tên đăng nhập',
      longDescription: 'Kích hoạt lại tài khoản người dùng bị vô hiệu hóa bằng cách sử dụng tên đăng nhập thay vì ID.',
      parameters: [
        {
          name: 'userName',
          type: 'String',
          description: 'Username to enable',
          required: true,
          example: 'john.doe'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'Enabled user information',
        example: `{
  "success": true,
  "data": {
    "username": "john.doe",
    "enabled": true
  }
}`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check username'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/admin/users/name/{username}/enable")
public ResponseEntity<?> enableUserByName(@PathVariable String username) {
    KCResponse<UserInformation> response = 
        keycloakService.enableUserByUserName(username);
    return response.isSuccess() ? 
        ResponseEntity.ok(response.getData()) :
        ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `await fetch(\`/admin/users/name/john.doe/enable\`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + getAdminToken() }
});`
      },
      whenToUse: [
        'Enable user when username is available',
        'User reactivation via username',
        'Batch enable operations'
      ],
      bestPractices: [
        'Validate username exists first',
        'Use enableUserByUserId for better performance',
        'Log enable events'
      ]
    },
    {
      id: 'disableUserByUsername',
      name: 'disableUserByUserName()',
      category: 'user-management',
      description: 'Vô hiệu hóa người dùng theo tên đăng nhập',
      longDescription: 'Vô hiệu hóa tài khoản người dùng bằng cách sử dụng tên đăng nhập thay vì ID.',
      parameters: [
        {
          name: 'userName',
          type: 'String',
          description: 'Username to disable',
          required: true,
          example: 'john.doe'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'Disabled user information',
        example: `{
  "success": true,
  "data": {
    "username": "john.doe",
    "enabled": false
  }
}`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check username'
        }
      ],
      codeExample: {
        backend: `@PostMapping("/admin/users/name/{username}/disable")
public ResponseEntity<?> disableUserByName(@PathVariable String username) {
    KCResponse<UserInformation> response = 
        keycloakService.disableUserByUserName(username);
    return response.isSuccess() ? 
        ResponseEntity.ok(response.getData()) :
        ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `await fetch(\`/admin/users/name/john.doe/disable\`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + getAdminToken() }
});`
      },
      whenToUse: [
        'Disable user when username is available',
        'Suspend user via username',
        'Batch disable operations'
      ],
      bestPractices: [
        'Validate username exists first',
        'Use disableUserByUserId for better performance',
        'Log disable events'
      ]
    },
    {
      id: 'updateUserByUsername',
      name: 'updateUserByUserName()',
      category: 'user-management',
      description: 'Cập nhật người dùng theo tên đăng nhập',
      longDescription: 'Cập nhật thông tin hồ sơ người dùng (email, tên) bằng cách sử dụng tên đăng nhập thay vì ID. Trả về thông tin người dùng được cập nhật.',
      parameters: [
        {
          name: 'userName',
          type: 'String',
          description: 'Username of user to update',
          required: true,
          example: 'john.doe'
        },
        {
          name: 'updateData',
          type: 'Map<String, Object>',
          description: 'Fields to update (firstName, lastName, email)',
          required: true,
          example: '{"firstName": "Johnny", "email": "johnny@example.com"}'
        }
      ],
      returns: {
        type: 'KCResponse<UserInformation>',
        description: 'Updated user information',
        example: `{
  "success": true,
  "data": {
    "username": "john.doe",
    "email": "johnny@example.com",
    "firstName": "Johnny"
  }
}`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check username'
        },
        {
          code: 'INVALID_EMAIL',
          httpStatus: '400',
          meaning: 'Email format invalid',
          solution: 'Provide valid email address'
        }
      ],
      codeExample: {
        backend: `@PutMapping("/admin/users/name/{username}")
public ResponseEntity<?> updateUserByName(
        @PathVariable String username,
        @RequestBody Map<String, Object> updateData) {
    
    KCResponse<UserInformation> response = 
        keycloakService.updateUserByUserName(username, updateData);
    
    return response.isSuccess() ?
        ResponseEntity.ok(response.getData()) :
        ResponseEntity.status(400).body(response.getError());
}`,
        frontend: `await fetch(\`/admin/users/name/john.doe\`, {
    method: 'PUT',
    headers: { 'Authorization': 'Bearer ' + getAdminToken() },
    body: JSON.stringify({
        firstName: 'Johnny',
        email: 'johnny@example.com'
    })
});`
      },
      whenToUse: [
        'Update user when username is available',
        'User profile editing',
        'Admin bulk user updates'
      ],
      bestPractices: [
        'Validate email format before updating',
        'Use updateUser with ID for better performance',
        'Only update necessary fields',
        'Log user profile changes'
      ]
    },
    {
      id: 'userHasClientRole',
      name: 'userHasClientRole()',
      category: 'role-management',
      description: 'Kiểm tra xem người dùng có vai trò client không',
      longDescription: 'Xác minh xem người dùng có một vai trò client cụ thể không. Trả về boolean cho biết việc gán vai trò.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        },
        {
          name: 'roleName',
          type: 'String',
          description: 'Client role name to check',
          required: true,
          example: 'editor'
        }
      ],
      returns: {
        type: 'Boolean',
        description: 'True if user has role, false otherwise',
        example: 'true'
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        }
      ],
      codeExample: {
        backend: `@GetMapping("/admin/users/{userId}/has-client-role/{roleName}")
public ResponseEntity<?> hasClientRole(
        @PathVariable String userId,
        @PathVariable String roleName) {
    
    Boolean hasRole = keycloakService.userHasClientRole(userId, roleName);
    
    return ResponseEntity.ok(Map.of(
        "userId", userId,
        "roleName", roleName,
        "hasRole", hasRole
    ));
}`,
        frontend: `const response = await fetch(
    \`/admin/users/\${userId}/has-client-role/editor\`, {
    headers: { 'Authorization': 'Bearer ' + getAdminToken() }
});
const { hasRole } = await response.json();
if (hasRole) {
    console.log('User is editor');
}`
      },
      whenToUse: [
        'Check editor permission before showing edit UI',
        'Verify viewer role before displaying content',
        'Conditional feature access',
        'Authorization checks'
      ],
      bestPractices: [
        'Cache role checks for same user',
        'Use in authorization middleware',
        'Check multiple roles for complex permissions',
        'Avoid checking on every request'
      ]
    },
    {
      id: 'getRealmRolesOfUser',
      name: 'getRealmRolesOfUser()',
      category: 'role-management',
      description: 'Lấy tất cả vai trò realm được gán cho người dùng',
      longDescription: 'Truy xuất danh sách tất cả vai trò cấp realm được gán cho một người dùng cụ thể. Vai trò realm có thể nhìn thấy trên tất cả các ứng dụng client.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        }
      ],
      returns: {
        type: 'List<RoleData>',
        description: 'List of realm roles',
        example: `[
  {
    "id": "role-id-1",
    "name": "admin",
    "description": "System administrator"
  },
  {
    "id": "role-id-2",
    "name": "user",
    "description": "Regular user"
  }
]`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        }
      ],
      codeExample: {
        backend: `@GetMapping("/admin/users/{userId}/realm-roles")
public ResponseEntity<?> getRealmRoles(@PathVariable String userId) {
    List<String> roles = keycloakService.getRealmRolesOfUser(userId);
    
    return ResponseEntity.ok(Map.of(
        "userId", userId,
        "realmRoles", roles
    ));
}`,
        frontend: `const response = await fetch(\`/admin/users/\${userId}/realm-roles\`, {
    headers: { 'Authorization': 'Bearer ' + getAdminToken() }
});
const { realmRoles } = await response.json();
console.log('User realm roles:', realmRoles);`
      },
      whenToUse: [
        'Display user roles in admin panel',
        'Build role management UI',
        'Audit user permissions',
        'Role verification before operations'
      ],
      bestPractices: [
        'Cache results for performance',
        'Show role descriptions to users',
        'Use for permission auditing',
        'Verify roles before sensitive operations'
      ]
    },
    {
      id: 'getClientRolesOfUser',
      name: 'getClientRolesOfUser()',
      category: 'role-management',
      description: 'Lấy tất cả vai trò client của người dùng',
      longDescription: 'Truy xuất danh sách tất cả vai trò client được gán cho một người dùng. Vai trò client được giới hạn trong các ứng dụng client cụ thể.',
      parameters: [
        {
          name: 'userId',
          type: 'String',
          description: 'User UUID',
          required: true,
          example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
        }
      ],
      returns: {
        type: 'Map<String, List<RoleData>>',
        description: 'Map of client IDs to their assigned roles',
        example: `{
  "my-app": [
    {
      "id": "role-1",
      "name": "editor",
      "description": "Content editor"
    }
  ],
  "admin-portal": [
    {
      "id": "role-2",
      "name": "viewer",
      "description": "Admin viewer"
    }
  ]
}`
      },
      errorCodes: [
        {
          code: 'USER_NOT_FOUND',
          httpStatus: '404',
          meaning: 'User does not exist',
          solution: 'Check userId'
        }
      ],
      codeExample: {
        backend: `@GetMapping("/admin/users/{userId}/client-roles")
public ResponseEntity<?> getClientRoles(@PathVariable String userId) {
    Map<String, List<String>> clientRoles = 
        keycloakService.getClientRolesOfUser(userId);
    
    return ResponseEntity.ok(clientRoles);
}`,
        frontend: `const response = await fetch(\`/admin/users/\${userId}/client-roles\`, {
    headers: { 'Authorization': 'Bearer ' + getAdminToken() }
});
const clientRoles = await response.json();
Object.entries(clientRoles).forEach(([client, roles]) => {
    console.log(\`\${client}: \${roles.map(r => r.name).join(', ')}\`);
});`
      },
      whenToUse: [
        'Show all client-specific roles in admin panel',
        'Build permission matrix for user',
        'Audit app-specific permissions',
        'Role verification per client'
      ],
      bestPractices: [
        'Cache results for performance',
        'Group roles by client in UI',
        'Use for granular access control',
        'Refresh cache on role changes'
      ]
    },
    {
      id: 'isUserExist',
      name: 'isUserExist()',
      category: 'user-management',
      description: 'Kiểm tra xem người dùng có tồn tại không',
      longDescription: 'Kiểm tra xem người dùng có tồn tại trong hệ thống theo tên đăng nhập. Trả về giá trị boolean.',
      parameters: [
        {
          name: 'userName',
          type: 'String',
          description: 'Username to check',
          required: true,
          example: 'john.doe'
        }
      ],
      returns: {
        type: 'Boolean',
        description: 'True if user exists, false otherwise',
        example: 'true'
      },
      errorCodes: [
        {
          code: 'NO_ERROR',
          httpStatus: '200',
          meaning: 'Check completed successfully',
          solution: 'No action needed'
        }
      ],
      codeExample: {
        backend: `@GetMapping("/users/exists/{username}")
public ResponseEntity<?> userExists(@PathVariable String username) {
    Boolean exists = keycloakService.isUserExist(username);
    
    return ResponseEntity.ok(Map.of(
        "username", username,
        "exists", exists
    ));
}`,
        frontend: `const response = await fetch(\`/users/exists/john.doe\`, {
    headers: { 'Authorization': 'Bearer ' + getAccessToken() }
});
const { exists } = await response.json();
if (exists) {
    console.log('User exists');
} else {
    console.log('User not found');
}`
      },
      whenToUse: [
        'Validate username before registration',
        'Check if user exists in email recovery',
        'Prevent duplicate registrations',
        'User lookup functionality'
      ],
      bestPractices: [
        'Use for duplicate prevention',
        'Cache results briefly (1-2 minutes)',
        'Case-sensitive username comparison',
        'Rate limit username lookups'
      ]
    },
    {
      id: 'getRealmRoleData',
      name: 'getRealmRoleData()',
      category: 'role-management',
      description: 'Lấy chi tiết vai trò realm',
      longDescription: 'Truy xuất thông tin chi tiết về một vai trò realm cụ thể bao gồm tên, mô tả và ID.',
      parameters: [
        {
          name: 'roleName',
          type: 'String',
          description: 'Name of realm role',
          required: true,
          example: 'admin'
        }
      ],
      returns: {
        type: 'RoleData',
        description: 'Complete role information',
        example: `{
  "id": "role-id-1",
  "name": "admin",
  "description": "System administrator with full access",
  "composite": false,
  "enabled": true
}`
      },
      errorCodes: [
        {
          code: 'NOT_FOUND_REALM_ROLE',
          httpStatus: '404',
          meaning: 'Role does not exist',
          solution: 'Check role name'
        }
      ],
      codeExample: {
        backend: `@GetMapping("/admin/roles/{roleName}")
public ResponseEntity<?> getRealmRoleData(@PathVariable String roleName) {
    KCResponse<RealmRoleResponse> response = keycloakService.getRealmRoleData(roleName);
    
    if (response.isSuccess()) {
        return ResponseEntity.ok(response.getData());
    }
    
    return ResponseEntity.status(404).body(response.getError());
}`,
        frontend: `const response = await fetch(\`/admin/roles/admin\`, {
    headers: { 'Authorization': 'Bearer ' + getAdminToken() }
});
if (response.ok) {
    const roleData = await response.json();
    console.log('Role:', roleData.name, '-', roleData.description);
}`
      },
      whenToUse: [
        'Display role information in admin panel',
        'Show role details to users',
        'Role editing and management',
        'Role permission display'
      ],
      bestPractices: [
        'Cache role data for 5-10 minutes',
        'Show description to users',
        'Validate role exists before operations',
        'Use role ID instead of name for performance'
      ]
    }
  ];

  constructor() { }

  getFunctions(): ApiFunction[] {
    return this.functions;
  }

  getFunctionsByCategory(category: string): ApiFunction[] {
    return this.functions.filter(f => f.category === category);
  }

  getFunctionById(id: string): ApiFunction | undefined {
    return this.functions.find(f => f.id === id);
  }

  getCategories() {
    return [
      { id: 'authentication', name: 'Authentication', icon: '🔐' },
      { id: 'user-management', name: 'User Management', icon: '👤' },
      { id: 'role-management', name: 'Role Management', icon: '🔑' },
      { id: 'token', name: 'Token Management', icon: '🎫' }
    ];
  }
}

