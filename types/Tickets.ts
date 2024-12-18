export enum DefaultCurrencies {
  USD = "USD",
  CDF = "CDF",
}

export type GenerateTicketsFormValues = {
  ticketCount: number;
  ticketCategory: string;
  ticketPrice: {
    value: number;
    currency: DefaultCurrencies;
  };
};
