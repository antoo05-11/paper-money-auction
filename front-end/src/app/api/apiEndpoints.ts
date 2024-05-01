import {
  assetData,
  auctionData,
  auctioneerData,
  filterAssetData,
  paymentData,
  registerAuction,
  userData,
  userLoginData,
  filterUserData,
} from "@/lib/constant/dataInterface";
import request from "./request";

//authentication
export function loginUser(data: userLoginData) {
  return request.post("api/auth/login", { data: data });
}

export function login2FA(data: any) {
  return request.post("api/auth/login/authenticate", { data: data });
}

export function verifyUser() {
  return request.get("api/auth/verify");
}

export function reverifyUser(data: any) {
  return request.post("api/auth/verify", { data: data });
}

export function createCustomer(data: userData) {
  return request.post("api/user/customer", { data: data });
}

//list user
export function getAllUser(data: filterUserData) {
  return request.get("api/user/getAll", { params: { ...data } });
}

//user profile
export function getProfile() {
  return request.get("api/user/profile");
}

export function getUserProfileByID(id: String) {
  return request.get(`api/user/profile/${id}`);
}

export function updateProfile(data: filterUserData) {
  return request.put("api/user/profile", { data: data });
}

//payment
export function viewPayment() {
  return request.get("api/user/payment");
}

export function updatePayment(data: paymentData) {
  return request.post("api/user/payment", { data: data });
}

//asset
export function createAsset(data: assetData) {
  return request.post("api/asset/create", { data: data });
}

export function addAssetPicture(id: String, pics: BinaryData) {
  return request.postForm("api/asset/" + id + "/pics", { key: pics });
}

export function addAssetDocument(id: String, docs: BinaryData) {
  return request.postForm("api/asset/" + id + "/docs", { key: docs });
}

export function viewAsset(id: String) {
  return request.get("api/asset/" + id);
}

export function listAsset(data: filterAssetData) {
  if (data) return request.get("api/asset", { params: data });
  else return request.get("api/asset");
}

export function createStaff(data: auctioneerData) {
  return request.post("api/user/auctioneer", { data: data });
}

export function verifyAsset(id: String, data: any) {
  return request.put(`/api/asset/${id}`, { data: data });
}

// auction
export function createAuction(data: auctionData) {
  return request.post("api/aution/create", { data: data });
}

export function addAuctionDocument(id: String, docs: BinaryData) {
  return request.postForm("api/auction/" + id + "/docs", { key: docs });
}

export function listAuction(data: any) {
  if (data) return request.get("api/auction", { params: data });
  else return request.get("api/auction");
}
export function viewAuctionInfo(id: String) {
  return request.get(`api/auction/${id}`);
}
export function viewAuctionAct(id: String) {
  return request.get(`api/auction/${id}/act`);
}
export function register_Auction(id: String, data: registerAuction) {
  return request.post(`api/auction/${id}/register`, { data: data });
}

export function joinAuctionSession(auction_id: String) {
  return request.get(`api/auction/${auction_id}/joinsession`);
}

//bidder
export function listBidder(auction_id: any) {
  return request.get(`/api/auction/${auction_id}/bidders`);
}
