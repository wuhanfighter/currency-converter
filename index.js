// module imports
const axios = require('axios')

// api keys
const FIXER_API_KEY = '7d8b844fc61fd2f02c5353b8e64166aa'
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`
const REST_COUNTRIES_API = `https://restcountries.eu/rest/v2/currency`

// fetch currency data
const getExchangeRate = async (fromCurrency, toCurrency) => { 
    try {
        const { data: { rates } } = await axios.get(FIXER_API)
        const baseCurrency = 1 / rates[fromCurrency]
        const exchangeRate = baseCurrency * rates[toCurrency]

        return exchangeRate
    } catch (error) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`)
    }

}

// fetch countries data
const getCountries = async (currencyCode) => {
    try { 
        const { data } = await axios.get(`${REST_COUNTRIES_API}/${currencyCode}`)
    
        return data.map((country) => country.name)
    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}`)
    }

}

// convert currency
const convertCurrency = async (fromCurrency, toCurrency, amount) => { 
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    const [exchangeRate, countries] = await Promise.all([
        getExchangeRate(fromCurrency, toCurrency),
        getCountries(toCurrency)
    ]);

    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return (`
        ${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.
        You can spend it in ${countries}.
    `);
}

// convert now
convertCurrency('MYR', 'USD', 1)
    .then((result) => console.log(result))
    .catch((error) => console.log(error))
