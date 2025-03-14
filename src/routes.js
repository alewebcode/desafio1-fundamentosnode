import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            console.log(req.body)

            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: Date.now(),
                updated_at: Date.now()

            }

            database.insert('tasks', task)


            return res.writeHead(201).end()
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const { id } = req.params

            try {
                database.delete('tasks', id)

            } catch {
                return res.writeHead(204).end('Id não existe')
            }


            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            try {
                database.put('tasks', id, {
                    title,
                    description
                })
            } catch (err) {

                return res.writeHead(204).end('Id não existe')
            }


            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            try {
                database.patch('tasks', id)
            } catch (err) {

                return res.writeHead(204).end('Id não existe')
            }


            return res.writeHead(204).end()
        }
    }
]