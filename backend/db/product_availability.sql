SELECT w.name AS warehouse_name, p.name AS product_name, pi.quantity AS total_quantity
FROM product_inventory pi
JOIN warehouse w ON pi.warehouse = w.id
JOIN product p ON pi.product = p.id
GROUP BY w.name, p.name
ORDER BY w.name, p.name;