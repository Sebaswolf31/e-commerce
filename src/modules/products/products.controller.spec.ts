import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { UpdateProductDto } from './dtos/update-products.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    getProductsService: jest.fn().mockResolvedValue({
      total: 1,
      page: 1,
      limit: 5,
      data: [{ id: '1', name: 'Producto 1', price: 100 }],
    }),
    addProducts: jest.fn().mockResolvedValue({
      message: 'Productos agregados o actualizados con éxito',
    }),
    updateProductService: jest.fn().mockResolvedValue({
      message: 'El producto con ID "1" ha sido actualizado correctamente.',
      product: { id: '1', name: 'Producto Actualizado', price: 200 },
    }),
  };
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('fake-token'),
    verify: jest.fn().mockReturnValue({ userId: 1 }),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });
  describe('getProducts', () => {
    it('debería devolver una lista de productos con valores por defecto', async () => {
      const result = await controller.getProducts(undefined, undefined);
      expect(service.getProductsService).toHaveBeenCalledWith(1, 5);
      expect(result).toEqual({
        total: 1,
        page: 1,
        limit: 5,
        data: [{ id: '1', name: 'Producto 1', price: 100 }],
      });
    });

    it('debería devolver una lista de productos con paginación específica', async () => {
      await controller.getProducts('2', '10');
      expect(service.getProductsService).toHaveBeenCalledWith(2, 10);
    });
  });

  describe('addProducts', () => {
    it('debería agregar productos desde el seeder', async () => {
      const rawResult = await controller.addProducts();
      const result =
        typeof rawResult === 'string' ? { message: rawResult } : rawResult;

      expect(service.addProducts).toHaveBeenCalled();
      expect(result.message).toBe(
        'Productos agregados o actualizados con éxito',
      );
    });
  });

  describe('updateProduct', () => {
    it('debería actualizar un producto y devolver el mensaje de confirmación', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Producto Actualizado',
        price: 200,
      };

      const result = await controller.updateProduct('1', updateDto);
      expect(service.updateProductService).toHaveBeenCalledWith('1', updateDto);
      expect(result).toEqual({
        message: 'El producto con ID "1" ha sido actualizado correctamente.',
        product: { id: '1', name: 'Producto Actualizado', price: 200 },
      });
    });
  });
});
