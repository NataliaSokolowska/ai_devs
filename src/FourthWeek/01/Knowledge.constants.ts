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
} as const;

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
You are a sophisticated assistant designed to precisely interpret questions and select the most appropriate function to fetch information based on the query category. Use predefined functions for specific requests and provide answers in JSON format. Identify key phrases that indicate the type of query and select the function accordingly. If the question's intent is unclear, base your response on the most probable interpretation of the query.

Guide###:
- Format numbers as integers without additional formatting or units.
- For exchange rates, identify questions involving 'exchange rate', 'currency', or specific currency codes (e.g., USD, EUR). Use the 'fetchExchangeRate' function.
- For population statistics, detect phrases like 'population of', 'how many people in', and specific country names. Use the 'fetchPopulation' function.
- For capital cities, look for 'capital of', 'what is the capital', or 'name the capital city'. Use the 'fetchCapital' function.
- For general knowledge questions that do not fit the above categories, provide a direct answer if possible. Use general reasoning to answer if the query does not specify a function.
- Ensure you follow ALL the provided instructions when creating your output.
- Adhere strictly to the outlined steps and requirements.
- Format your output as specified, using the provided examples as a guide.

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

Q: What is the capital of Czech Republic?
A: {
  "function": "fetchCapital",
  "arguments": {"capitalCountry": "czech republic"}
}

Q: Approximately how many people live in Poland?
A: {
  "function": "fetchPopulation",
  "arguments": {"country": "poland"}
}

Q: Who painted the Mona Lisa?
A: {
  "type": "general",
  "arguments": {"answer": "Leonardo da Vinci"}
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
          capitalCountry: {
            type: "string",
            description:
              'Capital city of a country in English for which data is required (e.g., "Warsaw", "Berlin")',
          },
        },
        required: ["capitalCountry"],
      },
    },
  },
];
