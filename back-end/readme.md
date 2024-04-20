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
    POST /api/auth/login

    Body:
        {
            "data": {
                "email": "example@gmail.com",
                "password": "example"
            }
        }
    ```

    Login verify step:

    ```js
    POST /api/auth/login/authenticate

    Body:
        {
            "data": {
                "email": "example@gmail.com",
                "password": "password",
                "authenticCode": "123456"
            }
        }
    ```

2. Verify account

    ```js
    GET / api / auth / verify;

    Header: Authorization: "Bearer <customer's token>";
    ```

    ```js
    POST /api/auth/verify

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
    POST /api/user/create/customer

    Body:
        {
            "data": {
                "name": "Bach Buoi",
                "ssid": "014202004576",
                "phone": "0926754892",
                "email": "example@gmail.com",
                "address": "Sao hoa",
                "password": "password"
            }
        }
    ```

2. View profile

    ```js
    GET / api / user / profile;

    Header: Authorization: "Bearer <customer's token>";
    ```

3. Update profile

    ```js
    PUT /api/user/profile

    Header:
        Authorization: "Bearer <customer's token>"

    Body:
        {
            "data": {
                "name": "Bach Buoi",
                "ssid": "234520398459",
                "phone": "0943568293",
                "email": "gducky@gmail.com",
                "address": "Moc tinh"
            }
        }
    ```

4. View Payment method

    ```js
    GET / api / user / payment;

    Header: Authorization: "Bearer <customer's token>";
    ```

5. Update Payment method

    ```js
    PUT /api/user/payment

    Header:
        Authorization: "Bearer <customer's token>"

    Body:
        {
            "data": {
                "bank": "MB Bank",
                "account_number": "234954380234",
                "holder": "Bach Buoi",
            }
        }
    ```

## Asset

1. Create Asset

    ```js
    POST /api/asset/create

    Header:
        Authorization: "Bearer <customer's token>"

    Body:
        {
            "data": {
                "name": "example",
                "description": "example"
            }
        }
    ```

    ```js
    POST /api/asset/:id/pics

    Header:
        Authorization: "Bearer <customer's token>"

    Form:
        key: pics
    ```

    ```js
    POST /api/asset/:id/docs

    Header:
        Authorization: "Bearer <customer's token>"

    Form:
        key: docs
    ```

2. View Asset

    ```js
    GET /api/asset/:id

    Header:
        Authorization: "Bearer <customer's token>"
    ```

3. List Asset

    ```js
    GET /api/asset

    Header:
        Authorization: "Bearer <customer's token>"

    Params:
        sort: "name -description" // Field to sort, - is for descending
        name: "example",
        description: "example",
        verified: true, // or false
        page: 1,
        limit: 10 // page size
    ```

## Auctioneer

1. Create

    ```js
    POST /api/user/create/staff

    Header:
        Authorization: "Bear <admin's token>"

    Body:
        {
            "data": {
                "name": "Thanh An",
                "ssid": "23453645768",
                "role": "auctioneer", // Auctioneer
            }
        }
    ```

## Auction

1. Create Auction

    ```js
    POST /api/auction/create

    Header:
        Authorization: "Bearer <auctioneer's token>"

    Body:
        {
            "data": {
                "asset": "6623805feaec9306204beb7b",
                "starting_price": 200000,
                "bidding_increment": 10000,
                "deposit": 20000,
                "registration_open": "2024-05-23",
                "registration_close": "2024-05-27",
                "auction_start": "2024-06-12",
                "auction_end": "2024-06-20",
                "max_number_of_bidder": 100
            }
        }
    ```

    ```js
    POST /api/auction/:id/docs

    Header:
        Authorization: "Bearer <auctioneer's token>"

    Form:
        Key: docs
    ```
