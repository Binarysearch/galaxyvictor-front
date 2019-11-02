import { Component, OnInit } from '@angular/core';
import { TableConfig, LocalDataSource } from '@piros/table';
import { User } from 'src/app/model/user.interface';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

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
