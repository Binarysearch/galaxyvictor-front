import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../model/user.interface';
import { ApiService } from 'src/app/services/api.service';

export interface UserListDto {
  total: number;
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private api: ApiService) { }

  public getUsers(): Observable<UserListDto> {
    return this.api.request<UserListDto>('get-users', '');
  }
}
