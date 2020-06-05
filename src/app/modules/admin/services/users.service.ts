import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../model/user.interface';
import { GvApiService } from '../../../services/gv-api.service';

export interface UserListDto {
  total: number;
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private api: GvApiService) { }

  public getUsers(): Observable<UserListDto> {
    return this.api.getUsers();
  }
}
