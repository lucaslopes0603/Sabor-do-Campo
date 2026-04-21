package com.sabordocampo.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sabordocampo.user.domain.User;

public interface UserRepository extends JpaRepository<User, Long>{
}
