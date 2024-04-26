export type userLoginData = {
    email: string,
    password: string
};

export interface User {
    name: string,
    id: string,
    role: string,
    token: string
}

export type userData = {
    name: string | null,
    ssid: string | null,
    phone: string | null,
    email: string,
    address: string | null,
    password: string | null
};

export type paymentData = {
    bank: string,
    account_number: string,
    holder: string
};

export type assetData = {
    name: string,
    description: string
};

export type filterAssetData = {
    sort: string | undefined,
    name: string | undefined,
    description: string | undefined,
    verified: string | undefined,
    page: string | undefined,
    limit: string | undefined
};

export type auctioneerData = {
    name: string,
    ssid: string,
    role: string,
};

export type auctionData = {
    asset: string,
    starting_price: number,
    bidding_increment: number,
    deposit: number,
    registration_open: Date,
    registration_close: Date,
    auction_start: Date,
    auction_end: Date,
    max_number_of_bidder: number
};