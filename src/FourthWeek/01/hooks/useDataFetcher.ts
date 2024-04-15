const useDataFetcher = () => {
  const fetchExchangeRate = (currency: string) => {
    const url = `http://api.nbp.pl/api/exchangerates/rates/a/${currency}/`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const rate = data.rates[0].mid;
        return rate;
      })
      .catch((error) => {
        console.error("Error fetching exchange rate for", currency, ":", error);
        throw error;
      });
  };

  const fetchPopulation = (country: string) => {
    const url = `https://restcountries.com/v2/name/${country}`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const population = data[0].population;
        return population;
      })
      .catch((error) => {
        console.error("Error fetching population for", country, ":", error);
        throw error;
      });
  };

  const fetchCapital = async (capitalCountry: string) => {
    try {
      const response = await fetch(
        `/restcountries/${capitalCountry.toLowerCase()}?fields=capital`
      );
      const data = await response.json();
      const capital = data[0].capital;
      return capital;
    } catch (error) {
      console.error(
        "Error fetching population for",
        capitalCountry,
        ":",
        error
      );
      throw error;
    }
  };

  return { fetchExchangeRate, fetchPopulation, fetchCapital };
};

export default useDataFetcher;
