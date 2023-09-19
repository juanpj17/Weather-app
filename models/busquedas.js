import fs from 'fs'
import axios, {isCancel, AxiosError} from 'axios'



class Busquedas {
    historial = [];
    dbPath = './db/database.json';
    
    constructor(){
        this.leerBD();
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather(){
        return{
            appid : process.env.OPENWEATHER_KEY,
            units: 'metric',
            lan: 'es'
        }
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');

        });
    }

    async ciudad( lugar = "" ){

        try{

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get();

            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lon: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch(error){
            
            return [];

        }
        return []; //retorna las ciudades que coinciden

    }

    async climaCiudad( lat = '', lon = '' ){
       
        try{
            
            const instace = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            })

            const resp = await instace.get();
            const {weather, main} = resp.data;
            
            return{
                desc: weather[0].description,
                temMin: main.temp_min,
                temMax: main.temp_max,
                temp: main.temp
            }

        } catch(error){
            console.log(error);
        }

    }

    agregarHistorial( lugar = ''){

        //Prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial.unshift(lugar.toLocaleLowerCase());

        this.guardarBD();
    }

    guardarBD(){

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    leerBD(){

        if(!fs.existsSync(this.dbPath)){
            return;
        }
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8'} );
        const data = JSON.parse( info );
        this.historial = data.historial;
    
    }

}

export { Busquedas };