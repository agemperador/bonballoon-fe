import { Component } from '@angular/core';
import { CartStateService } from '../../services/cart-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  count = 0;
  constructor(private cartState: CartStateService){
    this.cartState.count$.subscribe(n => this.count = n);
  }

  toggle(){ this.cartState.toggle() }
}
