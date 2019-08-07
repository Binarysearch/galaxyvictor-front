import { Component, OnInit } from '@angular/core';
import { ApiInfo, EndPointService, Endpoint } from '../../../../services/end-point.service';
import { TableConfig, LocalDataSource } from '@piros/table';
import { User } from 'src/app/model/user.interface';
import { RequestService } from 'src/app/services/request.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  apiInfo: ApiInfo;

  config: TableConfig<User>;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersService.getUsers().subscribe(result => {
      this.config = {
        columnDefs: [
          { id: 'id', name: 'Id', sortable: true },
          { id: 'email', name: 'Email', sortable: true }
        ],
        dataSource: new LocalDataSource<User>(result.users)
      };
    });
  }

}
