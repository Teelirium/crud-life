//@ts-check
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import express from 'express';
import { engine } from 'express-handlebars';
import * as fs from 'fs';
import postgres from 'postgres';
import { createInterface } from 'readline';

// const migrationClient = postgres('postgres://postgres:12345@localhost:5432', {
//     max: 1,
// });
// await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });

// const queryClient = postgres('postgres://postgres:12345@localhost:5432');
// const db = drizzle(queryClient);

const pg = postgres('postgres://postgres:12345@localhost:5432');

let resp = await pg`
DO $$ BEGIN
    CREATE TYPE "public"."status" AS ENUM('On', 'Off');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
`;
// console.log(resp);

resp = await pg`
DROP TABLE IF EXISTS "users";
`;
// console.log(resp);

resp = await pg`
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"registered_on" integer NOT NULL,
	"status" "status" NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
`;
// console.log(resp);

const SEPARATOR = ';';

const readStream = fs.createReadStream('input.csv', { encoding: 'utf-8' });
const rl = createInterface({ input: readStream, crlfDelay: Infinity });

const keys = ['username', 'email', 'registered_on', 'status'];
/** @type {Array<string>} */
const headers = [];
/** @type {Array<Record<keys[0], string>>} */
const dataArr = [];

let curLine = -1;

for await (const line of rl) {
    curLine++;
    if (curLine === 0) {
        headers.push(...line.split(SEPARATOR));
        continue;
    }

    const data = line.split(SEPARATOR);
    const entries = data.map((val, i) => [keys[i], val]);
    dataArr.push(Object.fromEntries(entries));
}

rl.close();
readStream.close();

const processedDataArr = dataArr.map((val) => {
    const [date, time] = val.registered_on.split(' ');
    const isoDate = date.split('.').reverse().join('-');
    const isoDateString = isoDate + 'T' + time.padStart(5, '0') + ':00.000Z';
    const finalDate = Date.parse(isoDateString);

    // console.log(isoDateString);
    return {
        ...val,
        registered_on: finalDate / 1000,
    };
});

resp = await pg`
INSERT INTO "users" ${pg(processedDataArr, ...keys)};
`;
// console.log(resp);

const app = express();
app.set('view engine', '.hbs');
app.set('views', './views');
app.engine('.hbs', engine({ extname: '.hbs' }));

app.get('/', async (req, res) => {
    const users = await pg`
    SELECT * FROM "users"
    WHERE "status" = 'On'
    ORDER BY "registered_on" ASC;
    `;
    const processedUsers = users.map((u) => ({
        ...u,
        registered_on: new Date(u.registered_on * 1000).toUTCString(),
    }));
    res.render('index', { users: processedUsers });
});

app.on('exit', async () => {
    await pg.end({ timeout: 5 });
});

app.listen(3000, () => {
    console.log(`App listening on: http://localhost:3000`);
});
