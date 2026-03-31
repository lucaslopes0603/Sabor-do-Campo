package com.sabordocampo.menu.repository;

import com.sabordocampo.menu.domain.Category;
import com.sabordocampo.menu.domain.MenuItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findAllByOrderByCategoryAscIdAsc();
    List<MenuItem> findByCategoryOrderByIdAsc(Category category);
}
