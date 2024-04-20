# Command

## Build

```bash
npm run build
```

## Start

```bash
npm run start
```

# API

## Authentication

1. Login

    Login step:

    ```js
    POST auth/login

    {
        data: {
            email,
            password
        }
    }
    ```

    Login verify step:

    ```js
     POST auth/login/authenticate

     {
         data: {
             email,
             password,
             authenticCode
         }
     }
    ```

2. Verify account

    ```js
    GET auth/verify

    Header:
        Authorization: "Bearer <customer's token>"
    ```

    ```js
    POST auth/verify

    Header:
        Authorization: "Bearer <customer's token>"

    {
        "data": {
            "code": "123456"
        }
    }
    ```

## Customer

1. Sign-up

    ```js
    POST auth/user/create/customer

    {
        data: {
            name,
            ssid,
            phone,
            email,
            address,
            password,
        }
    }
    ```

2. View profile

    ```js
    GET auth/user/profile

    Header:
        Authorization: "Bearer <customer's token>"
    ```

3. Update profile

    ```js
    PUT user/profile

    Header:
        Authorization: "Bearer <customer's token>"

    {
        data: {
            name,
            ssid,
            phone,
            email,
            address,
        }
    }
    ```

4. View Payment method

    ```js
    GET auth/user/payment

    Header:
        Authorization: "Bearer <customer's token>"
    ```

5. Update Payment method

    ```js
    PUT user/payment

    Header:
        Authorization: "Bearer <customer's token>"

    {
        data: {
            bank,
            account_number,
            holder,
        }
    }
    ```

## Asset

1. Create Asset

    ```js
    POST asset/create

    Header:
        Authorization: "Bearer <customer's token>"

    {
        "data": {
            "name": "example",
            "description": "example"
        }
    }
    ```

    ```js
    POST asset/:id/pics

    Header:
        Authorization: "Bearer <customer's token>"

    Form:
        key: pics
    ```

    ```js
    POST asset/:id/docs

    Header:
        Authorization: "Bearer <customer's token>"

    Form:
        key: docs
    ```

## Auctioneer

1. Create

    ```js
    POST auth/user/create/staff

    Header:
        Authorization: "Bear <admin's token>"

    {
        data: {
            name,
            ssid,
            role, // Auctioneer
        }
    }
    ```
