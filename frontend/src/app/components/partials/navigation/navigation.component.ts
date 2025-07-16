import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'nav',
  standalone: false,
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit{

  public title: string = '';

  constructor(private router: Router, 
    private titleService: Title,
    private authService: AuthService) { }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme == 'dark') {
      document.body.classList.add('dark-theme');
    }
  }

  
  toggleDarkMode(): void {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
