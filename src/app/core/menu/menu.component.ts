import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../model/menu-item';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  title: string = "PRS";
  menuitems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuitems = [
      new MenuItem("User", "/user-list", "User List"),
      new MenuItem("Vendor", "/vendor-list", "Vendor List"),
      new MenuItem("Product", "/product-list", "Product List"),
      new MenuItem("Request", "/request-list", "Request List"),
      new MenuItem("Review", "/list-review/:userId", "List-Review List"),
      new MenuItem("Logout", "/user-login", "Login")
      // new MenuItem("Other", "/dummy", "Dummy Link")
    ];
  }

}
