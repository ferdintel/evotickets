export const NOT_EMPTY_STRING = /^(?!.*^$).*/;
export const REQUIRED_FIELD_MESSAGE = "Champ requis";

// for event creation
export const DEFAULT_EVENT_CATEGORY = [
  { text: "Autre", value: "autre" },
  { text: "Business", value: "business" },
  { text: "Concert", value: "concert" },
  { text: "Conférence", value: "conference" },
  { text: "Exposition", value: "exposition" },
  { text: "Fête", value: "fete" },
  { text: "Formation", value: "formation" },
  { text: "Loisirs", value: "loisirs" },
  { text: "Sport", value: "sport" },
];

export const eventCategoryValues = DEFAULT_EVENT_CATEGORY.map(
  (category) => category.value
);
