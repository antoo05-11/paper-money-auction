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
    POST customer/create

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
    POST auctioneer/create

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
