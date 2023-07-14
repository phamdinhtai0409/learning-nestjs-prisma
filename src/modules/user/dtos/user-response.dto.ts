import { HouseType } from "@prisma/client";

import { ResField } from "shared/decorators/dto.decorator";

export class UserListResponseDTO {
  @ResField()
  id: number;

  @ResField()
  name: string;

  @ResField()
  furiganaName: string;

  @ResField()
  email: string;

  @ResField()
  phone: string;

  @ResField()
  postCode: string;

  @ResField()
  address: string;

  @ResField()
  createdAt: Date;
}

export class UserDetailResponseDTO extends UserListResponseDTO {
  @ResField()
  email: string;

  @ResField()
  streetAddress: string;

  @ResField()
  apartmentName: string;

  @ResField()
  roomNumber: string;

  @ResField({ enum: HouseType })
  houseType: HouseType;
}
