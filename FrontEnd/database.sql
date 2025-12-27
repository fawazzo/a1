-- Turkish Food Delivery Database
CREATE DATABASE IF NOT EXISTS turkish_food_delivery;
USE turkish_food_delivery;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(50),
  profile_image VARCHAR(255),
  is_seller BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  seller_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  cuisine VARCHAR(100),
  description TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  delivery_time_min INT,
  delivery_time_max INT,
  delivery_fee DECIMAL(5,2),
  min_order INT,
  image VARCHAR(255),
  address VARCHAR(255),
  phone VARCHAR(20),
  is_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Dishes Table
CREATE TABLE IF NOT EXISTS dishes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(8,2) NOT NULL,
  image VARCHAR(255),
  category VARCHAR(50),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Dish Options Table
CREATE TABLE IF NOT EXISTS dish_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dish_id INT NOT NULL,
  option_name VARCHAR(100) NOT NULL,
  option_price DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  delivery_address VARCHAR(255),
  delivery_fee DECIMAL(5,2),
  coupon_code VARCHAR(50),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  delivery_time INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  dish_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  options JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20),
  discount_value DECIMAL(10,2),
  min_order DECIMAL(10,2),
  max_uses INT,
  current_uses INT DEFAULT 0,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, restaurant_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(100),
  message TEXT,
  type VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Tracking Table
CREATE TABLE IF NOT EXISTS order_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  status VARCHAR(50),
  delivery_person_id INT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (delivery_person_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  invoice_number VARCHAR(50) UNIQUE,
  total_amount DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Sample Data

-- Insert Users
INSERT INTO users (name, email, password, phone, address, city, is_seller) VALUES
('Ahmet Yılmaz', 'ahmet@example.com', 'hashed_password_1', '0501234567', 'Bağdat Caddesi No:123', 'İstanbul', FALSE),
('Ayşe Kaya', 'ayse@example.com', 'hashed_password_2', '0502345678', 'İstiklal Caddesi No:45', 'İstanbul', FALSE),
('Mehmet Demir', 'mehmet@example.com', 'hashed_password_3', '0503456789', 'Kızılay Meydanı No:67', 'Ankara', TRUE),
('Zeynep Çelik', 'zeynep@example.com', 'hashed_password_4', '0504567890', 'Alsancak No:89', 'İzmir', TRUE);

-- Insert Restaurants
INSERT INTO restaurants (seller_id, name, cuisine, description, rating, delivery_time_min, delivery_time_max, delivery_fee, min_order, image, address, phone) VALUES
(3, 'Pizza Palace', 'Pizza, İtalyan', 'Şehrin en iyi pizzaları', 4.8, 15, 20, 0, 30, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', 'Bağdat Caddesi No:123', '02121234567'),
(4, 'Kebapçı Halil', 'Kebap, Türk Mutfağı', 'Özel lezzetlerimizle', 4.9, 30, 40, 10, 60, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop', 'İstiklal Caddesi No:45', '02122345678'),
(3, 'Tatlı Dünyası', 'Tatlı, Dondurma', 'En güzel tatlılar burada', 4.7, 10, 15, 0, 25, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop', 'Kızılay Meydanı No:67', '03123456789');

-- Insert Dishes
INSERT INTO dishes (restaurant_id, name, description, price, category, image) VALUES
(1, 'Margarita Pizza', 'Domates, mozzarella, fesleğen', 65, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop'),
(1, 'Pepperoni Pizza', 'Sucuk, mozzarella', 75, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop'),
(2, 'Adana Kebap', 'Pilav üstü adana kebap', 85, 'Kebap', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop'),
(2, 'Urfa Kebap', 'Salatalık ve domates ile', 80, 'Kebap', 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=300&h=200&fit=crop'),
(3, 'Tiramisu', 'İtalyan usulü tiramisu', 45, 'Tatlı', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop'),
(3, 'Çikolatalı Pasta', 'Sıcak çikolatalı kek', 40, 'Tatlı', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=300&h=200&fit=crop');

-- Insert Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order, max_uses, expiry_date, is_active) VALUES
('WELCOME30', 'percentage', 30, 50, 100, '2025-12-31', TRUE),
('PIZZA50', 'fixed', 50, 100, 50, '2025-12-31', TRUE),
('FREEDELIV', 'fixed', 0, 75, 75, '2025-12-31', TRUE);

-- Create Indexes for Performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_restaurant_seller ON restaurants(seller_id);
CREATE INDEX idx_dish_restaurant ON dishes(restaurant_id);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_restaurant ON orders(restaurant_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_review_restaurant ON reviews(restaurant_id);
CREATE INDEX idx_favorite_user ON favorites(user_id);
CREATE INDEX idx_notification_user ON notifications(user_id);
CREATE INDEX idx_tracking_order ON order_tracking(order_id);

-- Database creation completed
