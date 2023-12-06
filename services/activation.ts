import jwt, { Secret } from 'jsonwebtoken'


interface ICreateToken {
    activationCode : string,
    token : string
}


export const createActivationToken = (user : any) : ICreateToken =>{
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
    const token = jwt.sign({user,activationCode},process.env.SECRET as Secret,{expiresIn : '5m'})

    return { activationCode,token}
}