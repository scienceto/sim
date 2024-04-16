# LogiMasters Backend

## License
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Code Coverage
[![codecov](https://codecov.io/gh/scienceto/sim/graph/badge.svg?token=YE4WMMYJ4O)](https://codecov.io/gh/scienceto/sim)

## Quality Gate
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=scienceto_sim&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=scienceto_sim)

## Runtime Setup

1. NPM Version: 10.5.0
2. Node Version: 21.4.0

## Install Dependencies (staying in the backend directory)

1. Install production and dev dependencies
   ```bash
   npm install
    ```

## Run Test Script

1. After installing the dependencies run the test script defined in `package.json` using the following command. It also generates the code coverage report.
    ```bash
   # run tests
   npm test
    ```

## MVPs Implemented

1. Add a new product, update/delete existing products.

   | Functionality                         | Component                         | Model/s | Owner | Unittest File           |
   |---------------------------------------|-----------------------------------|---------|-------|-------------------------|
   | List all products                     | productController.listProducts()  | Product |       | [productControllerTest.js](__tests__/productControllerTest.js) |
   | Get a product details by its id       | productController.getProduct()    | Product |       | [productControllerTest.js](__tests__/productControllerTest.js) |
   | Add a new product                     | productController.addProduct()    | Product |       | [productControllerTest.js](__tests__/productControllerTest.js) |
   | Update details of a product by its id | productController.updateProduct() | Product |       | [productControllerTest.js](__tests__/productControllerTest.js) |
   | Disable a product (not deletion)      | productController.deleteProduct() | Product |       |                         |

2. Create/manage stocking orders and update the inventory once the order has been fulfilled.

   | Functionality                                                              | Component                          | Model/s               | Owner | Unittest File                                                    |
   |----------------------------------------------------------------------------|------------------------------------|-----------------------|-------|------------------------------------------------------------------|
   | List all purchase records along with its trade records                     | purchaseController.listPurchases() | Purchase, TradeRecord |       | [purchaseControllerTest.js](__tests__/purchaseControllerTest.js) |
   | Get a purchase record by its id along with the corresponding trade records | purchaseController.getPurchase()   | Purchase, TradeRecord |       | [purchaseControllerTest.js](__tests__/purchaseControllerTest.js) |
   | Add a purchase record (also creates the corresponding trade records)       | purchaseController.addPurchase()   | Purchase, TradeRecord |       | [purchaseControllerTest.js](__tests__/purchaseControllerTest.js) |
   | List all sale records along with its trade records                         | saleController.listSales()         | Sale, TradeRecord     |       |[saleControllerTest.js](__tests__/saleControllerTest.js) |
   | Get a sale record by its id along with the corresponding trade records     | saleController.getSale()           | Sale, TradeRecord     |       |[saleControllerTest.js](__tests__/saleControllerTest.js) |
   | Add a sale record (also creates the corresponding trade records)           | saleController.addSale()           | Sale, TradeRecord     |       |[saleControllerTest.js](__tests__/saleControllerTest.js) |

3. Update the quantity of a product in a warehouse once it leaves/added to the warehouse.
   
    Any update to a ProductInventory must be done through a TradeRecord only. Direct update of a product inventory is not allowed. The relations can be understood from the ER diagram shown [here]().

   | Functionality                                                                                       | Component                            | Model/s                                 | Owner | Unittest |
   |-----------------------------------------------------------------------------------------------------|--------------------------------------|-----------------------------------------|-------|----------|
   | Fulfill a purchase (updates the corresponding product inventories using the attached trade records) | purchaseController.fulfillPurchase() | Purchase, TradeRecord, ProductInventory |       | [purchaseControllerTest.js](__tests__/purchaseControllerTest.js) |
   | Fulfill a sale (updates the corresponding product inventories using the attached trade records)     | saleController.fulfillSale()         | Sale, TradeRecord, ProductInventory     |       | [saleControllerTest.js](__tests__/saleControllerTest.js) |

4. Notify by email if inventory is low for any product.

    This is to notify all the users, who have enabled notification, when the inventory of a product is below a common threshold in any of the warehouses.

   | Functionality                                                                                                                                                                                             | Component                                   | Model/s | Owner | Unittest |
   |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|---------|-------|----------|
   | Notify on email to users who have enabled notification when a product inventory is below a common threshold in any of the warehouses. CSV of low product inventory is attached in the email notification. | notificationController.notifyLowInventory() |         |       | [notificationControllerTest.js](__tests__/notificationControllerTest.js) |

5. SSO-based login using customer email domain.

   Enable seamless Single Sign-On (SSO) login using your customer's email domain for a streamlined access experience.

   | Functionality                                                                                                                                                                                             | Component (URL)                                  | Model/s | Owner | Unittest |
   |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|---------|-------|----------|
   | Successfully set up a login page for the user to sign up and log in using provided credentials using AWS Cognito with Google as a federated identity provider. | https://inventorymgmt.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=3gnql5j3sbni0heiavr3suh3hc&redirect_uri=https://www.ims.com/oauth2/idpresponse |         |       |          |

6. Create/manage vendor information on inventory products.

   Manages supplier information from where the purchases are made.
   
   | Functionality                         | Component                         | Model/s | Owner | Unittest File           |
   |---------------------------------------|-----------------------------------|---------|-------|-------------------------|
   | List all suppliers                     | supplierController.listSuppliers()  | Supplier |       | [supplierControllerTest.js](__tests__/supplierControllerTest.js) |
   | Get a Supplier details by its id       | supplierController.getSupplier()    | Supplier |       | [supplierControllerTest.js](__tests__/supplierControllerTest.js) |
   | Add a new Supplier                     | supplierController.addSupplier()    | Supplier |       | [supplierControllerTest.js](__tests__/supplierControllerTest.js) |
   | Update details of a Supplier by its id | supplierController.updateSupplier() | Supplier |       | [supplierControllerTest.js](__tests__/supplierControllerTest.js) |

## GitHub Actions for Test Case

- Github workflow is configured to test the unittests in GitHub actions. The workflow first sets up a postgres service which is accessible from the runner job where we use the same commands as above to run the test cases.
