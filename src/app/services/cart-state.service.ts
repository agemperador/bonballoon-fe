import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private _showCart = new BehaviorSubject<boolean>(false);
  private _count = new BehaviorSubject<number>(0);

  readonly showCart$ = this._showCart.asObservable();
  readonly count$ = this._count.asObservable();

  toggle(){ this._showCart.next(!this._showCart.value) }
  open(){ this._showCart.next(true) }
  close(){ this._showCart.next(false) }

  setCount(n: number){ this._count.next(n) }
}
