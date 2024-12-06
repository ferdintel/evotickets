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
