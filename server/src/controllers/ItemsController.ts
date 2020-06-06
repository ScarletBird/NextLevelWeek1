import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
    async index(request:Request, response:Response){
        const items = await knex('items').select('*');
        // Seleciona items da database

        // Serialized Items serve para deixar o get mais fácil de ver e identificar seus integrantes 
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.1.111:3333/uploads/${item.image}`

            }
        })
        response.json(serializedItems);
    }
}

export default ItemsController;