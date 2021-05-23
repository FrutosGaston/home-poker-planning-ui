import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Home Planning Poker';
  darkModeToggleControl = new FormControl(JSON.parse(localStorage.getItem('darkMode')) || false);
  @HostBinding('class') className = '';

  constructor(private overlay: OverlayContainer) { }

  ngOnInit(): void {
    this.setTheme(this.darkModeToggleControl.value);
    this.darkModeToggleControl.valueChanges.subscribe((darkMode) => {
      this.setTheme(darkMode);
    });
  }

  private setTheme(darkMode: boolean): void {
    const darkClassName = 'dark-mode';
    const lightClassName = 'light-mode';
    this.className = darkMode ? darkClassName : lightClassName;

    if (darkMode) {
      localStorage.setItem('darkMode', 'true');
      this.overlay.getContainerElement().classList.add(darkClassName);
      this.overlay.getContainerElement().classList.remove(lightClassName);
    } else {
      localStorage.setItem('darkMode', 'false');
      this.overlay.getContainerElement().classList.add(lightClassName);
      this.overlay.getContainerElement().classList.remove(darkClassName);
    }
  }
}
