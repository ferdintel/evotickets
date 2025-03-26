export enum DefaultCurrencies {
  USD = "USD",
  CDF = "CDF",
}

export enum ETicketType {
  PRINTED = "PRINTED",
  ELECTRONIC = "ELECTRONIC",
}

export const ticketTypeInFrench: Record<ETicketType, string> = {
  [ETicketType.PRINTED]: "Imprimé",
  [ETicketType.ELECTRONIC]: "Électronique",
};

export type GenerateTicketsFormValues = {
  ticketCount: number;
  ticketCategory: string;
  ticketType: ETicketType;
  ticketPrice: {
    value: number;
    currency: DefaultCurrencies;
  };
};

export type TicketsAttributionFormValues = {
  quantity: number;
  category: string;
};

export enum ETicketStatus {
  VALID = "VALID",
  ACTIVE = "ACTIVE",
  USED = "USED",
  INVALID = "INVALID",
}

export const ticketStatusInFrench: Record<ETicketStatus, string> = {
  [ETicketStatus.VALID]: "Valide",
  [ETicketStatus.ACTIVE]: "Vendu",
  [ETicketStatus.USED]: "Utilisé",
  [ETicketStatus.INVALID]: "Invalide",
};

export type MemberAssignedTickets = {
  uid: string;
  email: string;
  displayName: string;
};
export type StoreTicketsDataType = {
  eventId: string;
  managerUid: string | null;
  code: string;
  category: string;
  price: {
    value: number;
    currency: DefaultCurrencies;
  };
  status: ETicketStatus;
  type: ETicketType;
  assignedTo: MemberAssignedTickets | null;
};

// ticket data getted from firestore
export type TicketsDataType = StoreTicketsDataType & {
  id: string;
};
