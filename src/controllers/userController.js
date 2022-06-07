import db from "../database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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
}

export default UserController;
