import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'nav',
  standalone: false,
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit{

  constructor(private router: Router) { }

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
    this.router.navigateByUrl('/');
  }
}
