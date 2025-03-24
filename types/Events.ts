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

// event data to store in firestore
export type StoreEventDataType = {
  name: string;
  category: EventCategory;
  beginDate: Timestamp;
  endDate: Timestamp;
  location: string;
  imageCoverUrl: string;
  createdBy: string;
  managerEmail: string | null;
  members: { [key: string]: { role: string; assignedTicketQty: number } };
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
  managerEmail: string | null;
  members: { [key: string]: { role: string; assignedTicketQty: number } };
  createdAt: string;
  updatedAt: string;
};

// to set manager for an event
export type SetEventManagerFormValues = {
  managerEmail: string;
};
