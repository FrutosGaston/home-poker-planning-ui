import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {GuestLoginComponent} from './guest-login.component';
import {TranslatePipeStub} from '../../../../stubs/translate-pipe.stub';
import {GuestUserService} from '../../../../services/guest-user.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterStub} from '../../../../stubs/router.stub';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

describe('GuestLoginComponent', () => {
  let component: GuestLoginComponent;
  let nameField;
  let spectatorField;
  let fixture: ComponentFixture<GuestLoginComponent>;
  let guestUserServiceSpy;

  beforeEach(waitForAsync(async () => {
    guestUserServiceSpy = jasmine.createSpyObj('GuestUserService', ['create'])
    await TestBed.configureTestingModule({
      declarations: [ GuestLoginComponent, TranslatePipeStub ],
      providers: [
        { provide: GuestUserService, useValue: guestUserServiceSpy },
        { provide: Router, useClass: RouterStub}
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule
      ]})
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(GuestLoginComponent);
        component = fixture.componentInstance;
        jasmine.createSpyObj('GuestUserService', ['create']);
        guestUserServiceSpy.create.and.returnValue(of());
        fixture.detectChanges();
        nameField = () => component.guestForm.controls.name;
        spectatorField = () => component.guestForm.controls.spectator;
      });
  }));

  it('should validate name is required', () => {
    const anyName = 'Pepe';

    expect(nameField().errors.required).toBeTrue();
    nameField().setValue(anyName);
    expect(nameField().errors && nameField().errors.required).toBeNull();
  });

  it('should validate name has as minimum 3 characters', () => {
    const twoCharacterName = 'Pe';
    nameField().setValue(twoCharacterName);
    expect(!!nameField().errors.minlength).toBeTrue();
  });

  it('should validate name has as maximum 20 characters', () => {
    const twentyOneCharacterName = 'Pepepepepepepepepepep';
    nameField().setValue(twentyOneCharacterName);
    expect(!!nameField().errors.maxlength).toBeTrue();
  });

  it('should not call guest users service when submits an invalid form', () => {
    expect(component.guestForm.valid).toBeFalse();

    component.submit();

    expect(guestUserServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should call guest users service when submits a valid form', () => {
    nameField().setValue('Pepe');
    expect(component.guestForm.valid).toBeTrue();

    component.submit();

    expect(guestUserServiceSpy.create).toHaveBeenCalled();
  });
});
