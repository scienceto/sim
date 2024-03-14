-- Insert seed data for USERS table
INSERT INTO USERS (email, password, name, role, metadata) VALUES
('user1@example.com', 'password1', 'User One', 'admin', '{"phone": "1234567890"}'),
('user2@example.com', 'password2', 'User Two', 'employee', '{"phone": "0987654321"}');

-- Insert seed data for SUPPLIER table
INSERT INTO SUPPLIER (name, address, metadata) VALUES
('Supplier A', '123 Supplier St, City', '{"phone": "111-222-3333"}'),
('Supplier B', '456 Supplier Ave, Town', '{"phone": "444-555-6666"}');

-- Insert seed data for PURCHASE table
INSERT INTO PURCHASE (timestamp, supplierId, userId, tradeRecord) VALUES
('2024-03-10 10:00:00', 1, 1, '{"product_id": 1, "quantity": 100, "price": "10.00"}'),
('2024-03-12 11:00:00', 2, 2, '{"product_id": 2, "quantity": 150, "price": "12.50"}');

-- Insert seed data for CUSTOMER table
INSERT INTO CUSTOMER (name, address, metadata) VALUES
('Customer X', '789 Customer Blvd, Village', '{"phone": "777-888-9999"}'),
('Customer Y', '101 Customer Rd, Hamlet', '{"phone": "000-111-2222"}');

-- Insert seed data for SALES table
INSERT INTO SALES (timestamp, customerId, userId, tradeRecord) VALUES
('2024-03-11 15:00:00', 1, 1, '{"product_id": 1, "quantity": 50, "price": "15.00"}'),
('2024-03-13 14:00:00', 2, 2, '{"product_id": 2, "quantity": 75, "price": "20.00"}');

-- Insert seed data for WAREHOUSE table
INSERT INTO WAREHOUSE (name, address) VALUES
('Main Warehouse', '123 Warehouse Ave, City'),
('Secondary Warehouse', '456 Warehouse St, Town');

-- Insert seed data for CATEGORY table
INSERT INTO CATEGORY (name, description) VALUES
('Electronics', 'Electronic gadgets and devices'),
('Clothing', 'Apparel and fashion items');

-- Insert seed data for PRODUCT table
INSERT INTO PRODUCT (name, categoryId, description, purchasePrice, salePrice) VALUES
('Laptop', 1, 'High-performance laptop', '800.00', '1000.00'),
('T-shirt', 2, 'Cotton T-shirt', '10.00', '20.00');

-- Insert seed data for INVENTORY table
INSERT INTO INVENTORY (productId, quantity, warehouseId) VALUES
(1, '50', 1),
(2, '100', 1),
(1, '50', 2),
(2, '75', 2);

-- Insert seed data for TRADERECORD table
-- This table might be populated by triggers or automatically based on purchases and sales, so specific seed data might not be necessary.

INSERT INTO TRADERECORD (productId, quantity, price, purchaseId, saleId) VALUES
(1, '100', '10.00', 1, 1),
(2, '150', '12.50', 2, 2);

