import { parse } from 'csv-parse'
import fs from 'node:fs'

(async () => {

    const parser = fs.createReadStream('./tasks.csv').pipe(parse({ delimiter: ";", from_line: 2 }))

    for await (const record of parser) {
        const [title, description] = record


        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            path: 'tasks',
            body: JSON.stringify({
                title,
                description
            })
            //duplex: 'half'
        })


    }

})();


