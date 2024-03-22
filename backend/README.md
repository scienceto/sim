## Runtime Setup

1. NPM Version: 10.5.0
2. Node Version: 21.4.0

## Install Dependencies (staying in the backend directory)

1. Install production and dev dependencies
   ```bash
   npm install
    ```

## Run Test Script

1. Run test script defined in `package.json` using the following command.
    ```bash
   npm test
    ```
   Make sure PostgreSQL server is running and accessible from the runtime. You need to set correct env variable values in the provided `.env` file. 

## Test Cases Defined

- Currently, test case for only one of the MVPs, managing product details, is implemented. 
- All the current and future test cases are present in `__test__` directory.
- `jest` is used for implementing unit tests.

Following image shows the expected test case output for the product API.
![](../docs/assets/Product_API_Test.png)