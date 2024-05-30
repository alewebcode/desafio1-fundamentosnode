import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)


export class Database {
    #database = {}


    constructor() {
        fs.readFile(databasePath, 'utf8').then((data) => {
            this.#database = JSON.parse(data)
        }).catch(() => {

        })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    insert(table, data) {

        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    select(table, search) {

        let data = this.#database[table] ?? []

        if (search) {
            console.log(search)
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    console.log(row)
                    return row[key].includes(value)
                })
            })
        }

        return data
    }

    delete(table, id) {

        let rowIndex = this.#database[table].findIndex(row => row.id == id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)

            this.#persist()
        } else {
            throw err
        }
    }
    put(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)


        if (rowIndex > -1) {


            const newData = {
                id,
                title: data.title ? data.title : this.#database[table][rowIndex]['title'],
                description: data.description ? data.description : this.#database[table][rowIndex]['description'],
                completed_at: this.#database[table][rowIndex]['completed_at'],
                created_at: this.#database[table][rowIndex]['created_at'],
                updated_at: Date.now()
            }

            this.#database[table][rowIndex] = newData
            this.#persist()

        } else {
            throw err
        }
    }
    patch(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)


        if (rowIndex > -1) {

            if (this.#database[table][rowIndex]['completed_at']) {
                this.#database[table][rowIndex]['completed_at'] = null
            } else {
                this.#database[table][rowIndex]['completed_at'] = Date.now()
            }


            this.#persist()

        } else {
            throw err
        }
    }
}