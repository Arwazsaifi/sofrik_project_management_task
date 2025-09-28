import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>("JWT_SECRET");
        const jwtExpiresIn = configService.get<string>("JWT_EXPIRES_IN") || "7d";
        
        // Log JWT module configuration
        console.log('=== JWT Module Configuration ===');
        console.log('JWT_SECRET loaded:', jwtSecret ? '✓ Yes' : '✗ No');
        console.log('JWT_SECRET length:', jwtSecret ? jwtSecret.length : 0);
        console.log('JWT_EXPIRES_IN:', jwtExpiresIn);
        console.log('================================');
        
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExpiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
