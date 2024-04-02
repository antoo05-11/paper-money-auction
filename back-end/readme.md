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

3. View Payment method

    ```js
    GET auth/user/payment

    Header:
        Authorization: "Bearer <customer's token>"
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
