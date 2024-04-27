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
2. Get docs??

    ```js
    POST /api/auction/:id/docs

    Header:
        Authorization: "Bearer <auctioneer's token>"

    Form:
        Key: docs
    ```
2. Register auction.

   ```js
    POST /api/auction/:id/register

    Header:
        Authorization: "Bearer <customer's token>"

    Response:
       {
           "data": {
               "auction": "66239657cd6034add971485a",
               "bidder": "6616c959dad79db7d9869274",
               "alias": "Bidder 4",
               "verified": false,
               "_id": "662ccf3d3908fc015176fcdf",
               "createdAt": "2024-04-27T10:11:09.481Z",
               "updatedAt": "2024-04-27T10:11:09.481Z"
           }
        }
    ```
   
4. Get auction token to join session.

   ```js
    GET /api/auction/:id/joinsession

    Header:
        Authorization: "Bearer <customer's token>"

    Response:
        {
            "data": {
                "token": "Bearer <token>",
                "participation": {
                    "alias": "Bidder 4"
                }
            }
        }
    ```
5. View bidder list. (For auctioneer)

   ```json
   GET /api/auction/:id/bidders

   Header:
        Authorization: "Bearer <auctioneer's token>"
    
   Response:
   {
    "data": [
        {
            "_id": "662b3334b406b4c3877fe818",
            "auction": "66239657cd6034add971485a",
            "bidder": "6616c9d2cf9e137488558187",
            "alias": "kitcat",
            "verified": true,
            "createdAt": "2024-04-26T04:53:08.675Z",
            "updatedAt": "2024-04-26T04:53:08.675Z"
        },
        {
            "_id": "662b33862460a912c170dcbf",
            "auction": "66239657cd6034add971485a",
            "bidder": "660b7dbc025900586c734084",
            "alias": "lion",
            "verified": true,
            "createdAt": "2024-04-26T04:54:30.258Z",
            "updatedAt": "2024-04-26T04:54:30.258Z"
        }
    ]
   }
   ```
   
6. Verify auction bidder. (For auctioneer)
 ```json
  GET /api/auction/:id/verifyBidder/:bidderId

  Header:
        Authorization: "Bearer <auctioneer's token>"
   
  Response:
    {
       "data": {
           "_id": "662cd08398b97a1cb079020e",
           "auction": "66239657cd6034add971485a",
           "bidder": "6616c959dad79db7d9869274",
           "alias": "Bidder 4",
           "verified": true,
           "createdAt": "2024-04-27T10:16:35.405Z",
           "updatedAt": "2024-04-27T11:24:02.717Z"
       }
    }
   ```