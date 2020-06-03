import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async index(request: Request, response: Response){
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id','=','point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return response.json(points);
    }

    async show(request: Request, response: Response) {
        const {id} = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({ message: 'Ponto de coleta não encontrado' });
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({point, items});
    }

    async create(request: Request, response: Response) {
        // Capturas os dados do corpo da requisição
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        // Usado no lugar do knex para inserção nos bancos de dados: caso um não execute, o outro
        // também não executará
        const trx = await knex.transaction();

        // Melhor legibilidade
        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        // Insere o novo ponto de coleta no banco de dados
        const insertedIds = await trx('points').insert(point);

        // Criação da variável com o novo ID do ponto de coleta (facilita a legibilidade da
        // função abaixo)
        const point_id = insertedIds[0];

        // Cria uma relação dos items com o ponto de coleta para inserção no banco de dados
        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        })

        // Insere no banco de dados
        await trx('point_items').insert(pointItems);

        // Faz a inserção (caso não tenha erros) nos bancos de dados
        await trx.commit();

        return response.json({
            id: point_id,
            ... point,
        });
    }
}

export default PointsController;