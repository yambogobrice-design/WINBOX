-- ============================================
-- SCHÉMA DE BASE DE DONNÉES WINBOX
-- Version: 2.0.0
-- Auteur: YAMBOGO BRICE
--
-- Script idempotent : peut être rejoué sans erreur.
-- Les index sont déclarés dans les CREATE TABLE (pas de ALTER TABLE en fin
-- de script) afin que « mysql < database.sql » fonctionne plusieurs fois.
--
-- Comptes : créer l'administrateur avec `npm run seed` (mot de passe haché
-- par bcryptjs). Aucun mot de passe en clair ni hachage factice ici.
-- ============================================

CREATE DATABASE IF NOT EXISTS winbox_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE winbox_db;

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    niveau VARCHAR(50),                 -- Licence 1..3, Master 1..2 (libellé libre)
    filiere VARCHAR(100),
    specialite VARCHAR(100),
    institution VARCHAR(200),
    bio TEXT,
    role ENUM('etudiant', 'contributeur', 'admin') DEFAULT 'etudiant',
    status ENUM('actif', 'inactif', 'suspendu') DEFAULT 'actif',
    points INT DEFAULT 0,
    preferences JSON,                   -- notifications, profil public, classement…
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_points (points DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: password_resets (mot de passe oublié)
-- ============================================
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token_hash),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: categories (matières)
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
-- TABLE: resources (livres, cours, sujets, corrections, supports)
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('livre', 'cours', 'sujet', 'correction', 'support') NOT NULL,
    auteur VARCHAR(200),                -- auteur de l'ouvrage / du sujet
    category_id INT,                    -- matière
    user_id INT NOT NULL,               -- déposant
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
    status ENUM('en_attente', 'validee', 'refusee') DEFAULT 'en_attente',
    moderation_comment TEXT,
    moderated_by INT NULL,
    moderated_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    tags JSON,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_type (type),
    INDEX idx_category (category_id),
    INDEX idx_user (user_id),
    INDEX idx_niveau (niveau),
    INDEX idx_filiere (filiere),
    INDEX idx_status (status),
    INDEX idx_downloads (download_count DESC),
    INDEX idx_views (view_count DESC),
    INDEX idx_rating (rating_avg DESC),
    INDEX idx_created (created_at DESC),
    FULLTEXT idx_search (titre, description, auteur)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: favorites
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
-- TABLE: ratings (évaluations)
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
-- TABLE: downloads (historique des téléchargements)
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
-- TABLE: comments
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
-- TABLE: notifications
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
-- TABLE: activities (fil d'activité, historique de points)
-- Alimente « Activité récente » du profil et WinRank (filtres matière/période)
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('inscription', 'quiz', 'telechargement', 'contribution', 'objectif', 'defi', 'badge', 'session') NOT NULL,
    titre VARCHAR(255) NOT NULL,
    points INT DEFAULT 0,
    category_id INT NULL,
    resource_id INT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_created (created_at),
    INDEX idx_type (type),
    INDEX idx_points (points)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: badges + user_badges
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    icon VARCHAR(50),
    condition_type ENUM('points', 'contributions', 'telechargements', 'quiz', 'taux_reussite') NOT NULL,
    condition_valeur INT NOT NULL,
    ordre INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: study_sessions (heures d'étude — WinZone)
-- ============================================
CREATE TABLE IF NOT EXISTS study_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NULL,
    duree_minutes INT NOT NULL,
    note VARCHAR(255),
    date_session DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_date (date_session),
    INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: objectives (objectifs d'étude — WinZone)
-- ============================================
CREATE TABLE IF NOT EXISTS objectives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    category_id INT NULL,
    date_debut DATE,
    date_echeance DATE,
    objectif_heures INT DEFAULT 0,
    progression TINYINT UNSIGNED DEFAULT 0,   -- 0..100
    statut ENUM('en_cours', 'termine', 'en_retard') DEFAULT 'en_cours',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_statut (statut),
    INDEX idx_echeance (date_echeance)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: challenges (défis) + user_challenges (progression)
-- ============================================
CREATE TABLE IF NOT EXISTS challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('quotidien', 'hebdomadaire', 'mensuel') DEFAULT 'hebdomadaire',
    points INT DEFAULT 0,
    objectif INT DEFAULT 1,               -- valeur à atteindre
    category_id INT NULL,
    date_debut DATE,
    date_fin DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_type (type),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL,
    progression INT DEFAULT 0,
    termine BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_challenge (user_id, challenge_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: quiz, quiz_questions, quiz_attempts
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
    INDEX idx_score (score),
    INDEX idx_completed (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VUES
-- ============================================

-- Ressources validées et actives, prêtes à l'affichage public
CREATE OR REPLACE VIEW v_ressources_publiques AS
SELECT
    r.id,
    r.titre,
    r.description,
    r.type,
    r.auteur,
    r.niveau,
    r.filiere,
    r.annee_academique,
    r.download_count,
    r.view_count,
    r.rating_avg,
    r.rating_count,
    r.created_at,
    c.id AS category_id,
    c.nom AS matiere,
    c.slug AS matiere_slug,
    u.id AS uploader_id,
    CONCAT(u.prenom, ' ', u.nom) AS uploader
FROM resources r
JOIN users u ON r.user_id = u.id
LEFT JOIN categories c ON r.category_id = c.id
WHERE r.status = 'validee' AND r.is_active = TRUE;

-- Classement général (hors utilisateurs suspendus/inactifs)
CREATE OR REPLACE VIEW v_classement AS
SELECT
    u.id,
    CONCAT(u.prenom, ' ', u.nom) AS nom,
    u.niveau,
    u.filiere,
    u.points,
    u.role,
    (SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.user_id = u.id) AS quiz_completes,
    (SELECT ROUND(AVG(qa.percentage), 0) FROM quiz_attempts qa WHERE qa.user_id = u.id) AS taux_reussite
FROM users u
WHERE u.status = 'actif';

-- ============================================
-- DONNÉES INITIALES
-- ============================================

INSERT IGNORE INTO categories (nom, slug, description, icon, ordre) VALUES
('Mathématiques', 'mathematiques', 'Cours et ressources de mathématiques', '📐', 1),
('Physique', 'physique', 'Cours et ressources de physique', '⚛️', 2),
('Chimie', 'chimie', 'Cours et ressources de chimie', '🧪', 3),
('Informatique', 'informatique', 'Cours et ressources d''informatique', '💻', 4),
('Économie', 'economie', 'Cours et ressources d''économie', '📊', 5),
('Droit', 'droit', 'Cours et ressources de droit', '⚖️', 6),
('Médecine', 'medecine', 'Cours et ressources de médecine', '🏥', 7),
('Langues', 'langues', 'Cours et ressources de langues', '🗣️', 8);

INSERT IGNORE INTO badges (nom, slug, description, icon, condition_type, condition_valeur, ordre) VALUES
('Premier pas', 'premier-pas', 'Premier quiz complété', '🎯', 'quiz', 1, 1),
('Contributeur', 'contributeur', 'Première contribution validée', '📤', 'contributions', 1, 2),
('Expert', 'expert', '50 quiz complétés', '🎓', 'quiz', 50, 3),
('Perfectionniste', 'perfectionniste', '95 % de réussite aux quiz', '🏆', 'taux_reussite', 95, 4),
('Généreux', 'genereux', '10 contributions validées', '❤️', 'contributions', 10, 5),
('Studieux', 'studieux', '100 téléchargements cumulés', '📚', 'telechargements', 100, 6);

INSERT IGNORE INTO challenges (titre, description, type, points, objectif, date_debut, date_fin) VALUES
('Réviser 5 jours de suite', 'Se connecter et travailler au moins une session par jour pendant 5 jours', 'hebdomadaire', 50, 5, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
('Télécharger 3 ressources', 'Télécharger trois ressources pour préparer ses examens', 'hebdomadaire', 30, 3, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
('Publier une contribution', 'Partager un cours, un sujet ou une correction avec la communauté', 'mensuel', 100, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
('Terminer 2 objectifs', 'Atteindre 100 % sur deux objectifs d''étude', 'mensuel', 80, 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY));

SELECT 'Base de données WinBox (v2) créée avec succès !' AS message;
