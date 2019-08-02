import { Injectable } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { Observable } from 'rxjs';
import { User } from '../../../model/user.interface';

export interface UserListDto {
  total: number;
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private requestService: RequestService) { }

  public getUsers(): Observable<UserListDto> {
    return this.requestService.request<UserListDto>({ type: 'get-users', payload: '' });
  }
}
