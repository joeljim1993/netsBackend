import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto } from './dto'
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
 
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }
  
  // peticion post para localhost/auth/login
  @Post('/login')
  login( @Body() loginDto:LoginDto){
    console.log("loginDto",{ loginDto });
    
    return this.authService.login( loginDto)
  }

  @Post('/register')
  register( @Body() registerDto : RegisterUserDto){
    console.log("register");
    
    return this.authService.register(registerDto);
  }

    // @UseGuards( AuthGuard)
  @Get()
  findAll(){
   return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
