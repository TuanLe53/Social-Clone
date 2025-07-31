import { privateAPI, publicAPI } from ".";

export const getCurrentUser = () => privateAPI.get('/user/me/');
export const getProfile = (username: string) => publicAPI.get(`/user/${username}`);
export const searchUsers = (username: string) => publicAPI.get(`/user/search/?username=${username}`);
export const followUser = (user_id: string) => privateAPI.post(`/user/follow/?following_id=${user_id}`);
export const unfollowUser = (user_id: string) => privateAPI.delete(`/user/follow/?following_id=${user_id}`);
export const isFollowingUser = (user_id: string) => privateAPI.get(`/user/is_following/${user_id}`);
export const getFollowers = (user_id: string) => publicAPI.get(`/user/followers/?user_id=${user_id}`);
export const getFollowings = (user_id: string) => publicAPI.get(`/user/followings/?user_id=${user_id}`);