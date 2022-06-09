import Joi from "joi";

const signUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().equal(Joi.ref("password")).required(),
});

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const postUrlSchema = Joi.object({
    url: Joi.string()
        .pattern(/^http(s)?:\/\//)
        .required(),
});

const authSchema = Joi.string()
    .pattern(/^Bearer /)
    .required();

export { signUpSchema, signInSchema, postUrlSchema, authSchema };
