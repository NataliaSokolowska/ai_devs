export interface ExchangeResponse {
  function: "fetchExchangeRate";
  arguments: {
    currency: string;
  };
}

export interface PopulationResponse {
  function: "fetchPopulation";
  arguments: {
    country: string;
  };
}

export interface CapitalResponse {
  function: "fetchCapital";
  arguments: {
    capitalCountry: string;
  };
}

interface GeneralResponse {
  type: "general";
  arguments: {
    answer: string;
  };
}

export type ApiResponse =
  | ExchangeResponse
  | PopulationResponse
  | CapitalResponse
  | GeneralResponse;

export interface FunctionCalling {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: {
        [key: string]: {
          type: string;
          description: string;
        };
      };
      required: string[];
    };
  };
}
