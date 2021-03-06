import { nanoid } from "nanoid";
import db from "../database.js";

class UrlController {
    static createShortUrl = async (req, res) => {
        const { url } = req.body;
        const shortUrl = nanoid(7);
        const user = res.locals.user;
        try {
            await db.query(
                `
            INSERT INTO urls ("url", "shorten", "userId")
            VALUES ($1, $2, $3);
            `,
                [url, shortUrl, user.id]
            );
            return res.status(201).send({ shortUrl });
        } catch (err) {
            console.log(err);
            if (err.name === "error" && err.table) {
                return res.status(422).send({ details: err.detail });
            }
            return res.sendStatus(500);
        }
    };

    static getShortUrlById = async (req, res) => {
        const { id } = req.params;
        try {
            const urls = await db.query(
                `
            SELECT * FROM urls WHERE id = $1;
            `,
                [id]
            );
            if (!urls.rowCount) {
                return res.status(404).send({
                    message: `url com id de ${id} não foi encontrada`,
                });
            }
            const { url, shorten: shortUrl } = urls.rows[0];
            return res.status(200).send({ id, url, shortUrl });
        } catch (err) {
            console.log(err);
            if (err.name === "error" && err.table) {
                return res.status(422).send({ details: err.detail });
            }
            return res.sendStatus(500);
        }
    };

    static openShortUrl = async (req, res) => {
        const { shortUrl } = req.params;
        try {
            let url = await db.query(
                `
                SELECT urls.url, urls.id, urls.views 
                FROM urls 
                WHERE shorten = $1;
            `,
                [shortUrl]
            );
            console.log(url.rows);
            if (!url.rowCount) {
                return res.status(404).send({
                    message: `url não foi encontrada`,
                });
            }
            url = url.rows[0];
            await db.query(
                `
            UPDATE urls 
            SET views = $1
            WHERE urls.id = $2
            `,
                [url.views + 1, url.id]
            );
            return res.redirect(url.url);
        } catch (err) {
            console.log(err);
            if (err.name === "error" && err.table) {
                return res.status(422).send({ details: err.detail });
            }
            return res.sendStatus(500);
        }
    };

    static deleteUrl = async (req, res) => {
        const { id: urlId } = req.params;
        const { id: userId } = res.locals.user;
        console.log(urlId, userId);
        try {
            const result = await db.query(
                `
            SELECT urls."id", urls."userId" 
            FROM urls 
            WHERE urls.id = $1;
            `,
                [urlId]
            );
            console.log(result.rows);
            if (!result.rowCount)
                return res
                    .status(404)
                    .send({ message: "id de url inexistente!" });

            if (result.rows[0].userId != userId)
                return res.status(401).send({
                    message:
                        "somente usuários autorizados podem deletar esse recurso",
                });
            await db.query(
                `
            DELETE FROM urls
            WHERE urls."userId" = $1 and urls.id = $2
            `,
                [userId, urlId]
            );
            return res.status(204).send({ message: "recurso deletado" });
        } catch (err) {
            console.log(err);
            if (err.name === "error" && err.table) {
                return res.status(422).send({ details: err.detail });
            }
            return res.sendStatus(500);
        }
    };
}

export default UrlController;
