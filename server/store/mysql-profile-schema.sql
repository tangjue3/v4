CREATE TABLE IF NOT EXISTS user_accounts (
  account_id VARCHAR(128) PRIMARY KEY,
  role VARCHAR(32) NOT NULL DEFAULT 'student',
  display_name VARCHAR(128) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS learning_profiles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  account_id VARCHAR(128) NOT NULL,
  source VARCHAR(64) NOT NULL DEFAULT 'profile',
  total_score INT NULL,
  dimensions_json JSON NULL,
  weaknesses_json JSON NULL,
  recommendations_json JSON NULL,
  profile_json JSON NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_learning_profiles_account_created (account_id, created_at),
  CONSTRAINT fk_learning_profiles_account
    FOREIGN KEY (account_id) REFERENCES user_accounts(account_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS learning_knowledge_paths (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  account_id VARCHAR(128) NOT NULL,
  source VARCHAR(64) NOT NULL DEFAULT 'knowledge-path',
  phases_json JSON NULL,
  path_json JSON NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_learning_knowledge_paths_account_created (account_id, created_at),
  CONSTRAINT fk_learning_knowledge_paths_account
    FOREIGN KEY (account_id) REFERENCES user_accounts(account_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS review_sessions (
  session_id VARCHAR(64) PRIMARY KEY,
  account_id VARCHAR(128) NOT NULL,
  source VARCHAR(64) NOT NULL DEFAULT 'evaluation-live2d',
  knowledge_point_id VARCHAR(128) NULL,
  knowledge_point_name VARCHAR(255) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'generated',
  correct_rate DECIMAL(5,4) NULL,
  profile_patch_json JSON NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  submitted_at DATETIME(3) NULL,
  INDEX idx_review_sessions_account_created (account_id, created_at),
  CONSTRAINT fk_review_sessions_account
    FOREIGN KEY (account_id) REFERENCES user_accounts(account_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS review_questions (
  question_id VARCHAR(64) PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  account_id VARCHAR(128) NOT NULL,
  knowledge_point_id VARCHAR(128) NULL,
  knowledge_point_name VARCHAR(255) NULL,
  question_type VARCHAR(32) NOT NULL DEFAULT 'single-choice',
  difficulty VARCHAR(32) NOT NULL DEFAULT 'adaptive',
  prompt TEXT NOT NULL,
  options_json JSON NULL,
  answer_json JSON NOT NULL,
  explanation TEXT NULL,
  mistake_tags_json JSON NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'generated',
  user_answer_json JSON NULL,
  is_correct TINYINT(1) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  answered_at DATETIME(3) NULL,
  INDEX idx_review_questions_account_created (account_id, created_at),
  INDEX idx_review_questions_account_correct (account_id, is_correct),
  CONSTRAINT fk_review_questions_session
    FOREIGN KEY (session_id) REFERENCES review_sessions(session_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_review_questions_account
    FOREIGN KEY (account_id) REFERENCES user_accounts(account_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
