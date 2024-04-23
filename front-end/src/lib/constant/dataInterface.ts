export type userLoginData = {
    email: String,
    password: String
};

export type userData = {
    name: String | undefined,
    ssid: String | undefined,
    phone: String | undefined,
    email: String,
    address: String | undefined,
    password: String | undefined
};

export type paymentData = {
    bank: String,
    account_number: String,
    holder: String
};

export type assetData = {
    name: String,
    description: String
};

export type filterAssetData = {
    sort: String | undefined,
    name: String | undefined,
    description: String | undefined,
    verified: String | undefined,
    page: String | undefined,
    limit: String | undefined
};

export type auctioneerData = {
    name: String,
    ssid: String,
    role: String,
};

export type auctionData = {
    asset: String,
    starting_price: Number,
    bidding_increment: Number,
    deposit: Number,
    registration_open: Date,
    registration_close: Date,
    auction_start: Date,
    auction_end: Date,
    max_number_of_bidder: Number
};