export interface UserType {
  id: number;
  email: string;
  channelName: string;
  joinDate: string;
  logoUrl: string;
  thumbnail: string;
  channelCode: string;
  recordHistory: number;
}

export interface ChannelType {
  id: number;
  email: string;
  channelName: string;
  joinDate: string;
  logoUrl: string;
  thumbnail: string;
  channelCode: string;
  recordHistory: number;
}

export interface VideoType {
  id: number;
  thumbnail: string;
  title: string;
  upload_date: string;
  videoCode: string;
  videoUrl: string;
  description: string;
  views: number;
  channel: ChannelType;
}

export interface AllTags {
  tag: string;
}

export interface Cmt {
  id: number;
  channel: string;
  content: string;
  cmt_date: string;
  cmt_reply: number;
  level: number;
}