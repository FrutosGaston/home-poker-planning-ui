import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

const STORAGE_KEY = 'activeLang';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent implements OnInit {
  public activeLang = localStorage.getItem(STORAGE_KEY) || 'en';

  constructor(
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang(this.activeLang);
  }

  ngOnInit(): void { }

  changeLanguage(lang): void {
    this.activeLang = lang;
    this.translate.use(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

}
