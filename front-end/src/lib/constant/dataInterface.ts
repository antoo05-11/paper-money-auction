export type userLoginData = {
    email: string;
    password: string;
};

export type passwordData = {
    password?: string;
    newPassword?: string;
};

export interface User {
    name: string;
    id: string;
    role: string;
    token: string;
    isVerified: boolean;
}

export type userData = {
    _id?: string | null;
    name?: string | null;
    ssid?: string | null;
    phone?: string | null;
    email?: string | null;
    verified?: boolean;
    active?: boolean;
    address?: string | null;
    password?: string | null;
};

export type profileData = {
    name?: string | null;
    ssid?: string | null;
    phone?: string | null;
    email?: string | null;
    verified?: boolean;
    address?: string | null;
};

export type filterUserData = {
    sort: string | undefined;
    name: string | undefined;
    ssid: string | undefined;
    phone: string | undefined;
    email: string | undefined;
    active: boolean | undefined;
    role: string | undefined;
    page: number | undefined;
    limit: number | undefined;
};

export type paymentData = {
    bank?: string;
    account_number?: string;
    holder?: string;
};

export type fileData = {
    name: string;
    _id: string;
};

export type assetData = {
    _id: string;
    owner: {
        _id: string;
        email: string;
    };
    name: string;
    description: string;
    pics: fileData[];
    docs: fileData[];
    verified: boolean;
};

export type filterAssetData = {
    sort: string | undefined;
    name: string | undefined;
    description: string | undefined;
    owner?: string | undefined;
    auctioneer?: string | undefined;
    verified: boolean | undefined;
    page: number | undefined;
    limit: number | undefined;
};

export type auctioneerData = {
    name: string;
    ssid: string;
    role: string;
};

export type auctionData = {
    _id: string;
    asset: {
        name: string;
    };
    starting_price?: number;
    bidding_increment?: number;
    deposit?: number;
    registration_open?: Date;
    registration_close?: Date;
    auction_start?: Date;
    auction_end?: Date;
    max_number_of_bidder?: number;
};

export type filterAuctionData = {
    asset?: string;
    registration_open?: Date;
    registration_close?: Date;
    registration_open_sorted?: string;
    registration_close_sorted?: string;
    auction_start?: Date;
    auction_end?: Date;
    auction_start_sorted?: string;
    auction_end_sorted?: string;
    status?: string;
    page?: number;
    page_size?: number;
};

export type registerAuction = {
    auction: string;
    bidder: string;
    alias: string;
    verified: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
};

export type logData = {
    _id: string,
    subjectId: string,
    objectId: string,
    createdAt: string,
    objectClass: string,
    activityCode: string,
    success: string
};

export type filterLogData = {
    page: number | undefined;
    limit: number | undefined;
    user: string | undefined;
    success: boolean | undefined;
};
