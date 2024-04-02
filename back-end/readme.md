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

## Auctioneer

1. Create

    ```js
    POST user/create/staff

    {
        data: {
            name,
            ssid,
            role, // Auctioneer
        }
    }
    ```
