-- Seed data for USER table
INSERT INTO app_user (email, name, role, metadata)
VALUES
    ('user1@example.com', 'User 1', 'regular', '{"info": "User 1 metadata"}'),
    ('user2@example.com', 'User 2', 'regular', '{"info": "User 2 metadata"}'),
    ('admin1@example.com', 'Admin 1', 'admin', '{"info": "Admin 1 metadata"}'),
    ('admin2@example.com', 'Admin 2', 'admin', '{"info": "Admin 2 metadata"}');

-- Seed data for SUPPLIER table
INSERT INTO supplier (name, address, metadata)
VALUES
    ('Supplier 1', '123 Supplier St, Supplier City', '{"info": "Supplier 1 metadata"}'),
    ('Supplier 2', '456 Supplier Ave, Supplier Town', '{"info": "Supplier 2 metadata"}');

-- Seed data for CUSTOMER table
INSERT INTO customer (name, address, metadata)
VALUES
    ('Customer 1', '123 Customer St, Customer City', '{"info": "Customer 1 metadata"}'),
    ('Customer 2', '456 Customer Ave, Customer Town', '{"info": "Customer 2 metadata"}');

-- Seed data for PURCHASE table
INSERT INTO purchase (supplier, app_user, status)
VALUES
    (1, 1, 'PENDING'),
    (2, 2, 'COMPLETED');

-- Seed data for SALE table
INSERT INTO sale (customer, app_user, status)
VALUES
    (1, 3, 'completed'),
    (2, 4, 'pending');

-- Seed data for PRODUCT table
INSERT INTO product (name, category, description, purchase_price, sale_price)
VALUES
    ('Product 1', 'Category 1', 'Description for Product 1', 10.50, 15.00),
    ('Product 2', 'Category 2', 'Description for Product 2', 10.50, 15.00),
    ('Product 3', 'Category 3', 'Description for Product 3', 20.25, 30.00);

-- Seed data for TRADE_RECORD table
INSERT INTO trade_record (product, quantity, price, purchase, sale)
VALUES
    (1, 100, 10.00, 1, 1),
    (2, 50, 20.00, 1, 2),
    (1, 200, 15.00, 2, 1),
    (2, 75, 25.00, 2, 2);

-- Seed data for WAREHOUSE table
INSERT INTO warehouse (name, address)
VALUES
    ('Warehouse 1', '123 Warehouse St, Warehouse City'),
    ('Warehouse 2', '456 Warehouse Ave, Warehouse Town');

-- Seed data for PRODUCT_INVENTORY table
INSERT INTO product_inventory (product, quantity, warehouse)
VALUES
    (1, 100, 1),
    (2, 50, 1),
    (1, 200, 2),
    (2, 75, 2);
