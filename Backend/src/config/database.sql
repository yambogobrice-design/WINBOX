-- ============================================
-- SCHÉMA DE BASE DE DONNÉES WINBOX
-- Version: 1.0.0
-- Auteur: YAMBOGO BRICE
-- ============================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS winbox_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE winbox_db;

-- ============================================
-- TABLE: users (Utilisateurs)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    niveau VARCHAR(50),
    filiere VARCHAR(100),
    institution VARCHAR(200),
    avatar_url VARCHAR(500),
    role ENUM('student', 'admin', 'moderator') DEFAULT 'student',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_points (points)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: categories (Catégories de ressources)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    ordre INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: resources (Ressources académiques)
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('livre', 'cours', 'sujet', 'correction', 'support') NOT NULL,
    category_id INT,
    user_id INT NOT NULL,
    niveau VARCHAR(50),
    filiere VARCHAR(100),
    annee_academique VARCHAR(20),
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(50),
    thumbnail_url VARCHAR(500),
    download_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    tags JSON,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_category (category_id),
    INDEX idx_user (user_id),
    INDEX idx_niveau (niveau),
    INDEX idx_filiere (filiere),
    FULLTEXT idx_search (titre, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: favorites (Favoris des utilisateurs)
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resource_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, resource_id),
    INDEX idx_user (user_id),
    INDEX idx_resource (resource_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: ratings (Évaluations des ressources)
-- ============================================
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resource_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    UNIQUE KEY unique_rating (user_id, resource_id),
    INDEX idx_user (user_id),
    INDEX idx_resource (resource_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: downloads (Historique des téléchargements)
-- ============================================
CREATE TABLE IF NOT EXISTS downloads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resource_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_resource (resource_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: quiz (Quiz et exercices)
-- ============================================
CREATE TABLE IF NOT EXISTS quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    niveau VARCHAR(50),
    filiere VARCHAR(100),
    duree_minutes INT,
    questions_count INT DEFAULT 0,
    difficulty ENUM('facile', 'moyen', 'difficile') DEFAULT 'moyen',
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_niveau (niveau),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: quiz_questions (Questions de quiz)
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question TEXT NOT NULL,
    type ENUM('qcm', 'vrai_faux', 'texte') DEFAULT 'qcm',
    options JSON,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INT DEFAULT 1,
    ordre INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE,
    INDEX idx_quiz (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: quiz_attempts (Tentatives de quiz)
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    max_score INT NOT NULL,
    percentage DECIMAL(5,2),
    time_spent INT,
    answers JSON,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_quiz (quiz_id),
    INDEX idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: notifications (Notifications utilisateurs)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: comments (Commentaires)
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resource_id INT NOT NULL,
    parent_id INT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_resource (resource_id),
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DONNÉES INITIALES: Catégories
-- ============================================
INSERT INTO categories (nom, slug, description, icon, ordre) VALUES
('Mathématiques', 'mathematiques', 'Cours et ressources de mathématiques', '📐', 1),
('Physique', 'physique', 'Cours et ressources de physique', '⚛️', 2),
('Chimie', 'chimie', 'Cours et ressources de chimie', '🧪', 3),
('Informatique', 'informatique', 'Cours et ressources d\'informatique', '💻', 4),
('Économie', 'economie', 'Cours et ressources d\'économie', '📊', 5),
('Droit', 'droit', 'Cours et ressources de droit', '⚖️', 6),
('Médecine', 'medecine', 'Cours et ressources de médecine', '🏥', 7),
('Langues', 'langues', 'Cours et ressources de langues', '🗣️', 8);

-- ============================================
-- UTILISATEUR ADMIN PAR DÉFAUT
-- Mot de passe: Admin@123 (à changer immédiatement !)
-- ============================================
INSERT INTO users (nom, prenom, email, password_hash, role, is_verified, is_active) VALUES
('Admin', 'WinBox', 'admin@winbox.com', '$2a$10$Xh3xVzJ7VQq9Xh3xVzJ7VOnLH8YJ7VQq9Xh3xVzJ7VQq9Xh3xVzJ7V', 'admin', TRUE, TRUE);

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue: Statistiques des ressources par utilisateur
CREATE OR REPLACE VIEW user_resource_stats AS
SELECT 
    u.id as user_id,
    u.nom,
    u.prenom,
    COUNT(r.id) as total_resources,
    SUM(r.download_count) as total_downloads,
    AVG(r.rating_avg) as avg_rating
FROM users u
LEFT JOIN resources r ON u.id = r.user_id
GROUP BY u.id, u.nom, u.prenom;

-- Vue: Ressources populaires
CREATE OR REPLACE VIEW popular_resources AS
SELECT 
    r.*,
    u.nom as uploader_nom,
    u.prenom as uploader_prenom,
    c.nom as category_nom
FROM resources r
JOIN users u ON r.user_id = u.id
LEFT JOIN categories c ON r.category_id = c.id
WHERE r.is_active = TRUE
ORDER BY (r.download_count + r.view_count) DESC
LIMIT 50;

-- ============================================
-- INDEX SUPPLÉMENTAIRES POUR PERFORMANCE
-- ============================================
ALTER TABLE resources ADD INDEX idx_downloads (download_count DESC);
ALTER TABLE resources ADD INDEX idx_views (view_count DESC);
ALTER TABLE resources ADD INDEX idx_rating (rating_avg DESC);
ALTER TABLE users ADD INDEX idx_active (is_active);

-- ============================================
-- FIN DU SCRIPT
-- ============================================

SELECT 'Base de données WinBox créée avec succès !' as message;
