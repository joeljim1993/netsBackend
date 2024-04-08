import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    // 1 se importa jwtService
    private jwtService:JwtService,
  ){}

  canActivate(context: ExecutionContext,) :Promise<boolean>  {

    // const request = context.switchToHttp().getRequest();
    // const token = this.extractTokenFromHeader(request);

    // console.log({token });
    

    // return Promise.resolve(true) ;
    return
  }

  // private extractTokenFromHeader(request: Request): string | undefined {
  //   const [type, token] = request.headers['authorization']?.split(' ') ?? [];
  //   return type === 'Bearer' ? token : undefined;
  // }
}
