const express = require("express")
const cors = require("cors")

const port = 3001;
const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json)

app.post('/calculate', (req, res) => {
    try{
        const{
            electricityUsageKWh,
            transportationUsageGallonsPerMonth,
            shortFlight,
            mediumFlight,
            longFlight,
            dietaryChoice
        } = req.body

        const electricityFactor = 0.3978;
        const transportationFactor = 9.087;
        const shortFlightFactor = 100;
        const mediumFlightFactor = 200;
        const largeFactor = 300;
        const dietaryChoiceFactor = {
            Vegan: 200,
            Vegetarian: 400,
            Pescatarian: 600,
            MeatEater: 800
        }

        const year = 12;
        const electricityEmission = electricityUsageKWh * electricityFactor;
        const transportationEmission = transportationUsageGallonsPerMonth * transportationFactor
        const airTravelShortFlight = shortFlight * shortFlightFactor;
        const airTravelMediumFlight = mediumFlight * mediumFlightFactor;
        const airTravelLargeFlight = longFlight * largeFactor;
        const dietaryChoiceEmission = dietaryChoiceFactor[dietaryChoice] || 0;

        const totalEmissionsFlight = airTravelShortFlight + airTravelMediumFlight + airTravelLargeFlight
        const totalElectricityUsage = electricityEmission * year;
        const totalTransportationUsage = transportationEmission * year;

        const totalYearlyEmission = dietaryChoiceEmission + totalEmissionsFlight + totalElectricityUsage +totalTransportationUsage

        const result = {
            totalYearlyEmission: { value: totalYearlyEmission, unit: 'kgCO2/year'},
            totalTransportationUsage: { value: totalTransportationUsage, unit: 'kgCO2/year'},
            totalElectricityUsage: { value: totalElectricityUsage, unit: 'kgCO2/year'},   
            totalEmissionsFlight: { value: totalEmissionsFlight, unit: 'kgCO2/year'},
            dietaryChoiceEmission: { value: dietaryChoiceEmission, unit: 'kgCO2/year'},       
        }

        res.json(result)


    } catch(err){
        console.error('Theres an error idiot, line 64 server.js: ', err)
        res.status(500).json({ error: 'Internal server error'})
    }
})

app.listen(port, () => {
    console.log(`Server is running, yay ${port}`)
} )
