import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/configtypeorm';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { FileuploadModule } from './modules/fileupload/fileupload.module';
import { JwtModule } from '@nestjs/jwt';
import { SeederModule } from './modules/seeder/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm') || {},
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SSECRET,
      signOptions: { expiresIn: '1h' },
    }),

    UsersModule,
    ProductsModule,
    AuthModule,
    CategoriesModule,
    OrdersModule,
    ProductsModule,
    FileuploadModule,
    SeederModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log('🛠️ TypeORM Config:', this.configService.get('typeorm'));
  }
}
