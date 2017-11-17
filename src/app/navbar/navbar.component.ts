import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public user;


  constructor() { }

  ngOnInit() {
     this.user = JSON.parse(localStorage.getItem('currentUser'));
     console.log("Nav bar User :" + this.user);

  }

}


