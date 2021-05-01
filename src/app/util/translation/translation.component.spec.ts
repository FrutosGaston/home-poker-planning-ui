import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { TranslationComponent } from './translation.component';
import {TranslateService} from '@ngx-translate/core';
import {MatMenuModule} from '@angular/material/menu';
import {TranslatePipeStub} from '../../stubs/translate-pipe.stub';

describe('TranslationComponent', () => {
  let component: TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;
  const translationServiceSpy = jasmine.createSpyObj('TranslationService', ['use', 'setDefaultLang']);

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslationComponent, TranslatePipeStub ],
      providers: [{ provide: TranslateService, useValue: translationServiceSpy }],
      imports: [ MatMenuModule ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TranslationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should change the active lang', () => {
    const defaultLang = 'es';
    const newLang = 'en';
    expect(component.activeLang).toBe(defaultLang);

    component.changeLanguage(newLang);

    expect(component.activeLang).toBe(newLang);
  });

  it('should ask the translate service to use the active lang', () => {
    const newLang = 'en';

    component.changeLanguage(newLang);

    expect(translationServiceSpy.use).toHaveBeenCalledWith(newLang);
  });
});
