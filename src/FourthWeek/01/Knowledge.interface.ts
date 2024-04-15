type ExchangeResponse = {
  function: "fetchExchangeRate";
  arguments: {
    currency: string;
  };
};

type PopulationResponse = {
  function: "fetchPopulation";
  arguments: {
    country: string;
  };
};

type GeneralResponse = {
  type: "general";
  response: string;
};

export type ApiResponse =
  | ExchangeResponse
  | PopulationResponse
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
