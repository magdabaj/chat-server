import {Body, Controller, Get, Post, ValidationPipe, Req} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import {SignupCredentialsDto} from "./dto/signup-credentials.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) signUpCredentialsDto: SignupCredentialsDto): Promise<void> {
        return this.authService.signUp(signUpCredentialsDto)
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto)
    }

    // @Get('/verify')
    // verifyUser(@Req() req, @Body() token): Promise<{ username: string }> {
    //     return this.authService.verifyUser(req.user, token)
    // }

}
