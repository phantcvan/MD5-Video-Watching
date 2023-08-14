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
  logoUrl: string | undefined;
  thumbnailM: string | undefined;
  channelCode: string;
  recordHistory: number;
  about: string;
}

export interface ChannelEditType {
  channelName: string;
  logoUrl: string | undefined;
  thumbnailM: string | undefined;
  about: string | null;
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

export interface CmtAct {
  id: number;
  action: number;
  channelId: number;
}

export interface SearchHistoryType {
  id: number;
  searchContent: string;
  channel: ChannelType;
}
export interface SearchSuggestType {
  id: number;
  tag: string;
}