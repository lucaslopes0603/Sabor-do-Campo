package com.sabordocampo.user.web;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sabordocampo.user.dto.UserRequest;
import com.sabordocampo.user.dto.UserResponse;
import com.sabordocampo.user.service.UserService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/{userId}")
    public UserResponse getUser(@PathVariable Long userId) {
        return userService.getUser(userId);
    }

    @PostMapping("/users")
    public UserResponse createUser(@RequestBody UserRequest request) {
        return userService.createUser(request);
    }

    @DeleteMapping("users/{userId}")
    public void removeUser(@PathVariable Long userId) {
        userService.removeUser(userId);
    }

    /* @PutMapping("users/{userId}")
    public void updateUser(@PathVariable Long userId) {
        userService.updateUser(userId);
    } */
}
