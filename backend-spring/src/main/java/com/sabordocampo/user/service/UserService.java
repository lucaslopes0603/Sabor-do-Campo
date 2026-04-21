package com.sabordocampo.user.service;

import com.sabordocampo.cart.domain.Address;
import com.sabordocampo.user.domain.Role;
import com.sabordocampo.user.domain.User;
import com.sabordocampo.user.dto.UserRequest;
import com.sabordocampo.user.dto.UserResponse;
import com.sabordocampo.user.repository.UserRepository;
import com.sabordocampo.cart.dto.AddressResponse;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        User user = new User();
        user.setName(request.name());
        user.setCPF(request.cpf());
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setPhone(request.phone());
        user.setRole(Role.USER);
        userRepository.save(user);
        return toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(Long userId) {
        return userRepository.findById(userId)
            .map(this::toUserResponse)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @Transactional
    public void removeUser(Long userId) {
        User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        userRepository.delete(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        return toUserResponse(user);
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getCPF(),
            user.getEmail(),
            user.getPhone(),
            user.getRole(),
            toAddressResponse(user.getAddress())
        );
    }

    private AddressResponse toAddressResponse(Address address) {
        if (address == null) return null;

        return new AddressResponse(
            address.getStreet(),
            address.getNumber(),
            address.getNeighborhood(),
            address.getCity(),
            address.getState(),
            address.getZipCode(),
            address.getComplement()
        );
    }

    private String normalizeOptional(String value) {
        return value == null ? "" : value.trim();
    }
}
