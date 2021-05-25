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
import {DeckService} from '../../../../services/deck.service';
import {MatSelectModule} from '@angular/material/select';
import {DeckModel} from '../../../../models/Deck.model';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';

describe('CreateRoomComponent', () => {
  let component: CreateRoomComponent;
  let nameField;
  let titleField;
  let descriptionField;
  let deckField;
  let fixture: ComponentFixture<CreateRoomComponent>;
  let guestUserServiceSpy;
  let roomServiceSpy;
  let deckServiceSpy;

  beforeEach(waitForAsync(async () => {
    guestUserServiceSpy = jasmine.createSpyObj('GuestUserService', ['create']);
    roomServiceSpy = jasmine.createSpyObj('RoomService', ['create']);
    deckServiceSpy = jasmine.createSpyObj('DeckService', ['findDecks']);
    await TestBed.configureTestingModule({
      declarations: [ CreateRoomComponent, TranslatePipeStub ],
      providers: [
        { provide: GuestUserService, useValue: guestUserServiceSpy },
        { provide: RoomService, useValue: roomServiceSpy },
        { provide: DeckService, useValue: deckServiceSpy },
        { provide: Router, useClass: RouterStub }
      ],
      imports: [
        FormsModule,
        MatSelectModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule
      ]    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CreateRoomComponent);
        component = fixture.componentInstance;
        jasmine.createSpyObj('GuestUserService', ['create']);
        guestUserServiceSpy.create.and.returnValue(of(1));
        roomServiceSpy.create.and.returnValue(of(1));
        deckServiceSpy.findDecks.and.returnValue(of([new DeckModel({id: 1, name: 'fibonacci', cards: [{value: 1}]})]));
        fixture.detectChanges();
      });
  }));

  it('should validate name is required', () => {
    setupFields();
    const anyName = 'Pepe';
    nameField.setValue(null);

    expect(nameField.errors.required).toBeTrue();
    nameField.setValue(anyName);
    expect(nameField.errors && nameField.errors.required).toBeNull();
  });

  it('should validate name has as minimum 3 characters', () => {
    setupFields();
    const twoCharacterName = 'Pe';

    nameField.setValue(twoCharacterName);
    expect(!!nameField.errors.minlength).toBeTrue();
  });

  it('should validate name has as maximum 20 characters', () => {
    setupFields();
    const twentyOneCharacterName = 'Pepepepepepepepepepep';

    nameField.setValue(twentyOneCharacterName);
    expect(!!nameField.errors.maxlength).toBeTrue();
  });

  it('should validate title is required', () => {
    setupFields();
    const anyTitle = 'Sprint 1';
    titleField.setValue(null);

    expect(titleField.errors.required).toBeTrue();
    titleField.setValue(anyTitle);
    expect(titleField.errors && titleField.errors.required).toBeNull();
  });

  it('should validate title lenght is greater than 2', () => {
    setupFields();
    const invalidTitle = '12';
    nameField.setValue('Pepe');

    titleField.setValue(invalidTitle);
    expect(!!titleField.errors.minlength).toBeTrue();
  });

  it('should validate deck is required', () => {
    setupFields();
    const anyTitle = 'Sprint 1';
    titleField.setValue(null);

    expect(titleField.errors.required).toBeTrue();
    titleField.setValue(anyTitle);
    expect(titleField.errors && titleField.errors.required).toBeNull();
  });

  it('should not call room nor guest users services when submits an invalid form', () => {
    expect(component.roomForm.valid).toBeFalse();

    component.submit();

    expect(roomServiceSpy.create).not.toHaveBeenCalled();
    expect(guestUserServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should call room and guest users services when submits a valid form', () => {
    setupFields();

    expect(component.roomForm.valid).toBeTrue();

    component.submit();

    expect(roomServiceSpy.create).toHaveBeenCalled();
    expect(guestUserServiceSpy.create).toHaveBeenCalled();
  });

  const setupFields = () => {
    nameField = component.roomForm.controls.name;
    titleField = component.roomForm.controls.title;
    descriptionField = component.roomForm.controls.description;
    deckField = component.roomForm.controls.deck;
    nameField.setValue('Pepe');
    titleField.setValue('Sprint 1');
    deckField.setValue('1');
  };
});
