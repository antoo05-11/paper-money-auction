import { assetData, auctionData, auctioneerData, filterAssetData, paymentData, userData, userLoginData } from '@/lib/constant/dataInterface';
import request from './request';

//authentication
export function loginUser(data: userLoginData) {
    return request.post('api/auth/login', {data: data});
};

export function login2FA(data: any) {
    return request.post('api/auth/login/authenticate', {data: data});
};

export function verifyUser() {
    return request.get('api/auth/verify');
};

export function reverifyUser(data: any) {
    return request.post('api/auth/verify', {data: data});
};

export function createCustomer(data: userData) {
    return request.post('api/user/create/customer', {data: data});
};


//user profile
export function getProfile() {
    return request.get('api/user/profile');
};

export function updateProfile(data: userData) {
    return request.put('api/user/profile', {data: data});
};

//payment
export function viewPayment() {
    return request.get('api/user/payment');
};

export function updatePayment(data: paymentData) {
    return request.post('api/user/payment', {data: data});
};

//asset
export function createAsset(data: assetData) {
    return request.post('api/asset/create', {data: data});
};

export function addAssetPicture(id: String, pics: BinaryData) {
    return request.postForm('api/asset/' + id + '/pics', {"key": pics});
};

export function addAssetDocument(id: String, docs: BinaryData) {
    return request.postForm('api/asset/' + id + '/docs', {"key": docs});
};

export function viewAsset(id: String) {
    return request.get('api/asset/' + id);
};

export function listAsset(data: filterAssetData) {
    return request.get('api/asset', {params: data});
};

export function createStaff(data: auctioneerData) {
    return request.post('api/user/create/staff', {data: data});
};

export function createAuction(data: auctionData) {
    return request.post('api/aution/create', {data: data});
};

export function addAuctionDocument(id: String, docs: BinaryData) {
    return request.postForm('api/auction/' + id + '/docs', {"key": docs});
};