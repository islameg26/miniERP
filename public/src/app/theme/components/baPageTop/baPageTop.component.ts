import {Component} from '@angular/core';

import {GlobalState} from '../../../global.state';
import { AuthenticationService } from "../../../services/auth.service"
import { CurrentUser } from "../../../Models"

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;
  currentUser: CurrentUser = this._auth.getUser();

  constructor(private _state:GlobalState, private _auth: AuthenticationService) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  SignOut(){
    this._auth.logout()
  }
}
