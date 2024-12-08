export const NOT_EMPTY_STRING = /^(?!.*^$).*/;
export const REQUIRED_FIELD_MESSAGE = "Champ requis";

// for event creation
export const DEFAULT_EVENT_CATEGORY = [
  { text: "Autre", value: "autre" },
  { text: "Atelier", value: "atelier" },
  { text: "Business", value: "business" },
  { text: "Concert", value: "concert" },
  { text: "Conférence", value: "conference" },
  { text: "Compétition", value: "competition" },
  { text: "Exposition", value: "exposition" },
  { text: "Fête", value: "fete" },
  { text: "Festival", value: "festival" },
  { text: "Formation", value: "formation" },
  { text: "Loisirs", value: "loisirs" },
  { text: "Networking", value: "networking" },
  { text: "Séminaire", value: "seminaire" },
  { text: "Sport", value: "sport" },
] as const;

export const defaultEventCategoryValues = DEFAULT_EVENT_CATEGORY.map(
  (category) => category.value
);
