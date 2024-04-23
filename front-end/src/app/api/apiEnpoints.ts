import { assetData, auctionData, auctioneerData, filterAssetData, paymentData, userData, userLoginData } from '@/lib/constant/dataInterface';
import request from '../api/request';

//authentication
export function login(data: userLoginData) {
    return request.post('api/auth/login', data);
};

export function login2FA(data: any) {
    return request.post('api/auth/login/authenticate', data);
};

export function verifyUser() {
    return request.get('api/auth/verify');
};

export function reverifyUser(data: any) {
    return request.post('api/auth/verify', data);
};

export function createCustomer(data: userData) {
    return request.post('api/user/create/customer', data);
};


//user profile
export function getProfile() {
    return request.get('api/user/profile');
};

export function updateProfile(data: userData) {
    return request.put('api/user/profile', data);
};

//payment
export function viewPayment() {
    return request.get('api/user/payment');
};

export function updatePayment(data: paymentData) {
    return request.post('api/user/payment', data);
};

//asset
export function createAsset(data: assetData) {
    return request.post('api/asset/create', data);
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
    return request.post('api/user/create/staff', data);
};

export function createAuction(data: auctionData) {
    return request.post('api/aution/create', data);
};

export function addAuctionDocument(id: String, docs: BinaryData) {
    return request.postForm('api/auction/' + id + '/docs', {"key": docs});
};