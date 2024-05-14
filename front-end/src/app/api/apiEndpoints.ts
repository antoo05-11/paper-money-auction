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
  filterLogData,
  confirmAuction,
} from "@/lib/constant/dataInterface";
import request from "./request";

//authentication
export function loginUser(data: userLoginData) {
  return request.post("api/auth/login", { data: data });
}

export function login2FA(data: any) {
  return request.post("api/auth/login/authenticate", { data: data });
}

export function requestVerify() {
  return request.get("api/auth/verify");
}

export function verifyUserByCode(data: any) {
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

export function updateProfile(data: any) {
  return request.put("api/user/profile", { data: data });
}

export function updatePassword(data: any) {
  return request.put("api/user/password", { data: data });
}

export function suspenUser(id: String, data: any) {
  return request.put(`api/user/suspend/${id}`, { data: data });
}

//payment
export function viewPayment() {
  return request.get("api/user/payment-method");
}

export function updatePayment(data: paymentData) {
  return request.put("api/user/payment-method", { data: data });
}

//asset
export function createAsset(data: any) {
  const config = {
    headers: { "content-type": "multipart/form-data" },
  };
  return request.post("api/asset", data, config);
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

export function createStaff(data: userData) {
  return request.post("api/user/auctioneer", { data: data });
}

export function verifyAsset(id: String, data: any) {
  return request.put(`/api/asset/${id}`, { data: data });
}

// auction
export function createAuction(data: any) {
  return request.post("api/auction", data);
}

export function addAuctionDocument(id: String, docs: BinaryData) {
  return request.postForm("api/auction/" + id + "/docs", { key: docs });
}

export function listAuction(data: any) {
  if (data) return request.get("api/auction", { params: data });
  else return request.get("api/auction");
}

export function listOwnAuction(data: any) {
  if (data) return request.get("api/auction/owned", { params: data });
  else return request.get("api/auction/owned");
}

export function listRegisteredAuction(data: any) {
  if (data) return request.get("api/auction/registered", { params: data });
  else return request.get("api/auction/registered");
}

export function viewAuctionInfo(id: String) {
  return request.get(`api/auction/${id}`);
}
export function viewAuctionAct(id: String) {
  return request.get(`api/auction/${id}/activities`);
}
export function register_auction(id: String) {
  return request.post(`api/auction/${id}/register`);
}

export function joinAuctionSession(auction_id: String) {
  return request.get(`api/auction/${auction_id}/joinsession`);
}

export function listAuctionManaging(data: any) {
  return request.get("api/auction/managing", { params: data });
}

export function confirmBid(auction_id: string, data: confirmAuction) {
  return request.put(`api/auction/${auction_id}/confirm`, { data: data });
}

export function payDeposit(auction_id: any, amount: any) {
  return request.post(`/api/payment/${auction_id}`, {
    data: { type: "DEPOSIT", amount: amount },
  });
}

export function payAuction(auction_id: any, amount: any) {
  return request.post(`/api/payment/${auction_id}`, {
    data: { type: "PAYMENT", amount: amount },
  });
}

//bidder
export function listBidder(auction_id: any) {
  return request.get(`/api/auction/${auction_id}/bidders`);
}
export function verifyBidder(bidder_id: any, auction_id: any) {
  return request.put(`/api/auction/${auction_id}/verifyBidder/${bidder_id}`);
}

//customer
export function checkParticipation(auction_id: any) {
  return request.get(`/api/auction/${auction_id}/participationstatus`);
}

//log
export function listActivityLog(data: filterLogData) {
  if (data) return request.get("api/log", { params: data });
  else return request.get("api/log");
}
