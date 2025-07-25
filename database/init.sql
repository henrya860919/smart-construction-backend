-- 建立資料庫
CREATE DATABASE IF NOT EXISTS smart_construction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_construction;

-- 使用者表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'supervisor', 'worker') DEFAULT 'worker',
    full_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 工地表
CREATE TABLE sites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location TEXT,
    manager VARCHAR(100),
    status ENUM('準備中', '進行中', '暫停', '完成', '取消') DEFAULT '準備中',
    progress INT DEFAULT 0,
    budget DECIMAL(15,2),
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 設備表
CREATE TABLE equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_id INT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    model VARCHAR(100),
    status ENUM('運行中', '維修中', '閒置', '故障') DEFAULT '閒置',
    location VARCHAR(200),
    purchase_date DATE,
    last_maintenance DATE,
    next_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

-- 進度更新表
CREATE TABLE progress_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_id INT,
    progress INT NOT NULL,
    description TEXT,
    updated_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

-- 工地照片表
CREATE TABLE site_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_id INT,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_size INT,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- 權限表
CREATE TABLE site_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    site_id INT,
    permission_level ENUM('read', 'write', 'admin') DEFAULT 'read',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_site (user_id, site_id)
);

-- 插入測試資料
INSERT INTO users (username, email, password, role, full_name) VALUES
('admin', 'admin@smartconstruction.com', '$2a$10$example', 'admin', '系統管理員'),
('manager1', 'manager@smartconstruction.com', '$2a$10$example', 'manager', '陳思翰'),
('worker1', 'worker@smartconstruction.com', '$2a$10$example', 'worker', '工地作業員');

INSERT INTO sites (name, location, manager, status, progress, budget) VALUES
('台北101改建工程', '台北市信義區', '陳思翰', '進行中', 75, 50000000.00),
('高雄港擴建專案', '高雄市前鎮區', '李經理', '準備中', 15, 80000000.00),
('台中歌劇院維修', '台中市西屯區', '王主管', '進行中', 60, 25000000.00);

INSERT INTO equipment (site_id, name, type, status, location) VALUES
(1, '挖土機-CAT320', '重機械', '運行中', '台北101工地-A區'),
(1, '起重機-50T', '起重設備', '維修中', '台北101工地-B區'),
(2, '混凝土泵浦車', '運輸設備', '閒置', '高雄港工地-入口');