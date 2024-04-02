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

    ```js
    POST auth/login

    {
        data: {
            email,
            password,
        }
    }
    ```

## Customer

1. Sign-up

    ```js
    POST user/create/customer

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
    GET user/profile

    Header:
        Authorization: "Bearer <customer's token>"
    ```

3. View Payment method

    ```js
    GET user/payment

    Header:
        Authorization: "Bearer <customer's token>"
    ```

## Auctioneer

1. Create

    ```js
    POST user/create/staff

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
