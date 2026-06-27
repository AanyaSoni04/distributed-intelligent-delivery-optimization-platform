import { prisma } from '../../plugins/prisma';
import { CreateAddressInput, UpdateAddressInput, UpdateProfileInput } from './customer.schema';
import { AddressStatus } from '@prisma/client';

export class CustomerService {
  async getProfile(userId: string) {
    let profile = await prisma.customerProfile.findUnique({
      where: { userId },
      include: { addresses: { where: { isDeleted: false, isDefault: true } } },
    });

    return profile;
  }

  async upsertProfile(userId: string, data: UpdateProfileInput) {
    const profile = await prisma.customerProfile.upsert({
      where: { userId },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
      },
      create: {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
      },
    });

    return profile;
  }

  async getAddresses(customerId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const [addresses, total] = await Promise.all([
      prisma.address.findMany({
        where: { customerId, isDeleted: false },
        skip,
        take: limit,
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.address.count({
        where: { customerId, isDeleted: false },
      }),
    ]);

    return { addresses, total, page, limit };
  }

  async searchAddresses(customerId: string, query: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const whereClause = {
      customerId,
      isDeleted: false,
      OR: [
        { addressLine1: { contains: query, mode: 'insensitive' as const } },
        { city: { contains: query, mode: 'insensitive' as const } },
        { postalCode: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    const [addresses, total] = await Promise.all([
      prisma.address.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.address.count({
        where: whereClause,
      }),
    ]);

    return { addresses, total, page, limit };
  }

  async getAddressById(customerId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, customerId, isDeleted: false },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    return address;
  }

  async createAddress(userId: string, customerId: string, data: CreateAddressInput) {
    // If it's the first address or explicitly set as default, we might need to handle default logic
    // but for now, we'll just create it. If isDefault is true, we should use a transaction.
    
    let createdAddress;
    
    if (data.isDefault) {
      createdAddress = await prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: { customerId, isDeleted: false },
          data: { isDefault: false },
        });
        
        return tx.address.create({
          data: {
            ...data,
            customerId,
            createdByUserId: userId,
          },
        });
      });
    } else {
      // Check if it's the very first address
      const count = await prisma.address.count({ where: { customerId, isDeleted: false } });
      const isDefault = count === 0;

      createdAddress = await prisma.address.create({
        data: {
          ...data,
          isDefault,
          customerId,
          createdByUserId: userId,
        },
      });
    }

    // TODO: Kafka CustomerAddressCreated
    return createdAddress;
  }

  async updateAddress(userId: string, customerId: string, addressId: string, data: UpdateAddressInput) {
    const existing = await this.getAddressById(customerId, addressId);

    if (data.isDefault && !existing.isDefault) {
      const updatedAddress = await prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
          where: { customerId, isDeleted: false },
          data: { isDefault: false },
        });

        return tx.address.update({
          where: { id: addressId },
          data: { ...data, updatedByUserId: userId },
        });
      });
      // TODO: Kafka CustomerAddressUpdated
      // TODO: Kafka CustomerDefaultAddressChanged
      return updatedAddress;
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: { ...data, updatedByUserId: userId },
    });

    // TODO: Kafka CustomerAddressUpdated
    return updatedAddress;
  }

  async deleteAddress(userId: string, customerId: string, addressId: string) {
    await this.getAddressById(customerId, addressId); // Ensure it exists and belongs to customer

    const deletedAddress = await prisma.address.update({
      where: { id: addressId },
      data: { 
        isDeleted: true, 
        deletedAt: new Date(),
        updatedByUserId: userId
      },
    });

    return deletedAddress;
  }

  async setDefaultAddress(userId: string, customerId: string, addressId: string) {
    await this.getAddressById(customerId, addressId);

    const updatedAddress = await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { customerId, isDeleted: false },
        data: { isDefault: false },
      });

      return tx.address.update({
        where: { id: addressId },
        data: { isDefault: true, updatedByUserId: userId },
      });
    });

    // TODO: Kafka CustomerDefaultAddressChanged
    return updatedAddress;
  }
}

export const customerService = new CustomerService();
