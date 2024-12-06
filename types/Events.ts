import { Timestamp } from "firebase/firestore";
import { eventCategoryValues } from "validations/common";

export type EventCategory = (typeof eventCategoryValues)[number];

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

export interface IEventList {
  id: string;
  name: string;
  category: EventCategory;
  beginDate: Timestamp;
  endDate: Timestamp;
  location: string;
  imageCoverUrl: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
