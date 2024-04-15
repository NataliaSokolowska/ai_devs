/* eslint-disable no-useless-escape */
import { FunctionCalling } from "./Knowledge.interface";

export const TYPE_OF_DATA = {
  EXCHANGE: "exchange",
  POPULATION: "population",
  GENERAL: "general",
};

export const TYPE_OF_DATA_V2 = {
  EXCHANGE: "fetchExchangeRate",
  POPULATION: "fetchPopulation",
  CAPITAL: "fetchCapital",
  GENERAL: "general",
};

export const KNOWLEDGE_SYSTEM_PROMPT = `
You are a helpful assistant designed to answer questions in a specific manner based on the category of the query.
Guide###:
- if question is about general knowledge, provide a suitable answer {
  "${TYPE_OF_DATA.GENERAL}": {
    "answer": "eur"
  }
}
- if you are unsure of the answer and the question relates to exchange rates, respond with JSON:
  {
    "${TYPE_OF_DATA.EXCHANGE}": {
      "currency": "eur"
    }
  }
- if the question pertains to population statistics, respond with JSON:
  {
    "${TYPE_OF_DATA.POPULATION}": {
      "country": "Poland"
    }
  }
- if answer is a number, write as integer, without formatting and units
Example###:
Q: podaj aktualny kurs franka szwajcarskiego task question
A: {"${TYPE_OF_DATA.EXCHANGE}": {"currency": "chf"}}

Q: What is the population of Germany?
A: {"${TYPE_OF_DATA.POPULATION}": {"country": "germany"}}

Q: jaka jest populacja Niemiec?
A: {"${TYPE_OF_DATA.POPULATION}": {"country": "germany"}}

Q: Who painted the Mona Lisa?
A: {"${TYPE_OF_DATA.GENERAL}": {"answer": "Leonardo da Vinci"}}

Q: What is the boiling point of water?
A: {"${TYPE_OF_DATA.GENERAL}": {"answer": "100 degrees Celsius"}}
`;

export const KNOWLEDGE_SYSTEM_PROMPT_V2 = `
You are a helpful assistant designed to dynamically answer questions based on the category of the query using predefined functions. Answer in JSON format.
Guide###:
- If the answer is a number, format it as an integer without any additional formatting or units.
- If the question is about general knowledge, provide a suitable direct answer in JSON format.
- For questions relating to exchange rates, use the 'fetchExchangeRate' function with the specified currency.
- For questions on population statistics, use the 'fetchPopulation' function with the specified country.
- For questions on capital country name, use the 'fetchCapital' function with the specified country.

Examples:
Q: What is the exchange rate for the Euro?
A: {
  "function": "fetchExchangeRate",
  "arguments": {"currency": "EUR"}
}

Q: What is the population of Germany?
A: {
  "function": "fetchPopulation",
  "arguments": {"country": "germany"}
}

Q: Ile ludzi mieszka w Polsce?
A: {
  "function": "fetchPopulation",
  "arguments": {"country": "poland"}
}

Q: Jaka jest populacja niemiec?
A: {
  "function": "fetchPopulation",
  "arguments": {"country": "germany"}
}

Q: Podaj populację Francji?
A: {
  "function": "fetchPopulation",
  "arguments": {"country": "france"}
}

Q: Jaka jest stolica Francji?
A: {
  "function": "fetchCapital",
  "arguments": {"country": "france"}
}

Q: Co jest stolicą Czech?
A: {
  "function": "fetchCapital",
  "arguments": {"country": "czech"}
}

Q: Who painted the Mona Lisa?
A: {
  "type": "general",
  "arguments": {"answer": "Leonardo da Vinci"}
}

Q: What is the boiling point of water?
A: {
  "type": "general",
  "arguments": {"answer": "100 degrees Celsius"}
}
`;

export const FUNCTION_CALLING: FunctionCalling[] = [
  {
    type: "function",
    function: {
      name: TYPE_OF_DATA_V2.EXCHANGE,
      description: `Calls to National Bank of Poland's API get the exchange rate for a specified currency. Returns the mid market rate as a number.`,
      parameters: {
        type: "object",
        properties: {
          currency: {
            type: "string",
            description:
              "Currency code (e.g., USD, EUR) for which the exchange rate is required.",
          },
        },
        required: ["currency"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: TYPE_OF_DATA_V2.POPULATION,
      description:
        "Calls an API - restcountries.com -to get the population of a specified country. Returns the population as a number.",
      parameters: {
        type: "object",
        properties: {
          country: {
            type: "string",
            description:
              'Country name in English for which population data is required (e.g., "Poland", "Germany")',
          },
        },
        required: ["country"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: TYPE_OF_DATA_V2.CAPITAL,
      description:
        "Calls an API - restcountries.com -to get the capital of a specified country. Returns the capital as a string.",
      parameters: {
        type: "object",
        properties: {
          country: {
            type: "string",
            description:
              'Capital city of a country in English for which data is required (e.g., "Warsaw", "Berlin")',
          },
        },
        required: ["country"],
      },
    },
  },
];
