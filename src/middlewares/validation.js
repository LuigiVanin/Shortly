import { signInSchema, signUpSchema } from "../helpers/schemas.js";

const signUpValidation = (req, res, next) => {
    const validaton = signUpSchema.validate(req.body, {
        abortEarly: false,
    });
    if (validaton.error) {
        return res
            .status(422)
            .send(validaton.error.details.map((err) => err.message));
    }
    next();
};

const signInValidation = (req, res, next) => {
    const validaton = signInSchema.validate(req.body, {
        abortEarly: false,
    });
    if (validaton.error) {
        return res
            .status(422)
            .send(validaton.error.details.map((err) => err.message));
    }
    next();
};

export { signUpValidation, signInValidation };
