import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent{
  @Input() products: any[] = [];
  @Input() loading = false;
  @Output() addToCart = new EventEmitter<any>();
}
