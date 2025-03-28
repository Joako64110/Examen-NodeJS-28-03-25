import fs from 'fs/promises';
import readline from 'readline';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
    .option('file', {
        alias: 'f',
        type: 'string',
        description: 'Nombre del archivo JSON',
        default: 'productos.json'
    })
    .parse();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const preguntar = (query) => {
    return new Promise((resolve) => {
        rl.question(query, (respuesta) => resolve(respuesta));
    });
};

(async () => {
    try {
        const nombre = await preguntar('Producto: ');
        const precio = parseFloat(await preguntar('Precio: '));
        const cantidad = parseInt(await preguntar('Cantidad: '), 10);
        rl.close();

        if (isNaN(precio) || isNaN(cantidad)) {
            console.log('Error: Precio y cantidad deben ser números válidos.');
            return;
        }

        const producto = { nombre, precio, cantidad };
        const filePath = argv.file;
        let productos = [];

        try {
            const data = await fs.readFile(filePath, 'utf8');
            productos = JSON.parse(data);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error('Error al leer el archivo:', error);
                return;
            }
        }

        //Agregar nuevo producto
        productos.push(producto);

        //Guardar en el archivo
        await fs.writeFile(filePath, JSON.stringify(productos, null, 2));
        console.log('Producto guardado exitosamente.');

        //Leer y mostrar el contenido del JSON
        const contenido = await fs.readFile(filePath, 'utf8');
        console.log('Contenido del archivo:', contenido);
    } catch (error) {
        console.error('Ocurrió un error:', error);
    }
})();
