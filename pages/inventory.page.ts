import { type Locator, type Page, expect } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly prices: Locator;
  readonly names: Locator;
  readonly sort: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.prices = page.getByTestId('inventory-item-price');
    this.names = page.getByTestId('inventory-item-name');
    this.sort = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  async addToCart(slug: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${slug}`).click();
  }

  async removeFromCart(slug: string): Promise<void> {
    await this.page.getByTestId(`remove-${slug}`).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sort.selectOption(option);
  }

  async priceValues(): Promise<number[]> {
    const texts = await this.prices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
