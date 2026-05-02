import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { CartStateService } from './services/cart-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterContentInit{
  products = [] as any[];
  loading = true;
  cart: any[] = [];
  showCart = false;
  creatingProduct = false;
  showCheckoutModal = false;
  checkoutEmail = '';
  checkoutSending = false;
  checkoutError = '';
  checkoutSuccess = '';
  orders: any[] = [];
  showOrders = false;
  ordersEmail = '';
  loadingOrders = false;
  ordersError = '';
  productForm = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: null as number | null,
  };
  productImage: File | null = null;

  constructor(private api: ApiService, private cartState: CartStateService){}

  ngOnInit(){ this.fetchProducts() }

  async ngAfterContentInit(){
    await this.loadCart();
    this.cartState.showCart$.subscribe(v => this.showCart = v);
  }

  async fetchProducts(){
    this.loading = true;
    this.products = (await this.api.getProducts()) || [];
    this.loading = false;
  }

  async createMocks(){
    await this.api.createMockProducts();
    await this.fetchProducts();
  }

  onProductImageSelected(event: Event){
    const input = event.target as HTMLInputElement;
    this.productImage = input.files && input.files.length > 0 ? input.files[0] : null;
  }

  async createProduct(){
    if(!this.productForm.name?.trim()) return alert('El nombre es obligatorio');
    if(!this.productImage) return alert('La imagen es obligatoria');
    if(this.productForm.price <= 0) return alert('El precio debe ser mayor a 0');

    this.creatingProduct = true;
    try{
      const formData = new FormData();
      formData.append('name', this.productForm.name.trim());
      formData.append('description', this.productForm.description || '');
      formData.append('price', String(this.productForm.price));
      formData.append('stock', String(this.productForm.stock ?? 0));
      const categoryId = Number(this.productForm.category_id);
      if(Number.isInteger(categoryId) && categoryId > 0){
        formData.append('category_id', String(categoryId));
      }
      formData.append('image', this.productImage);

      await this.api.createProduct(formData);
      this.productForm = { name: '', description: '', price: 0, stock: 0, category_id: null };
      this.productImage = null;
      await this.fetchProducts();
    }catch(err:any){
      const msg = err?.error?.detail || err?.message || 'No se pudo crear el producto';
      alert(`Error: ${msg}`);
    }finally{
      this.creatingProduct = false;
    }
  }

  async loadCart(){
    try{
      const res = await this.api.getCart();
      this.cart = res.items || [];
      this.cartState.setCount(this.cart.length || 0);
    }catch(err){ this.cart = [] }
  }

  get cartDetails(){
    return this.cart.map(ci => {
      const p = this.products.find(x => x.id === ci.product_id) || { name: 'Producto', price: 0 };
      return { ...ci, name: p.name, price: p.price };
    });
  }

  get cartTotal(){
    return this.cartDetails.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0);
  }

  toggleCart(){ this.cartState.toggle() }

  async removeItem(product_id: number){
    await this.api.removeFromCart(product_id);
    await this.loadCart();
  }

  async addToCart(p: any){
    await this.api.addToCart(p.id, 1);
    await this.loadCart();
  }

  async getOrders(){
    const email = this.ordersEmail.trim();
    if(!email){
      this.ordersError = 'Ingresa un email para ver tus pedidos';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(!emailPattern.test(email)){
      this.ordersError = 'El email no es válido';
      return;
    }

    this.loadingOrders = true;
    this.ordersError = '';
    try{
      this.orders = (await this.api.getOrdersByEmail(email)) || [];
      if(this.orders.length === 0){
        this.ordersError = 'No hay pedidos registrados para este email';
      }
    }catch(err:any){
      this.ordersError = 'Error al obtener los pedidos';
    }finally{
      this.loadingOrders = false;
    }
  }

  toggleOrders(){
    this.showOrders = !this.showOrders;
    if(!this.showOrders){
      this.ordersEmail = '';
      this.orders = [];
      this.ordersError = '';
    }
  }

  async checkout(){
    this.checkoutError = '';
    this.checkoutSuccess = '';
    if(this.cart.length===0){
      this.checkoutError = 'Carrito vacío';
      this.showCheckoutModal = true;
      return;
    }
    this.showCheckoutModal = true;
  }

  closeCheckoutModal(){
    if(this.checkoutSending) return;
    this.showCheckoutModal = false;
    this.checkoutError = '';
    this.checkoutSuccess = '';
  }

  async submitCheckout(){
    const email = this.checkoutEmail.trim();
    if(!email){
      this.checkoutError = 'Ingresa un email para recibir tu pedido';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(!emailPattern.test(email)){
      this.checkoutError = 'El email no es válido';
      return;
    }

    this.checkoutSending = true;
    this.checkoutError = '';
    try{
      await this.api.createOrder({ email, name:'Cliente', items: this.cart });
      this.checkoutSuccess = 'Pedido enviado con éxito. Revisa tu casilla de correo.';
      this.checkoutEmail = '';
      this.cart = [];
      this.cartState.setCount(0);
      this.showCart = false;
      // Cierra el modal automáticamente después de 2 segundos
      setTimeout(() => {
        this.closeCheckoutModal();
      }, 2000);
    }catch(err:any){
      console.error('Order error', err);
      let msg = 'Error desconocido';
      const body = err?.error;
      if(body){
        const detail = body.detail ?? body;
        if(typeof detail === 'string') msg = detail;
        else if(detail?.message) msg = detail.message;
        else if(detail?.detail) msg = (typeof detail.detail === 'string') ? detail.detail : (detail.detail.message ?? JSON.stringify(detail.detail));
        else if(detail?.error && detail?.message) msg = detail.message;
        else msg = JSON.stringify(detail);
      } else if(err?.message){
        msg = err.message;
      }
      this.checkoutError = 'Error: ' + msg;
    }finally{
      this.checkoutSending = false;
    }
  }
}
