import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { CreateRoomComponent } from './create-room.component';
import {GuestLoginComponent} from '../guest-login/guest-login.component';
import {TranslatePipeStub} from '../../../../stubs/translate-pipe.stub';
import {GuestUserService} from '../../../../services/guest-user.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../../stubs/router.stub';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {RoomService} from '../../../../services/room.service';

describe('CreateRoomComponent', () => {
  let component: CreateRoomComponent;
  let nameField;
  let titleField;
  let descriptionField;
  let fixture: ComponentFixture<CreateRoomComponent>;
  let guestUserServiceSpy;
  let roomServiceSpy;

  beforeEach(waitForAsync(async () => {
    guestUserServiceSpy = jasmine.createSpyObj('GuestUserService', ['create']);
    roomServiceSpy = jasmine.createSpyObj('RoomService', ['create']);
    await TestBed.configureTestingModule({
      declarations: [ CreateRoomComponent, TranslatePipeStub ],
      providers: [
        { provide: GuestUserService, useValue: guestUserServiceSpy },
        { provide: RoomService, useValue: roomServiceSpy },
        { provide: Router, useClass: RouterStub }
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ]    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CreateRoomComponent);
        component = fixture.componentInstance;
        jasmine.createSpyObj('GuestUserService', ['create']);
        guestUserServiceSpy.create.and.returnValue(of(1));
        roomServiceSpy.create.and.returnValue(of(1));
        fixture.detectChanges();
        nameField = component.roomForm.controls.name;
        titleField = component.roomForm.controls.title;
        descriptionField = component.roomForm.controls.description;
      });
  }));

  it('should validate name is required', () => {
    const anyName = 'Pepe';
    titleField.setValue('Sprint 1');

    expect(nameField.errors.required).toBeTrue();
    nameField.setValue(anyName);
    expect(nameField.errors && nameField.errors.required).toBeNull();
  });

  it('should validate name has as minimum 3 characters', () => {
    const twoCharacterName = 'Pe';
    titleField.setValue('Sprint 1');
    nameField.setValue(twoCharacterName);
    expect(!!nameField.errors.minlength).toBeTrue();
  });

  it('should validate name has as maximum 20 characters', () => {
    const twentyOneCharacterName = 'Pepepepepepepepepepep';
    titleField.setValue('Sprint 1');
    nameField.setValue(twentyOneCharacterName);
    expect(!!nameField.errors.maxlength).toBeTrue();
  });

  it('should validate title is required', () => {
    const anyTitle = 'Sprint 1';
    nameField.setValue('Pepe');

    expect(titleField.errors.required).toBeTrue();
    titleField.setValue(anyTitle);
    expect(titleField.errors && titleField.errors.required).toBeNull();
  });

  it('should validate title lenght is greater than 2', () => {
    const invalidTitle = '12';
    nameField.setValue('Pepe');

    titleField.setValue(invalidTitle);
    expect(!!titleField.errors.minlength).toBeTrue();
  });

  it('should not call room nor guest users services when submits an invalid form', () => {
    expect(component.roomForm.valid).toBeFalse();

    component.submit();

    expect(roomServiceSpy.create).not.toHaveBeenCalled();
    expect(guestUserServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should call room and guest users services when submits a valid form', () => {
    nameField.setValue('Pepe');
    titleField.setValue('Sprint 1');
    expect(component.roomForm.valid).toBeTrue();

    component.submit();

    expect(roomServiceSpy.create).toHaveBeenCalled();
    expect(guestUserServiceSpy.create).toHaveBeenCalled();
  });
});
