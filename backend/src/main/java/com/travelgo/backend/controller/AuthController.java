package com.travelgo.backend.controller;

import com.travelgo.backend.model.User;
import com.travelgo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // ========== REGISTER USER ==========
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, Object> userData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = (String) userData.get("email");
            
            // Check if email already exists
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                response.put("success", false);
                response.put("error", "Email already registered");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if phone number already exists (if provided)
            if (userData.containsKey("phoneNumber") && userData.get("phoneNumber") != null) {
                String phoneNumber = (String) userData.get("phoneNumber");
                Optional<User> existingPhone = userRepository.findByPhoneNumber(phoneNumber);
                if (existingPhone.isPresent()) {
                    response.put("success", false);
                    response.put("error", "Phone number already registered");
                    return ResponseEntity.badRequest().body(response);
                }
            }
            
            // Create new user
            User user = new User();
            user.setFirstName((String) userData.get("firstName"));
            user.setLastName((String) userData.get("lastName"));
            user.setEmail(email);
            user.setPassword((String) userData.get("password"));
            user.setRole((String) userData.getOrDefault("role", "client"));
            user.setStatus("active");
            
            if (userData.containsKey("phoneNumber") && userData.get("phoneNumber") != null) {
                user.setPhoneNumber((String) userData.get("phoneNumber"));
            }
            
            if (userData.containsKey("profileImage") && userData.get("profileImage") != null) {
                user.setProfileImage((String) userData.get("profileImage"));
            }
            
            userRepository.save(user);
            
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("user", user);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ========== LOGIN USER ==========
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> loginData) {
        Map<String, Object> response = new HashMap<>();
        
        String email = loginData.get("email");
        String password = loginData.get("password");
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        User user = userOpt.get();
        
        if (!user.getPassword().equals(password)) {
            response.put("success", false);
            response.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    // ========== UPDATE PROFILE ==========
    @PutMapping("/profile/{id}")
    public ResponseEntity<Map<String, Object>> updateProfile(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findById(id);
        
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        User user = userOpt.get();
        
        try {
            if (data.containsKey("firstName") && data.get("firstName") != null) {
                user.setFirstName((String) data.get("firstName"));
            }
            if (data.containsKey("lastName") && data.get("lastName") != null) {
                user.setLastName((String) data.get("lastName"));
            }
            if (data.containsKey("phoneNumber") && data.get("phoneNumber") != null) {
                String phoneNumber = (String) data.get("phoneNumber");
                if (!phoneNumber.trim().isEmpty()) {
                    user.setPhoneNumber(phoneNumber);
                }
            }
            if (data.containsKey("profileImage") && data.get("profileImage") != null) {
                String profileImage = (String) data.get("profileImage");
                if (!profileImage.trim().isEmpty()) {
                    user.setProfileImage(profileImage);
                }
            }
            
            userRepository.save(user);
            
            response.put("success", true);
            response.put("message", "Profile updated successfully");
            response.put("user", user);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ========== GET ALL USERS ==========
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = (List<User>) userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // ========== GET USER BY ID ==========
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // ========== UPDATE USER (for admin edit) ==========
    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> userData) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        User user = userOpt.get();
        
        if (userData.containsKey("firstName") && userData.get("firstName") != null) {
            user.setFirstName((String) userData.get("firstName"));
        }
        if (userData.containsKey("lastName") && userData.get("lastName") != null) {
            user.setLastName((String) userData.get("lastName"));
        }
        if (userData.containsKey("email") && userData.get("email") != null) {
            user.setEmail((String) userData.get("email"));
        }
        if (userData.containsKey("role") && userData.get("role") != null) {
            user.setRole((String) userData.get("role"));
        }
        if (userData.containsKey("status") && userData.get("status") != null) {
            user.setStatus((String) userData.get("status"));
        }
        if (userData.containsKey("phoneNumber") && userData.get("phoneNumber") != null) {
            user.setPhoneNumber((String) userData.get("phoneNumber"));
        }
        if (userData.containsKey("profileImage") && userData.get("profileImage") != null) {
            user.setProfileImage((String) userData.get("profileImage"));
        }
        
        userRepository.save(user);
        
        response.put("success", true);
        response.put("message", "User updated successfully");
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    // ========== CHANGE USER PASSWORD ==========
    @PutMapping("/users/{id}/password")
    public ResponseEntity<Map<String, Object>> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        User user = userOpt.get();
        String newPassword = passwordData.get("password");
        
        if (newPassword == null || newPassword.length() < 6) {
            response.put("success", false);
            response.put("error", "Password must be at least 6 characters");
            return ResponseEntity.badRequest().body(response);
        }
        
        user.setPassword(newPassword);
        userRepository.save(user);
        
        response.put("success", true);
        response.put("message", "Password changed successfully");
        return ResponseEntity.ok(response);
    }

    // ========== DELETE USER ==========
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // ========== GET PROFILE ==========
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}