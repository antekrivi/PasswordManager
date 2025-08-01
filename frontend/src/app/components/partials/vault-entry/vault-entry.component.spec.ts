import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultEntryComponent } from './vault-entry.component';

describe('VaultEntryComponent', () => {
  let component: VaultEntryComponent;
  let fixture: ComponentFixture<VaultEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VaultEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaultEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
