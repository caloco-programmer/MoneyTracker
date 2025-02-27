import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AhorrosPage } from './ahorros.page';

describe('AhorrosPage', () => {
  let component: AhorrosPage;
  let fixture: ComponentFixture<AhorrosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AhorrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
