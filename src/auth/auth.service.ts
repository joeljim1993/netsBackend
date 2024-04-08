

import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './interfaces/login-response';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto, LoginDto, UpdateAuthDto,RegisterUserDto} from './dto'
import { Console } from 'console';





@Injectable()
export class AuthService {


  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,

    private jwtService: JwtService
  ) {}

   // 1- encriptar la contraseña
    // 2- guardar el usuario
    // 3-generar el JWT
  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log("createUserDto",createUserDto);
    
    try{

      const { password, ...userData } = createUserDto; 
      console.log(password,userData);
      
      // se encripta la contraseña mediante bcryptjs.hashSync
      const newUser = new this.userModel( {
        password:bcryptjs.hashSync( password,10),
        ...userData
      }  );
      console.log("newUser",newUser);


      // se guarda en la base de datos : mongo en este caso 
      await newUser.save();
      //  se genera un nuevo objecto que sera mostrado de respuesta , sin el password
      const { password:_,...user} = newUser.toJSON();
      return user;

    }catch(error){
      console.log(error);
      
      if( error.code === 11000 ){
      throw new BadRequestException(` ${ createUserDto.email } already exists!`);
      }
      throw new InternalServerErrorException('Something terrible happen :( ');
    }
  }



  async register(registerDto :RegisterUserDto):Promise<LoginResponse>{
    console.log(registerDto);
    
    const user = await this.create(  registerDto );
    console.log("user en register ",{user});
    
    return {
      user:user,
      token: this.getJwtToken({ id: user._id})

    }
  }




  async login( loginDto:LoginDto ):Promise<LoginResponse>{
  
    const { email , password} = loginDto;
    console.log({email,password});

    const user = await this.userModel.findOne({email});
    console.log("useeer",{user});
    
    if (!user){
      throw new  UnauthorizedException(' Not valid credentials-email');
    }

    if( !bcryptjs.compareSync( password ,user.password)){
      throw new  UnauthorizedException(' Not valid credentials--password');

    }
    const { password:_,...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id})
    }

  }

  findAll(){ 
    // retorna todo los usuarios
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth--findOne`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth--update`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth--remove `;
  }

 getJwtToken(payload: JwtPayload){
    const token =  this.jwtService.sign(payload)
    return token;
  }


}
