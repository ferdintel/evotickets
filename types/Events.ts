import { Timestamp } from "firebase/firestore";
import { defaultEventCategoryValues } from "validators/common";

export type EventCategory = (typeof defaultEventCategoryValues)[number];

export type CreateEventFormValues = {
  eventName: string;
  eventCategory: EventCategory;
  eventDate: {
    begin: Date | string;
    end: Date | string;
  };
  eventLocation: string;
};

export type EventCover = {
  imageFile: File | null;
  imagePreview: string | null;
};

// field manager in event collection
export type EventManager = {
  uid: string;
  email: string;
  displayName: string;
  ticketsSoldCount: number;
  controlledTicketsCount: number;
  totalTicketsGenerated: number;
};
// field members in event collection
export type EventMember = {
  uid: string;
  email: string;
  displayName: string;
  role: EventMemberRole;
  assignedTicketsCount: number;
  scannedTicketsCount: number;
};
// field revenueStats in event collection
export type RevenueStats = {
  revenueEarned: {
    cdf: number;
    usd: number;
  };
  unrealizedRevenues: {
    cdf: number;
    usd: number;
  };
  totalExpected: {
    cdf: number;
    usd: number;
  };
};
// event data to store in firestore
export type StoreEventDataType = {
  name: string;
  category: EventCategory;
  beginDate: Timestamp;
  endDate: Timestamp;
  location: string;
  imageCoverUrl: string;
  createdBy: string;
  manager: EventManager | null;
  memberUids: string[];
  members: EventMember[];
  revenueStats: RevenueStats;
  ticketCategory:[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// event data getted from firestore
export type EventDataType = StoreEventDataType & {
  id: string;
};

// to set current event data (redux store)
export type CurrentEventDataSerialized = {
  id: string;
  name: string;
  category: string;
  beginDate: string;
  endDate: string;
  location: string;
  imageCoverUrl: string;
  createdBy: string;
  manager: EventManager | null;
  memberUids: string[];
  members: EventMember[];
  revenueStats: RevenueStats;
  ticketCategory:[];
  createdAt: string;
  updatedAt: string;
};

// to set manager for an event
export type SetEventManagerFormValues = {
  managerEmail: string;
};

// to invite a member to join your team for a specific event
export enum EventMemberRole {
  VENDOR = "VENDOR",
  CONTROLLER = "CONTROLLER",
}
export const eventMemberRoleInFrench: Record<EventMemberRole, string> = {
  [EventMemberRole.VENDOR]: "Vendeur",
  [EventMemberRole.CONTROLLER]: "Contrôleur",
};
export type InviteMemberFormValues = {
  memberEmail: string;
  memberRole: EventMemberRole;
};

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export const invitationStatusInFrench: Record<InvitationStatus, string> = {
  [InvitationStatus.PENDING]: "En attente",
  [InvitationStatus.ACCEPTED]: "Acceptée",
  [InvitationStatus.REJECTED]: "Refusée",
};

export type StoreInvitationDataType = {
  eventId: string;
  invitee: {
    uid: string;
    email: string;
    displayName: string;
    role: EventMemberRole;
  };
  invitedBy: {
    uid: string;
    email: string;
    displayName: string;
  };
  status: InvitationStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type InvitationDataType = StoreInvitationDataType & {
  id: string;
};
