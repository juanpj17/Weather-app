import  { inquirerMenu, pausa, leerInput, listarLugares } from './helpers/inquirer.js';
import { Busquedas } from './models/busquedas.js'
import 'dotenv/config'

console.log(process.env.OPENWEATHER_KEY)

const main = async() => {

    let opt = 1;

    const busquedas = new Busquedas();

    while(opt){

        opt = await inquirerMenu();

        switch( opt ){

            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad:');
             
                //Busca los lugares
                const lugares = await busquedas.ciudad(termino);

                //Seleciona el lugar
                const id = await listarLugares(lugares);

                if( id === '0' ) { continue; }

                const lugarSel = lugares.find( l => l.id === id);
                
                busquedas.agregarHistorial( lugarSel.nombre )

                //clima
                const clima = await busquedas.climaCiudad(lugarSel.lat, lugarSel.lon);

                //resultados
                console.clear();
                console.log('Informacion de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre);
                console.log('Latitud: ', lugarSel.lat);
                console.log('Longitud: ', lugarSel.lon);
                console.log('Temperatura: ', clima.temp);
                console.log('Temperatura minima:', clima.temMin);
                console.log('Temperatua maxima: ', clima.temMax);
                break; 

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) =>{
                    const idx = `${ i + 1 }`.green;
                    console.log(`${idx}. ${ lugar }`)
                })
        }

        if(opt) await pausa();
        
    }
}

main();