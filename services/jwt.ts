import jwt from 'jsonwebtoken'


interface ISignToken{
    id : string,
}

export const signToken = ({id}:ISignToken)=>{
    const token = jwt.sign({_id : id},process.env.SECRET || '',{expiresIn : '1d'})
    return token
}



export const verifyToken = (token : string) =>{
    const decoded :any = jwt.verify(token, process.env.SECRET || '');
    // change buffer type to string
    const convertDecoded = Buffer.from(decoded._id).toString('hex')
    return convertDecoded
}