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
