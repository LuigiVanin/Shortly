import db from "../database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { refactResult } from "../helpers/utils.js";

class UserController {
    static createUser = async (req, res) => {
        const { name, email, password } = req.body;
        try {
            await db.query(
                `
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            `,
                [name, email, bcrypt.hashSync(password, 10)]
            );
            return res
                .status(201)
                .send({ message: "recurso criado com sucesso" });
        } catch (err) {
            console.log(err);
            if (err.name === "error" && err.table) {
                return res.status(422).send({ details: err.detail });
            }
            return res.sendStatus(500);
        }
    };

    static signIn = async (req, res) => {
        const { password, email } = req.body;
        try {
            const user = await db.query(
                `
            SELECT * FROM users WHERE email = $1
            `,
                [email]
            );
            if (user.rowCount === 0) {
                return res
                    .status(404)
                    .send({ message: "Não existe usuário com esse email!" });
            }
            if (!bcrypt.compareSync(password, user.rows[0].password)) {
                return res.status(401).send({ message: "senha incorreta!" });
            }
            const token = uuid();
            await db.query(
                `
                INSERT INTO sessions ("token", "userId")
                VALUES ($1, $2);
            `,
                [token, user.rows[0].id]
            );
            return res.status(200).send({ token });
        } catch (err) {
            console.log(err);
            if (err.name === "error" && err.table) {
                return res.status(422).send({ details: err.detail });
            }
            return res.sendStatus(500);
        }
    };

    static getUrlsByUser = async (req, res) => {
        const { id: userId } = req.params;
        try {
            let result = await db.query(
                `
            SELECT users.id as id, users.name, urls.id as "urlId",urls.url, urls.shorten as "shortUrl" , urls.views 
            FROM users
            JOIN urls ON urls."userId" = users.id
            WHERE users.id = $1
            `,
                [userId]
            );
            if (!result.rowCount) {
                const user = await db.query(
                    `
                SELECT id, name FROM users WHERE id = $1;
                `,
                    [userId]
                );
                if (!user.rowCount)
                    return res
                        .status(404)
                        .send({ message: "Não existe usuário com esse id!" });

                return res.send({
                    ...user.rows[0],
                    visitedCount: 0,
                    shortnedUrls: [],
                });
            }
            return res.status(200).send(refactResult(result.rows));
        } catch (err) {
            console.log(err);
            if (err.name === "error" && err.table) {
                return res.status(422).send({ details: err.detail });
            }
            return res.sendStatus(500);
        }
    };

    static getRanking = async (req, res) => {
        try {
            const result = await db.query(`
            SELECT users.id, users.name, users.email, COUNT(urls.id) as "linksCount", SUM(COALESCE(urls.views, 0)) as "visitCount"
            FROM users
            LEFT JOIN urls ON urls."userId" = users.id
            GROUP BY users.name, users.email, users.id
            ORDER BY "visitCount" DESC
            LIMIT 10
            `);

            return res.status(200).send(result.rows);
        } catch (err) {
            console.log(err);
            if (err.name === "error" && err.table) {
                return res.status(422).send({ details: err.detail });
            }
            return res.sendStatus(500);
        }
    };
}

export default UserController;
