import inquirer  from 'inquirer';
import colors from 'colors';

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Seleccione una opción',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]   
    }
];

const inquirerMenu = async() => {
    
    console.clear();
    console.log('========================'.green);
    console.log(' Seleccione una opcion '.white);
    console.log('========================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;

}

const pausa = async() => {

    const mensaje = [
        {
            type: 'input',
            name: 'Pausa',
            message: `Presiona ${'ENTER'.green} para continuar`,
        }
    ]

    await inquirer.prompt(mensaje)
};

const leerInput = async( message ) => {
    
    const pregunta = [  
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ]

    const { desc } = await inquirer.prompt(pregunta);
    return desc;

}

const listarLugares = async(lugares = {}) =>{

    const choices = lugares.map( (lugar, i) =>{
        const idx = `${i + 1}`.green;
            return {
                value: lugar.id,
                name:  `${idx} ${lugar.nombre}`,
            }
    })

    choices.unshift({
        value: '0',
        name: '0.'.green + ' cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas); 
    return id;
}

const confirmar = async(message) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]

    const { ok } = await inquirer.prompt(question);
    return ok; 

}

const listadoTareas = async( tareas = []) =>{

    const choices = tareas.map( (tarea, i) =>{
     
         const idx = `${i + 1}`;
         return {
             value: tarea.id,
             name:  `${idx} ${tarea.desc}`,
             checked: (tarea.completadoEn) ? true : false
         }
   
     })
 
 
     const preguntas = [
         {
             type: 'checkbox',
             name: 'ids',
             message: 'Seleccione',
             choices
         }
     ]
 
     const { ids } = await inquirer.prompt(preguntas); 
     return ids;
 }


export{ inquirerMenu, pausa, leerInput, listarLugares, confirmar, listadoTareas }