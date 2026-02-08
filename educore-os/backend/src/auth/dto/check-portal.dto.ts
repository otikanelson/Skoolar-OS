import { IsString, IsNotEmpty } from 'class-validator';

export class CheckPortalDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; // Can be subdomain or custom domain
}
