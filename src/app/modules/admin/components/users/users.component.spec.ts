import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { UsersService } from '../../services/users.service';
import { of } from 'rxjs';
import { TableModule } from '@piros/table';

describe('UsersComponent', () => {

  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async(() => {

    usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUsers']);

    TestBed.configureTestingModule({
      imports: [ TableModule ],
      declarations: [ UsersComponent ],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy }
      ]
    })
    .compileComponents();
    
    usersServiceSpy.getUsers.and.returnValue(of({
      users:[],
      total: 0
    }));

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
