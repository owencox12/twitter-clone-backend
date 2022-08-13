import { body } from 'express-validator'


export const postsValidation = [
    body('text', 'Не достаточно длинны текста').isLength({ min: 3 }),
    body('imageUrl', 'Не верный формат картинки').isString()
]


export const registerValidation = [
    body('email', 'Введите email!').isEmail(),
    body('fullName', 'Имя должно быть минимум 2 символа!').isLength({min: 2}).isString(),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({min: 6}),
    body('avatarUrl', 'Не верный формат аватара').optional().isString()
]

