package com.realestate.portal.dao;

import com.realestate.portal.model.Role;
import com.realestate.portal.model.User;
import java.util.List;
import java.util.Optional;

public interface UserDAO {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    List<User> findAll();
    User save(User user);
    boolean update(User user);
    boolean setBanned(Long userId, boolean isBanned);
    boolean updateRole(Long userId, Role role);
    boolean delete(Long id);
}
